# 🔧 API Reference

Complete technical reference for the Seismic Format Converter API, components, and utilities.

## 📚 Core API

### **SeismicConverter Class**

The main conversion engine that handles all format transformations.

```typescript
class SeismicConverter {
  static async convert(
    file: File,
    config: ConversionConfig,
    progressCallback?: (progress: number) => void
  ): Promise<ConversionResult>
  
  static async validateForAzure(
    file: File,
    sourceFormat: string
  ): Promise<AzureValidationResult>
  
  static getSupportedFormats(): FormatDefinition[]
  static getFormatInfo(format: string): FormatInfo
}
```

#### **convert()**

Primary conversion method that transforms files between formats.

**Parameters:**
- `file: File` - The input file to convert
- `config: ConversionConfig` - Conversion configuration options
- `progressCallback?: (progress: number) => void` - Optional progress updates

**Returns:** `Promise<ConversionResult>`

**Example:**
```typescript
const config: ConversionConfig = {
  sourceFormat: 'SEG-Y',
  targetFormat: 'HDF5',
  preserveMetadata: true,
  compressionLevel: 6
}

const result = await SeismicConverter.convert(file, config, (progress) => {
  console.log(`Progress: ${progress}%`)
})

if (result.success) {
  console.log('Conversion completed successfully')
  // result.outputData contains the converted file
}
```

#### **validateForAzure()**

Validates files for Azure Energy Data Services compatibility.

**Parameters:**
- `file: File` - File to validate
- `sourceFormat: string` - Detected or specified source format

**Returns:** `Promise<AzureValidationResult>`

**Example:**
```typescript
const validation = await SeismicConverter.validateForAzure(file, 'SEG-Y')

if (validation.isAzureCompatible) {
  console.log('File is Azure EDS compatible')
} else {
  console.log('Issues found:', validation.recommendations)
}
```

### **Type Definitions**

#### **ConversionConfig**

Configuration object for conversions.

```typescript
interface ConversionConfig {
  sourceFormat: string              // Source format identifier
  targetFormat: string              // Target format identifier
  fileName?: string                 // Optional filename override
  compressionLevel?: number         // 1-9, compression level
  chunkSize?: number               // Chunk size for streaming
  preserveMetadata?: boolean       // Preserve metadata when possible
  azureCompatible?: boolean        // Optimize for Azure workflows
  useStreaming?: boolean           // Use streaming for large files
  customOptions?: Record<string, any> // Format-specific options
}
```

#### **ConversionResult**

Result object returned from conversions.

```typescript
interface ConversionResult {
  success: boolean                 // Conversion success status
  outputData?: ArrayBuffer         // Converted file data
  metadata?: SeismicMetadata       // Extracted/generated metadata
  error?: string                   // Error message if failed
  warnings?: string[]              // Non-fatal warnings
  processingTime?: number          // Processing time in milliseconds
  azureValidation?: AzureValidationResult // Azure compatibility info
}
```

#### **SeismicMetadata**

Metadata structure for seismic data.

```typescript
interface SeismicMetadata {
  format: string                   // Data format
  dimensions: {                    // Data dimensions
    samples: number                // Number of samples per trace
    traces: number                 // Number of traces
    lines?: number                 // Number of lines (3D data)
  }
  samplingRate: number             // Sample rate in Hz
  units: string                    // Measurement units
  coordinateSystem?: string        // Coordinate reference system
  acquisitionParameters?: Record<string, any> // Acquisition metadata
  processingHistory?: string[]     // Processing steps
  azureCompatibility?: {           // Azure-specific metadata
    version: string
    supportedOperations: string[]
    dataServiceEndpoint?: string
    optimizedFor?: string[]
  }
}
```

#### **AzureValidationResult**

Azure compatibility validation result.

```typescript
interface AzureValidationResult {
  isAzureCompatible: boolean       // Overall compatibility
  validationSteps: {               // Individual validation checks
    formatValidation: boolean      // Format is supported
    headerIntegrity: boolean       // Headers are valid
    geometryValidation: boolean    // Geometry is correct
    dataIntegrity: boolean         // Data is intact
  }
  recommendations?: string[]       // Improvement suggestions
}
```

## 🧩 React Components

### **FileUploadZone**

Drag-and-drop file upload component.

```typescript
interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  accept?: string[]              // Accepted file extensions
  maxSize?: number              // Maximum file size in bytes
  disabled?: boolean            // Disable upload
  className?: string            // Additional CSS classes
}

function FileUploadZone(props: FileUploadZoneProps): JSX.Element
```

**Usage:**
```tsx
<FileUploadZone
  onFileSelect={(file) => {
    console.log('File selected:', file.name)
    setCurrentFile(file)
  }}
  accept={['.segy', '.sgy', '.las', '.h5']}
  maxSize={5 * 1024 * 1024 * 1024} // 5GB
  disabled={isProcessing}
/>
```

