# 🔧 Troubleshooting Guide

Comprehensive troubleshooting guide for common issues, performance problems, and error resolution in the Seismic Format Converter.

## 🚨 Common Issues

### **File Upload Problems**

#### **Issue: Files Not Uploading**
**Symptoms:**
- Drag & drop not working
- File selection dialog doesn't open
- Files appear to upload but don't process

**Solutions:**
```typescript
// Check browser compatibility
if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
  console.error('File API not supported')
  // Show fallback interface
}

// Check file size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024 // 5GB
if (file.size > MAX_FILE_SIZE) {
  throw new Error(`File size ${file.size} exceeds maximum ${MAX_FILE_SIZE}`)
}
```

**Prevention:**
- Use modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Check available memory before upload
- Implement progressive file processing

#### **Issue: Format Detection Fails**
**Symptoms:**
- File format shows as "Unknown"
- Conversion fails with format errors
- Wrong format detected

**Debug Steps:**
```typescript
// Manual format detection debugging
const debugFormatDetection = async (file: File) => {
  console.log('File info:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  })
  
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  console.log('Extension:', extension)
  
  // Check file headers (first 100 bytes)
  const headerBuffer = await file.slice(0, 100).arrayBuffer()
  const headerBytes = new Uint8Array(headerBuffer)
  console.log('Header bytes:', Array.from(headerBytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' '))
  
  // Check for text content
  try {
    const textSample = new TextDecoder().decode(headerBuffer.slice(0, 50))
    console.log('Text sample:', textSample)
  } catch (e) {
    console.log('Not text content')
  }
}
```

**Solutions:**
- Verify file isn't corrupted: `md5sum yourfile.segy`
- Check file extension matches content
- Use manual format selection if auto-detection fails
- Validate file with format-specific tools first

### **Conversion Failures**

#### **Issue: Out of Memory Errors**
**Symptoms:**
- Browser crashes during conversion
- "RangeError: Invalid array length"
- Conversion stops at specific percentage

**Solutions:**
```typescript
// Implement streaming conversion for large files
class StreamingConverter {
  private chunkSize = 64 * 1024 * 1024 // 64MB chunks
  
  async convertLargeFile(file: File): Promise<ConversionResult> {
    if (file.size > this.chunkSize) {
      return this.streamingConversion(file)
    }
    return this.standardConversion(file)
  }
  
  private async streamingConversion(file: File): Promise<ConversionResult> {
    const chunks = Math.ceil(file.size / this.chunkSize)
    const results: ArrayBuffer[] = []
    
    for (let i = 0; i < chunks; i++) {
      const start = i * this.chunkSize
      const end = Math.min(start + this.chunkSize, file.size)
      const chunk = file.slice(start, end)
      
      const chunkResult = await this.processChunk(chunk, i, chunks)
      results.push(chunkResult)
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Force garbage collection if available
      if (window.gc) window.gc()
    }
    
    return this.combineResults(results)
  }
}
```

**Memory Management:**
```typescript
// Monitor memory usage
const monitorMemory = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
    })
  }
}

// Call periodically during conversion
setInterval(monitorMemory, 5000)
```

#### **Issue: Conversion Hangs or Freezes**
**Symptoms:**
- Progress bar stops moving
- Browser becomes unresponsive
- Conversion never completes

**Debug Tools:**
```typescript
// Add timeout protection
const convertWithTimeout = async (file: File, timeoutMs: number = 300000) => {
  return Promise.race([
    SeismicConverter.convert(file, config),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Conversion timeout')), timeoutMs)
    )
  ])
}

// Add detailed progress logging
const debugConversion = async (file: File) => {
  const startTime = Date.now()
  
  const result = await SeismicConverter.convert(file, config, (progress) => {
    const elapsed = Date.now() - startTime
    const rate = progress > 0 ? elapsed / progress : 0
    const estimated = rate * 100
    
    console.log(`Progress: ${progress}% | Elapsed: ${elapsed}ms | ETA: ${estimated - elapsed}ms`)
  })
  
  console.log(`Total conversion time: ${Date.now() - startTime}ms`)
  return result
}
```

