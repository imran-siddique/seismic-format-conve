import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, Settings, Clock, FileText, CheckCircle, XCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { FileUploadZone } from '@/components/FileUploadZone'
import { ConversionHistory } from '@/components/ConversionHistory'
import { FormatSelector } from '@/components/FormatSelector'

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
  downloadUrl?: string
}

function App() {
  const [currentFile, setCurrentFile] = useState<SeismicFile | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>('')
  const [currentJob, setCurrentJob] = useState<ConversionJob | null>(null)
  const [conversionHistory, setConversionHistory] = useKV<ConversionJob[]>('conversion-history', [])

  const handleFileSelect = useCallback((file: File) => {
    // Simulate format detection based on file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const formatMap: Record<string, string> = {
      'segy': 'SEG-Y',
      'sgy': 'SEG-Y',
      'su': 'Seismic Unix',
      'txt': 'ASCII',
      'dat': 'ASCII',
      'csv': 'ASCII'
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
    
    // Simulate processing with progress updates
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setCurrentJob(prev => prev ? { ...prev, progress } : null)
    }

    // Simulate file processing result
    const success = Math.random() > 0.1 // 90% success rate
    
    if (success) {
      const completedJob: ConversionJob = {
        ...job,
        status: 'completed',
        progress: 100,
        downloadUrl: `blob:${URL.createObjectURL(currentFile!.file)}`
      }
      
      setCurrentJob(completedJob)
      setConversionHistory(prev => [completedJob, ...prev.slice(0, 9)]) // Keep last 10
    } else {
      const errorJob: ConversionJob = {
        ...job,
        status: 'error',
        error: 'File format not supported or corrupted data detected'
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
    
    const link = document.createElement('a')
    link.href = job.downloadUrl
    link.download = `${job.fileName.split('.')[0]}_converted.${job.targetFormat.toLowerCase()}`
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
          <h1 className="text-3xl font-bold tracking-tight">Seismic File Converter</h1>
          <p className="text-muted-foreground">
            Convert seismic data files between different formats for modern web applications
          </p>
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
                <Alert className="border-accent/50 bg-accent/5">
                  <CheckCircle size={16} className="text-accent" />
                  <AlertDescription>
                    File converted successfully from {currentJob.sourceFormat} to {currentJob.targetFormat}
                    <Button 
                      onClick={() => handleDownload(currentJob)}
                      variant="outline" 
                      size="sm" 
                      className="ml-4"
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </AlertDescription>
                </Alert>
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