### **FormatSelector**

Format selection dropdown component.

```typescript
interface FormatSelectorProps {
  value: string                  // Currently selected format
  onChange: (format: string) => void // Format change callback
  sourceFormat?: string          // Source format for filtering
  disabled?: boolean            // Disable selection
  showRecommendations?: boolean // Show format recommendations
  className?: string            // Additional CSS classes
}

function FormatSelector(props: FormatSelectorProps): JSX.Element
```

**Usage:**
```tsx
<FormatSelector
  value={targetFormat}
  onChange={setTargetFormat}
  sourceFormat={currentFile?.format}
  showRecommendations={true}
  disabled={!currentFile}
/>
```

### **ConversionTest**

Conversion validation test suite component.

```typescript
interface ConversionTestProps {
  sourceFile?: File              // File to test
  onTestComplete: (results: TestResults) => void // Test completion callback
  autoRun?: boolean             // Auto-run tests when file changes
  testCategories?: string[]     // Specific test categories to run
}

function ConversionTest(props: ConversionTestProps): JSX.Element
```

**Usage:**
```tsx
<ConversionTest
  sourceFile={currentFile?.file}
  onTestComplete={(results) => {
    console.log('Test completed:', results)
    setValidationResults(results)
  }}
  autoRun={false}
  testCategories={['format', 'azure', 'integrity']}
/>
```

### **FormatInfo**

Format information display component.

```typescript
interface FormatInfoProps {
  sourceFormat: string           // Source format name
  targetFormat: string           // Target format name
  fileName: string              // File name
  showBenefits?: boolean        // Show conversion benefits
  showCompatibility?: boolean   // Show compatibility matrix
}

function FormatInfo(props: FormatInfoProps): JSX.Element
```

### **ConversionHistory**

Conversion history management component.

```typescript
interface ConversionHistoryProps {
  history: ConversionJob[]       // Array of conversion jobs
  onDownload: (job: ConversionJob) => void // Download callback
  onClear?: () => void          // Clear history callback
  maxItems?: number             // Maximum items to display
}

function ConversionHistory(props: ConversionHistoryProps): JSX.Element
```

## 🔧 Utility Functions

### **Format Detection**

```typescript
// Detect file format from file content and name
async function detectFormat(file: File): Promise<FormatDetectionResult>

// Validate format matches expected
async function validateFormat(
  file: File, 
  expectedFormat: string
): Promise<boolean>

// Get format information
function getFormatInfo(format: string): FormatInfo

interface FormatDetectionResult {
  format: string                 // Detected format
  confidence: number            // Detection confidence (0-1)
  alternativeFormats?: string[] // Other possible formats
  warnings?: string[]           // Detection warnings
}
```

### **File Utilities**

```typescript
// Format file size for display
function formatFileSize(bytes: number): string

// Validate file extension
function validateExtension(fileName: string, expectedFormat: string): boolean

// Generate download blob URL
function createDownloadUrl(data: ArrayBuffer, mimeType: string): string

// Extract file metadata
async function extractMetadata(file: File): Promise<Record<string, any>>
```

**Examples:**
```typescript
// Format file size
const sizeString = formatFileSize(1024 * 1024 * 150) // "150 MB"

// Validate extension
const isValid = validateExtension('data.segy', 'SEG-Y') // true

// Create download URL
const url = createDownloadUrl(convertedData, 'application/x-hdf')
const link = document.createElement('a')
link.href = url
link.download = 'converted.h5'
link.click()
```

### **Validation Utilities**

```typescript
// Comprehensive file validation
async function validateFile(file: File): Promise<ValidationResult>

// Check browser compatibility
function checkBrowserSupport(): BrowserSupportResult

// Memory usage monitoring
function getMemoryUsage(): MemoryInfo | null

interface ValidationResult {
  isValid: boolean
  fileSize: number
  format: string
  issues: ValidationIssue[]
  recommendations: string[]
}

interface BrowserSupportResult {
  supported: boolean
  features: Record<string, boolean>
  recommendations: string[]
}
```

### **Azure Utilities**

```typescript
// Azure blob upload helper
async function uploadToAzureBlob(
  data: ArrayBuffer,
  config: AzureBlobConfig
): Promise<UploadResult>

// Energy Data Services registration
async function registerWithEDS(
  blobUrl: string,
  metadata: SeismicMetadata,
  config: EDSConfig
): Promise<EDSRegistration>

interface AzureBlobConfig {
  connectionString: string
  containerName: string
  blobName: string
  accessTier?: 'hot' | 'cool' | 'archive'
}

interface EDSConfig {
  endpoint: string
  dataPartition: string
  credentials: AzureCredential
}
```

## 🎛️ Custom Hooks