### **Browser Compatibility Issues**

#### **Issue: Features Not Working in Older Browsers**
**Browser Support Matrix:**

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| **File API** | 90+ | 88+ | 14+ | 90+ |
| **Web Workers** | 90+ | 88+ | 14+ | 90+ |
| **ArrayBuffer** | 90+ | 88+ | 14+ | 90+ |
| **ES2020** | 90+ | 88+ | 14+ | 90+ |

**Polyfill Implementation:**
```typescript
// Check for required features
const checkBrowserSupport = () => {
  const requirements = {
    fileAPI: !!(window.File && window.FileReader),
    arrayBuffer: !!window.ArrayBuffer,
    webWorkers: !!window.Worker,
    es6: (() => {
      try {
        eval('const test = () => {}')
        return true
      } catch {
        return false
      }
    })()
  }
  
  const unsupported = Object.entries(requirements)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature)
  
  if (unsupported.length > 0) {
    throw new Error(`Unsupported browser features: ${unsupported.join(', ')}`)
  }
  
  return true
}
```

## ⚡ Performance Issues

### **Slow Conversion Speed**

#### **Diagnosis:**
```typescript
// Performance profiling
const profileConversion = async (file: File) => {
  const marks: { [key: string]: number } = {}
  
  const mark = (name: string) => {
    marks[name] = performance.now()
  }
  
  const measure = (name: string, startMark: string) => {
    const duration = performance.now() - marks[startMark]
    console.log(`${name}: ${duration.toFixed(2)}ms`)
    return duration
  }
  
  mark('start')
  
  mark('parseStart')
  const parsedData = await parseFile(file)
  measure('File parsing', 'parseStart')
  
  mark('conversionStart')
  const converted = await convertData(parsedData)
  measure('Data conversion', 'conversionStart')
  
  mark('compressionStart')
  const compressed = await compressData(converted)
  measure('Compression', 'compressionStart')
  
  measure('Total conversion', 'start')
}
```

#### **Optimization Strategies:**

**1. Enable Web Workers**
```typescript
// worker.ts
self.onmessage = async (event) => {
  const { file, config } = event.data
  
  try {
    const result = await SeismicConverter.convert(file, config, (progress) => {
      self.postMessage({ type: 'progress', progress })
    })
    
    self.postMessage({ type: 'complete', result })
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message })
  }
}

// main.ts
const convertInWorker = (file: File, config: ConversionConfig) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/worker.js')
    
    worker.postMessage({ file, config })
    
    worker.onmessage = (event) => {
      const { type, ...data } = event.data
      
      switch (type) {
        case 'progress':
          onProgress(data.progress)
          break
        case 'complete':
          resolve(data.result)
          worker.terminate()
          break
        case 'error':
          reject(new Error(data.error))
          worker.terminate()
          break
      }
    }
  })
}
```

**2. Optimize Chunk Size**
```typescript
// Dynamic chunk sizing based on file size
const getOptimalChunkSize = (fileSize: number): number => {
  if (fileSize < 10 * 1024 * 1024) return 1024 * 1024     // 1MB for small files
  if (fileSize < 100 * 1024 * 1024) return 8 * 1024 * 1024 // 8MB for medium files
  if (fileSize < 1024 * 1024 * 1024) return 32 * 1024 * 1024 // 32MB for large files
  return 64 * 1024 * 1024 // 64MB for very large files
}
```

**3. Memory Pool Management**
```typescript
class MemoryPool {
  private pools = new Map<number, ArrayBuffer[]>()
  
  getBuffer(size: number): ArrayBuffer {
    const roundedSize = Math.pow(2, Math.ceil(Math.log2(size)))
    const pool = this.pools.get(roundedSize) || []
    
    if (pool.length > 0) {
      return pool.pop()!
    }
    
    return new ArrayBuffer(roundedSize)
  }
  
  returnBuffer(buffer: ArrayBuffer): void {
    const size = buffer.byteLength
    const pool = this.pools.get(size) || []
    
    if (pool.length < 10) { // Limit pool size
      pool.push(buffer)
      this.pools.set(size, pool)
    }
  }
}
```

