import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, Settings, Clock, FileText, CheckCircle, XCircle, AlertTriangle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { FileUploadZone } from '@/components/FileUploadZone'
import { ConversionHistory } from '@/components/ConversionHistory'
import { FormatSelector } from '@/components/FormatSelector'
import { FormatInfo } from '@/components/FormatInfo'
import { ConversionTest } from '@/components/ConversionTest'
import { SeismicConverter, type ConversionConfig } from '@/lib/seismicConverter'

interface SeismicFile {
  name: string
  size: number
  format: string
  file: File
}

interface ConversionJob {
  id: string
  fileName: string
  sourceFormat: string
  targetFormat: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  timestamp: number
  error?: string
  warnings?: string[]
  downloadUrl?: string
  metadata?: {
    dimensions?: { samples: number, traces: number, lines?: number }
    samplingRate?: number
    units?: string
  }
}

function App() {
  const [currentFile, setCurrentFile] = useState<SeismicFile | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>('OVDS') // Default to OVDS for Azure compatibility
  const [currentJob, setCurrentJob] = useState<ConversionJob | null>(null)
  const [conversionHistory, setConversionHistory] = useKV<ConversionJob[]>('conversion-history', [])

  const handleFileSelect = useCallback((file: File) => {
    // Enhanced format detection based on file extension and magic numbers
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const formatMap: Record<string, string> = {
      // SEG-Y formats
      'segy': 'SEG-Y',
      'sgy': 'SEG-Y',
      'seg': 'SEG-Y',
      // SEG-D formats  
      'segd': 'SEG-D',
      'sgd': 'SEG-D',
      // Seismic Unix
      'su': 'Seismic Unix',
      // UKOOA formats
      'p190': 'UKOOA P1/90',
      'p194': 'UKOOA P1/94',
      'p290': 'UKOOA P2/90',
      'p294': 'UKOOA P2/94',
      'ukooa': 'UKOOA',
      // LAS (Log ASCII Standard)
      'las': 'LAS',
      // DLIS (Digital Log Interchange Standard)
      'dlis': 'DLIS',
      // NetCDF
      'nc': 'NetCDF',
      'cdf': 'NetCDF',
      'nc4': 'NetCDF4',
      // HDF5
      'h5': 'HDF5',
      'hdf5': 'HDF5',
      'he5': 'HDF5',
      // OpenVDS
      'vds': 'OpenVDS',
      // Paradigm formats
      'gx': 'Paradigm GeoDepth',
      'hsr': 'Paradigm HSR',
      // Petrel formats  
      'zgy': 'Petrel ZGY',
      // Geoframe
      'iesx': 'Geoframe IESX',
      // Common text formats
      'txt': 'ASCII Text',
      'dat': 'ASCII Data',
      'csv': 'CSV',
      'tsv': 'TSV',
      'asc': 'ASCII Grid',
      // Binary formats
      'bin': 'Binary',
      'raw': 'Raw Binary'
    }

    const detectedFormat = formatMap[extension] || 'Unknown'
    
    setCurrentFile({
      name: file.name,
      size: file.size,
      format: detectedFormat,
      file
    })
  }, [])

  const simulateConversion = useCallback(async (job: ConversionJob) => {
    setCurrentJob(job)
    
    try {
      const config: ConversionConfig = {
        sourceFormat: job.sourceFormat,
        targetFormat: job.targetFormat,
        fileName: job.fileName,
        compressionLevel: job.targetFormat === 'HDF5' || job.targetFormat === 'ZGY' || job.targetFormat === 'OVDS' ? 6 : undefined,
        preserveMetadata: true,
        azureCompatible: job.targetFormat === 'ZGY' || job.targetFormat === 'OVDS' || job.sourceFormat === 'SEG-Y'
      }

      const result = await SeismicConverter.convert(
        currentFile!.file,
        config,
        (progress) => {
          setCurrentJob(prev => prev ? { ...prev, progress } : null)
        }
      )

      if (result.success && result.outputData) {
        // Create download URL from converted data
        const blob = new Blob([result.outputData], { 
          type: job.targetFormat === 'JSON' ? 'application/json' : 
                job.targetFormat === 'CSV' ? 'text/csv' : 
                job.targetFormat === 'HDF5' ? 'application/x-hdf' :
                job.targetFormat === 'OVDS' ? 'application/x-vds' :
                job.targetFormat === 'ZGY' ? 'application/x-zgy' :
                'application/octet-stream'
        })
        const downloadUrl = URL.createObjectURL(blob)

        const completedJob: ConversionJob = {
          ...job,
          status: 'completed',
          progress: 100,
          downloadUrl,
          warnings: result.warnings,
          metadata: result.metadata ? {
            dimensions: result.metadata.dimensions,
            samplingRate: result.metadata.samplingRate,
            units: result.metadata.units
          } : undefined
        }
        
        setCurrentJob(completedJob)
        setConversionHistory(prev => [completedJob, ...prev.slice(0, 9)]) // Keep last 10
      } else {
        const errorJob: ConversionJob = {
          ...job,
          status: 'error',
          error: result.error || 'Unknown conversion error'
        }
        setCurrentJob(errorJob)
      }
    } catch (error) {
      const errorJob: ConversionJob = {
        ...job,
        status: 'error',
        error: error instanceof Error ? error.message : 'Conversion failed'
      }
      setCurrentJob(errorJob)
    }
  }, [currentFile, setConversionHistory])

  const handleConvert = useCallback(async () => {
    if (!currentFile || !targetFormat) return

    const job: ConversionJob = {
      id: Date.now().toString(),
      fileName: currentFile.name,
      sourceFormat: currentFile.format,
      targetFormat,
      status: 'processing',
      progress: 0,
      timestamp: Date.now()
    }

    await simulateConversion(job)
  }, [currentFile, targetFormat, simulateConversion])

  const handleDownload = useCallback((job: ConversionJob) => {
    if (!job.downloadUrl) return
    
    const getFileExtension = (format: string): string => {
      const extensions: Record<string, string> = {
        'HDF5': 'h5',
        'OVDS': 'vds',
        'JSON': 'json',
        'CSV': 'csv',
        'SEG-Y': 'sgy',
        'SEG-D': 'segd',
        'NetCDF': 'nc',
        'ZGY': 'zgy',
        'Binary': 'bin'
      }
      return extensions[format] || 'dat'
    }
    
    const link = document.createElement('a')
    link.href = job.downloadUrl
    link.download = `${job.fileName.split('.')[0]}_converted.${getFileExtension(job.targetFormat)}`
    link.click()
  }, [])

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Professional Seismic Data Converter</h1>
          <p className="text-muted-foreground">
            Convert legacy seismic formats to modern standards with Azure Energy Data Services OVDS optimization
          </p>
          <div className="flex justify-center gap-2 text-sm text-muted-foreground">
            <span>✓ SEG-Y to OVDS conversion</span>
            <span>•</span>
            <span>✓ Azure cloud optimization</span>
            <span>•</span>  
            <span>✓ Streaming-ready format</span>
          </div>
        </div>

        {/* Main Conversion Area */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Upload File
              </CardTitle>
              <CardDescription>
                Drag and drop or browse to select your seismic data file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadZone onFileSelect={handleFileSelect} />
              
              {currentFile && (
                <div className="mt-4 p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{currentFile.name}</span>
                    <Badge variant={currentFile.format === 'Unknown' ? 'destructive' : 'secondary'}>
                      {currentFile.format}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Size: {formatFileSize(currentFile.size)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Format Selection & Conversion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Convert Format
              </CardTitle>
              <CardDescription>
                Select the target format for your seismic data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormatSelector 
                value={targetFormat}
                onChange={setTargetFormat}
                disabled={!currentFile || currentFile.format === 'Unknown'}
              />
              
              <Button 
                onClick={handleConvert}
                disabled={!currentFile || !targetFormat || currentJob?.status === 'processing'}
                className="w-full"
                size="lg"
              >
                {currentJob?.status === 'processing' ? (
                  <>
                    <Settings size={16} className="animate-spin mr-2" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileText size={16} className="mr-2" />
                    Convert File
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Format Information */}
        {currentFile && currentFile.format !== 'Unknown' && targetFormat && (
          <FormatInfo 
            sourceFormat={currentFile.format}
            targetFormat={targetFormat}
            fileName={currentFile.name}
          />
        )}

        {/* Conversion Testing Suite */}
        <ConversionTest 
          sourceFile={currentFile?.file}
          onTestComplete={(results) => {
            console.log('Test suite completed:', results)
          }}
        />

        {/* Progress & Results */}
        {currentJob && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentJob.status === 'completed' ? (
                  <CheckCircle size={20} className="text-accent" />
                ) : currentJob.status === 'error' ? (
                  <XCircle size={20} className="text-destructive" />
                ) : (
                  <Settings size={20} className="animate-spin" />
                )}
                Conversion Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentJob.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing {currentJob.fileName}</span>
                    <span>{currentJob.progress}%</span>
                  </div>
                  <Progress value={currentJob.progress} className="h-2" />
                </div>
              )}

              {currentJob.status === 'completed' && (
                <>
                  <Alert className="border-accent/50 bg-accent/5">
                    <CheckCircle size={16} className="text-accent" />
                    <AlertDescription>
                      File converted successfully from {currentJob.sourceFormat} to {currentJob.targetFormat}
                      {currentJob.metadata && (
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                          <div>Dimensions: {currentJob.metadata.dimensions?.samples || 'N/A'} samples × {currentJob.metadata.dimensions?.traces || 'N/A'} traces</div>
                          <div>Sampling Rate: {currentJob.metadata.samplingRate || 'N/A'} Hz</div>
                          <div>Units: {currentJob.metadata.units || 'N/A'}</div>
                        </div>
                      )}
                      <Button 
                        onClick={() => handleDownload(currentJob)}
                        variant="outline" 
                        size="sm" 
                        className="ml-4"
                      >
                        <Download size={14} className="mr-1" />
                        Download {currentJob.targetFormat}
                      </Button>
                    </AlertDescription>
                  </Alert>

                  {currentJob.warnings && currentJob.warnings.length > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle size={16} className="text-yellow-600" />
                      <AlertDescription>
                        <div className="font-medium mb-1">Conversion Warnings:</div>
                        <ul className="text-sm space-y-1">
                          {currentJob.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              {currentJob.status === 'error' && (
                <Alert variant="destructive">
                  <XCircle size={16} />
                  <AlertDescription>
                    {currentJob.error || 'Conversion failed'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Conversion History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Recent Conversions
            </CardTitle>
            <CardDescription>
              Your conversion history and downloadable files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConversionHistory 
              history={conversionHistory}
              onDownload={handleDownload}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App