### **useKV Hook**

Persistent key-value storage hook.

```typescript
function useKV<T>(key: string, defaultValue: T): [T, (value: T) => void]
```

**Usage:**
```tsx
const [history, setHistory] = useKV<ConversionJob[]>('conversion-history', [])

// Add new conversion to history
const addToHistory = (job: ConversionJob) => {
  setHistory(prev => [job, ...prev.slice(0, 9)]) // Keep last 10
}
```

### **useFileUpload Hook**

File upload state management hook.

```typescript
function useFileUpload(): {
  files: File[]
  isDragging: boolean
  addFiles: (files: FileList) => void
  removeFile: (index: number) => void
  clearFiles: () => void
  onDragOver: (e: DragEvent) => void
  onDragLeave: (e: DragEvent) => void
  onDrop: (e: DragEvent) => void
}
```

### **useConversion Hook**

Conversion state management hook.

```typescript
function useConversion(): {
  currentJob: ConversionJob | null
  isConverting: boolean
  progress: number
  startConversion: (file: File, config: ConversionConfig) => Promise<void>
  cancelConversion: () => void
  resetConversion: () => void
}
```

## ⚙️ Configuration Options

### **Global Configuration**

```typescript
interface GlobalConfig {
  // Performance settings
  maxFileSize: number              // Maximum file size (bytes)
  chunkSize: number               // Default chunk size
  maxConcurrentJobs: number       // Max simultaneous conversions
  
  // Memory management
  memoryLimit: number             // Memory usage limit
  enableStreaming: boolean        // Enable streaming for large files
  
  // Azure settings
  azureConfig?: {
    clientId: string
    tenantId: string
    subscriptionId: string
  }
  
  // Debug settings
  debugMode: boolean              // Enable debug logging
  performanceTracking: boolean    // Track performance metrics
}

// Set global configuration
function setGlobalConfig(config: Partial<GlobalConfig>): void

// Get current configuration
function getGlobalConfig(): GlobalConfig
```

### **Format-Specific Options**

```typescript
// SEG-Y specific options
interface SEGYOptions {
  endianness?: 'big' | 'little' | 'auto'
  dataFormat?: 'ibm_float' | 'ieee_float' | 'integer'
  headerEncoding?: 'ebcdic' | 'ascii'
  validateGeometry?: boolean
}

// HDF5 specific options
interface HDF5Options {
  compressionAlgorithm?: 'gzip' | 'lzf' | 'szip'
  shuffleFilter?: boolean
  checksums?: boolean
  chunkLayout?: 'auto' | 'manual'
  chunkDimensions?: number[]
}

// OVDS specific options
interface OVDSOptions {
  lodLevels?: number              // Level of detail levels
  brickSize?: [number, number, number] // Brick dimensions
  compressionTolerance?: number   // Compression quality
  spatialIndexing?: boolean       // Enable spatial indexing
}
```

## 📊 Performance Monitoring

### **Performance Metrics**

```typescript
interface PerformanceMetrics {
  conversionTime: number          // Total conversion time
  fileSize: number               // Input file size
  compressionRatio: number       // Output/input size ratio
  memoryPeak: number             // Peak memory usage
  throughput: number             // MB/second processing rate
}

// Collect performance metrics
function collectMetrics(
  startTime: number,
  inputSize: number,
  outputSize: number
): PerformanceMetrics

// Performance monitoring hook
function usePerformanceMonitor(): {
  metrics: PerformanceMetrics[]
  startTracking: () => void
  stopTracking: () => PerformanceMetrics
  getAverageMetrics: () => PerformanceMetrics
}
```

### **Memory Monitoring**

```typescript
interface MemoryInfo {
  used: number                   // Used memory in bytes
  total: number                  // Total allocated memory
  limit: number                  // Memory limit
  percentage: number             // Usage percentage
}

// Get current memory usage
function getMemoryInfo(): MemoryInfo | null

// Monitor memory usage over time
function startMemoryMonitoring(callback: (info: MemoryInfo) => void): void
function stopMemoryMonitoring(): void
```

## 🧪 Testing Utilities

### **Test Helpers**

```typescript
// Generate test files for various formats
function generateTestFile(format: string, options?: any): File

// Validate conversion results
async function validateConversion(
  original: File,
  converted: ArrayBuffer,
  config: ConversionConfig
): Promise<ValidationReport>

// Performance benchmarking
async function benchmarkConversion(
  file: File,
  configs: ConversionConfig[]
): Promise<BenchmarkResult[]>

interface ValidationReport {
  passed: boolean
  score: number
  checks: ValidationCheck[]
  recommendations: string[]
}
```

### **Mock Data**