### **High Memory Usage**

#### **Memory Leak Detection:**
```typescript
// Memory usage monitoring
class MemoryMonitor {
  private measurements: Array<{ time: number; used: number }> = []
  
  startMonitoring(intervalMs: number = 5000) {
    const monitor = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        this.measurements.push({
          time: Date.now(),
          used: memory.usedJSHeapSize
        })
        
        // Keep only last 100 measurements
        if (this.measurements.length > 100) {
          this.measurements.shift()
        }
        
        this.detectLeaks()
      }
    }
    
    setInterval(monitor, intervalMs)
  }
  
  private detectLeaks() {
    if (this.measurements.length < 10) return
    
    const recent = this.measurements.slice(-10)
    const trend = this.calculateTrend(recent)
    
    if (trend > 1024 * 1024) { // Growing by more than 1MB per measurement
      console.warn('Potential memory leak detected', {
        trend: `${(trend / 1024 / 1024).toFixed(2)} MB/measurement`,
        current: `${(recent[recent.length - 1].used / 1024 / 1024).toFixed(2)} MB`
      })
    }
  }
  
  private calculateTrend(measurements: Array<{ time: number; used: number }>): number {
    // Simple linear regression
    const n = measurements.length
    const sumX = measurements.reduce((sum, m, i) => sum + i, 0)
    const sumY = measurements.reduce((sum, m) => sum + m.used, 0)
    const sumXY = measurements.reduce((sum, m, i) => sum + i * m.used, 0)
    const sumX2 = measurements.reduce((sum, m, i) => sum + i * i, 0)
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  }
}
```

## 🌐 Azure Integration Issues

### **Authentication Problems**

#### **Issue: Azure Login Fails**
**Common Causes:**
- Incorrect client ID/secret
- Wrong tenant ID
- Insufficient permissions
- Token expiration

**Debug Steps:**
```typescript
// Azure authentication debugging
const debugAzureAuth = async () => {
  try {
    // Check environment variables
    console.log('Azure config:', {
      clientId: process.env.AZURE_CLIENT_ID?.slice(0, 8) + '...',
      tenantId: process.env.AZURE_TENANT_ID?.slice(0, 8) + '...',
      hasSecret: !!process.env.AZURE_CLIENT_SECRET
    })
    
    // Test token acquisition
    const credential = new DefaultAzureCredential()
    const token = await credential.getToken('https://management.azure.com/.default')
    console.log('Token acquired:', {
      expiresOn: token.expiresOnTimestamp,
      hasToken: !!token.token
    })
    
  } catch (error) {
    console.error('Azure auth error:', error)
  }
}
```

#### **Issue: Energy Data Services Access Denied**
**Solutions:**
```bash
# Check permissions
az role assignment list --assignee <client-id> --scope /subscriptions/<subscription-id>

# Add required role
az role assignment create \
  --role "Energy Data Services Contributor" \
  --assignee <client-id> \
  --scope /subscriptions/<subscription-id>/resourceGroups/<rg-name>
```

### **Upload/Download Issues**

#### **Issue: Large File Upload Fails**
**Azure Blob Storage Limits:**
- Maximum blob size: 5TB
- Maximum block size: 4000MB
- Maximum blocks per blob: 50,000

**Solution:**
```typescript
// Chunked upload for large files
class AzureLargeFileUpload {
  private maxBlockSize = 100 * 1024 * 1024 // 100MB
  
  async uploadLargeFile(
    blobClient: BlockBlobClient,
    file: File
  ): Promise<void> {
    const blockIds: string[] = []
    const chunkCount = Math.ceil(file.size / this.maxBlockSize)
    
    for (let i = 0; i < chunkCount; i++) {
      const start = i * this.maxBlockSize
      const end = Math.min(start + this.maxBlockSize, file.size)
      const chunk = file.slice(start, end)
      
      const blockId = btoa(`block-${i.toString().padStart(6, '0')}`)
      blockIds.push(blockId)
      
      await blobClient.stageBlock(blockId, chunk, chunk.size)
      console.log(`Uploaded block ${i + 1}/${chunkCount}`)
    }
    
    await blobClient.commitBlockList(blockIds)
    console.log('Upload completed')
  }
}
```

## 🧪 Testing and Validation Issues

### **Issue: Test Files Not Working**

#### **Sample File Generation:**
```typescript
// Generate test SEG-Y file
const generateTestSEGY = (): ArrayBuffer => {
  const textHeader = new ArrayBuffer(3200)
  const binaryHeader = new ArrayBuffer(400)
  const traceData = new ArrayBuffer(10000) // Small trace data
  
  // Fill textual header with EBCDIC spaces
  const textView = new Uint8Array(textHeader)
  textView.fill(0x40) // EBCDIC space
  
  // Set binary header values
  const binaryView = new DataView(binaryHeader)
  binaryView.setUint16(20, 1000, false) // samples per trace
  binaryView.setUint16(16, 2000, false) // sample interval (microseconds)
  
  // Combine all parts
  const total = new ArrayBuffer(textHeader.byteLength + binaryHeader.byteLength + traceData.byteLength)
  const totalView = new Uint8Array(total)
  
  totalView.set(new Uint8Array(textHeader), 0)
  totalView.set(new Uint8Array(binaryHeader), 3200)
  totalView.set(new Uint8Array(traceData), 3600)
  
  return total
}

// Create test file
const testFile = new File([generateTestSEGY()], 'test.segy', {
  type: 'application/octet-stream'
})
```

### **Validation Script**

```typescript
// Comprehensive validation script
const validateConversion = async (
  originalFile: File,
  convertedData: ArrayBuffer,
  config: ConversionConfig
): Promise<ValidationReport> => {
  const checks = [
    {
      name: 'File Size Check',
      test: () => convertedData.byteLength > 0,
      expected: 'Converted file should not be empty'
    },
    {
      name: 'Format Validation',
      test: async () => {
        const formatSignature = await validateFormatSignature(convertedData, config.targetFormat)
        return formatSignature.isValid
      },
      expected: `File should have valid ${config.targetFormat} signature`
    },
    {
      name: 'Compression Ratio',
      test: () => {
        const ratio = convertedData.byteLength / originalFile.size
        return ratio > 0.1 && ratio < 2.0 // Reasonable compression range
      },
      expected: 'Compression ratio should be between 10% and 200%'
    },
    {
      name: 'Metadata Preservation',
      test: async () => {
        const metadata = await extractMetadata(convertedData)
        return metadata && Object.keys(metadata).length > 0
      },
      expected: 'Metadata should be preserved'
    }
  ]
  
  const results = await Promise.all(
    checks.map(async (check) => {
      try {
        const passed = await check.test()
        return { ...check, passed, error: null }
      } catch (error) {
        return { ...check, passed: false, error: error.message }
      }
    })
  )
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  const score = (passed / total) * 100
  
  return {
    score,
    passed,
    total,
    results,
    isValid: score >= 80
  }
}
```

## 📋 Diagnostic Tools

### **System Information Collector**

```typescript
// Collect system diagnostics
const collectDiagnostics = (): SystemDiagnostics => {
  const nav = navigator as any
  
  return {
    browser: {
      userAgent: nav.userAgent,
      vendor: nav.vendor,
      platform: nav.platform,
      language: nav.language,
      cookieEnabled: nav.cookieEnabled,
      onLine: nav.onLine,
      hardwareConcurrency: nav.hardwareConcurrency || 'unknown'
    },
    memory: ('memory' in performance) ? {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit
    } : null,
    features: {
      fileAPI: !!(window.File && window.FileReader),
      webWorkers: !!window.Worker,
      arrayBuffer: !!window.ArrayBuffer,
      webAssembly: !!window.WebAssembly,
      indexedDB: !!window.indexedDB,
      localStorage: !!window.localStorage
    },
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    },
    connection: (nav.connection) ? {
      effectiveType: nav.connection.effectiveType,
      downlink: nav.connection.downlink,
      rtt: nav.connection.rtt
    } : null
  }
}

// Generate diagnostic report
const generateDiagnosticReport = (): string => {
  const diagnostics = collectDiagnostics()
  
  return `