```typescript
// Create mock seismic data
function createMockSeismicData(options: {
  traces: number
  samples: number
  format: string
  withNoise?: boolean
}): ArrayBuffer

// Generate realistic test datasets
function generateTestDataset(scenario: 'small' | 'medium' | 'large'): File[]
```

## 🔌 Extension API

### **Custom Format Parsers**

```typescript
// Register custom format parser
function registerFormatParser(
  format: string,
  parser: FormatParser
): void

// Format parser interface
interface FormatParser {
  parse(data: ArrayBuffer): Promise<ParsedData>
  validate(data: ArrayBuffer): Promise<boolean>
  getMetadata(data: ArrayBuffer): Promise<SeismicMetadata>
}

// Example custom parser
const customParser: FormatParser = {
  async parse(data: ArrayBuffer): Promise<ParsedData> {
    // Custom parsing logic
    return parsedData
  },
  
  async validate(data: ArrayBuffer): Promise<boolean> {
    // Validation logic
    return true
  },
  
  async getMetadata(data: ArrayBuffer): Promise<SeismicMetadata> {
    // Metadata extraction
    return metadata
  }
}

registerFormatParser('CustomFormat', customParser)
```

### **Custom Converters**

```typescript
// Register custom converter
function registerConverter(
  sourceFormat: string,
  targetFormat: string,
  converter: FormatConverter
): void

interface FormatConverter {
  convert(
    data: ParsedData,
    config: ConversionConfig
  ): Promise<ArrayBuffer>
  
  estimateOutputSize(inputSize: number): number
  getSupportedOptions(): string[]
}
```

---

## 🎯 Code Examples

### **Complete Conversion Example**

```typescript
import { SeismicConverter, ConversionConfig } from '@/lib/seismicConverter'

async function convertSeismicFile(file: File): Promise<void> {
  try {
    // Configure conversion
    const config: ConversionConfig = {
      sourceFormat: 'SEG-Y',
      targetFormat: 'HDF5',
      preserveMetadata: true,
      compressionLevel: 6,
      azureCompatible: true
    }
    
    // Validate for Azure if needed
    if (config.azureCompatible) {
      const validation = await SeismicConverter.validateForAzure(file, config.sourceFormat)
      if (!validation.isAzureCompatible) {
        console.warn('Azure compatibility issues:', validation.recommendations)
      }
    }
    
    // Convert file
    const result = await SeismicConverter.convert(file, config, (progress) => {
      console.log(`Conversion progress: ${progress}%`)
    })
    
    if (result.success && result.outputData) {
      // Create download
      const blob = new Blob([result.outputData], { type: 'application/x-hdf' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = file.name.replace(/\.[^.]+$/, '.h5')
      link.click()
      
      // Cleanup
      URL.revokeObjectURL(url)
      
      console.log('Conversion completed successfully!')
      console.log('Metadata:', result.metadata)
      console.log('Warnings:', result.warnings)
    } else {
      console.error('Conversion failed:', result.error)
    }
    
  } catch (error) {
    console.error('Conversion error:', error)
  }
}
```

### **React Component Integration**

```tsx
import React, { useState, useCallback } from 'react'
import { FileUploadZone, FormatSelector, ConversionTest } from '@/components'
import { SeismicConverter } from '@/lib/seismicConverter'

function SeismicConverterApp() {
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>('HDF5')
  const [converting, setConverting] = useState(false)
  
  const handleFileSelect = useCallback((file: File) => {
    setCurrentFile(file)
  }, [])
  
  const handleConvert = useCallback(async () => {
    if (!currentFile) return
    
    setConverting(true)
    
    try {
      const result = await SeismicConverter.convert(currentFile, {
        sourceFormat: 'auto', // Auto-detect
        targetFormat,
        preserveMetadata: true
      }, (progress) => {
        console.log(`Progress: ${progress}%`)
      })
      
      if (result.success) {
        // Handle successful conversion
        console.log('Conversion successful!')
      }
    } catch (error) {
      console.error('Conversion failed:', error)
    } finally {
      setConverting(false)
    }
  }, [currentFile, targetFormat])
  
  return (
    <div className="converter-app">
      <FileUploadZone
        onFileSelect={handleFileSelect}
        disabled={converting}
      />
      
      {currentFile && (
        <>
          <FormatSelector
            value={targetFormat}
            onChange={setTargetFormat}
            sourceFormat={currentFile.type}
            disabled={converting}
          />
          
          <button onClick={handleConvert} disabled={converting}>
            {converting ? 'Converting...' : 'Convert File'}
          </button>
          
          <ConversionTest
            sourceFile={currentFile}
            onTestComplete={(results) => {
              console.log('Test results:', results)
            }}
          />
        </>
      )}
    </div>
  )
}
```

---

*This API reference provides complete technical documentation for integrating and extending the Seismic Format Converter. For more examples and guides, see the [Examples & Usage](Examples-and-Usage.md) documentation.*