=== Seismic Format Converter Diagnostics ===
Generated: ${new Date().toISOString()}

Browser Information:
- User Agent: ${diagnostics.browser.userAgent}
- Platform: ${diagnostics.browser.platform}
- Language: ${diagnostics.browser.language}
- Online: ${diagnostics.browser.onLine}
- CPU Cores: ${diagnostics.browser.hardwareConcurrency}

Memory Information:
${diagnostics.memory ? `
- Used: ${(diagnostics.memory.used / 1024 / 1024).toFixed(2)} MB
- Total: ${(diagnostics.memory.total / 1024 / 1024).toFixed(2)} MB
- Limit: ${(diagnostics.memory.limit / 1024 / 1024).toFixed(2)} MB
` : '- Memory API not available'}

Feature Support:
${Object.entries(diagnostics.features)
  .map(([feature, supported]) => `- ${feature}: ${supported ? '✅' : '❌'}`)
  .join('\n')}

Screen Information:
- Resolution: ${diagnostics.screen.width}x${diagnostics.screen.height}
- Color Depth: ${diagnostics.screen.colorDepth}

Connection Information:
${diagnostics.connection ? `
- Type: ${diagnostics.connection.effectiveType}
- Downlink: ${diagnostics.connection.downlink} Mbps
- RTT: ${diagnostics.connection.rtt} ms
` : '- Connection API not available'}
`
}
```

### **Debug Console**

```typescript
// Enhanced debug console
class DebugConsole {
  private logs: DebugLog[] = []
  private isEnabled = process.env.NODE_ENV === 'development'
  
  enable() {
    this.isEnabled = true
  }
  
  log(category: string, message: string, data?: any) {
    if (!this.isEnabled) return
    
    const logEntry: DebugLog = {
      timestamp: Date.now(),
      category,
      message,
      data,
      level: 'info'
    }
    
    this.logs.push(logEntry)
    console.log(`[${category}] ${message}`, data)
    
    this.trimLogs()
  }
  
  error(category: string, message: string, error?: Error) {
    const logEntry: DebugLog = {
      timestamp: Date.now(),
      category,
      message,
      data: { error: error?.message, stack: error?.stack },
      level: 'error'
    }
    
    this.logs.push(logEntry)
    console.error(`[${category}] ${message}`, error)
    
    this.trimLogs()
  }
  
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
  
  private trimLogs() {
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500) // Keep last 500 logs
    }
  }
}

// Global debug console
const debug = new DebugConsole()

// Usage throughout the application
debug.log('conversion', 'Starting SEG-Y conversion', { fileName: 'test.segy' })
debug.error('parsing', 'Failed to parse headers', parseError)
```

## 🆘 Getting Support

### **Before Reporting Issues**

1. **Check existing documentation**
2. **Search GitHub issues**
3. **Collect diagnostic information**
4. **Try with sample files**
5. **Test in different browsers**

### **Issue Template**

```markdown
## Issue Description
Brief description of the problem

## Steps to Reproduce
1. Go to '...'
2. Upload file '....'
3. Select format '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96.0]
- File Type: [e.g. SEG-Y, 150MB]
- Error Message: [exact error text]

## Diagnostic Information
```
<!-- Paste output from generateDiagnosticReport() -->
```

## Additional Context
Any other context about the problem

## Files
If possible, attach a sample file that reproduces the issue
```

### **Support Channels**

1. **GitHub Issues**: Bug reports and feature requests
2. **GitHub Discussions**: General questions and community help
3. **Documentation**: Check the wiki for solutions
4. **Email**: For sensitive issues or enterprise support

---

## 🎯 Prevention Best Practices

1. **Regular Testing**: Test with variety of file types and sizes
2. **Browser Testing**: Test in multiple browsers regularly
3. **Performance Monitoring**: Watch for memory leaks and performance degradation
4. **Error Handling**: Implement comprehensive error boundaries
5. **User Feedback**: Collect and act on user reports
6. **Documentation**: Keep troubleshooting guides updated

---

*Most issues can be resolved quickly with proper diagnosis. When in doubt, collect diagnostic information and reach out to the community for help.*