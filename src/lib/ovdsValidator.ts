// OVDS (Open Volumetric Data Standard) Validator
// Following Azure Energy Data Services best practices for SEG-Y to OVDS conversion

export interface OVDSValidationResult {
  isValid: boolean
  azureCompatible: boolean
  validationSteps: {
    headerStructure: boolean
    volumeInfo: boolean
    coordinateSystem: boolean
    compression: boolean
    lodStructure: boolean
    brickLayout: boolean
    azureOptimization: boolean
  }
  performanceMetrics: {
    fileSize: number
    compressionRatio: number
    estimatedLoadTime: number
    randomAccessScore: number
  }
  recommendations: string[]
  warnings: string[]
}

export interface OVDSHeader {
  format: string
  version: string
  createdBy: string
  creationTime: string
  sourceFormat: string
  azureCompatible: boolean
}

export interface OVDSVolumeInfo {
  dimensionality: number
  format: string
  components: number
  lodLevels: number
  brickSize: number[]
  negativeMargin: number[]
  positiveMargin: number[]
}

export interface OVDSGeometry {
  inlineRange: number[]
  crosslineRange: number[]
  sampleRange: number[]
  ijkToWorld: number[] // 4x4 transformation matrix
}

export class OVDSValidator {
  
  /**
   * Validates OVDS file structure according to Azure Energy Data Services standards
   */
  static async validateOVDS(data: ArrayBuffer, originalFileSize?: number): Promise<OVDSValidationResult> {
    const validation: OVDSValidationResult = {
      isValid: false,
      azureCompatible: false,
      validationSteps: {
        headerStructure: false,
        volumeInfo: false,
        coordinateSystem: false,
        compression: false,
        lodStructure: false,
        brickLayout: false,
        azureOptimization: false
      },
      performanceMetrics: {
        fileSize: data.byteLength,
        compressionRatio: originalFileSize ? data.byteLength / originalFileSize : 1.0,
        estimatedLoadTime: 0,
        randomAccessScore: 0
      },
      recommendations: [],
      warnings: []
    }

    try {
      // Step 1: Validate OVDS header structure
      const header = await this.extractOVDSHeader(data)
      validation.validationSteps.headerStructure = this.validateHeader(header, validation)

      // Step 2: Validate volume information
      const volumeInfo = await this.extractVolumeInfo(data)
      validation.validationSteps.volumeInfo = this.validateVolumeInfo(volumeInfo, validation)

      // Step 3: Validate coordinate system
      const geometry = await this.extractGeometry(data)
      validation.validationSteps.coordinateSystem = this.validateGeometry(geometry, validation)

      // Step 4: Validate compression settings
      validation.validationSteps.compression = this.validateCompression(data, validation)

      // Step 5: Validate LOD structure
      validation.validationSteps.lodStructure = this.validateLODStructure(data, volumeInfo, validation)

      // Step 6: Validate brick layout
      validation.validationSteps.brickLayout = this.validateBrickLayout(data, volumeInfo, validation)

      // Step 7: Azure-specific optimizations
      validation.validationSteps.azureOptimization = this.validateAzureOptimization(data, validation)

      // Calculate performance metrics
      this.calculatePerformanceMetrics(validation, volumeInfo)

      // Overall validation
      validation.isValid = Object.values(validation.validationSteps).every(step => step)
      validation.azureCompatible = validation.isValid && 
        validation.validationSteps.azureOptimization &&
        validation.performanceMetrics.randomAccessScore > 0.7

      // Generate final recommendations
      this.generateRecommendations(validation)

    } catch (error) {
      validation.warnings.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return validation
  }

  private static async extractOVDSHeader(data: ArrayBuffer): Promise<OVDSHeader> {
    // Extract JSON header from beginning of OVDS file
    try {
      const textDecoder = new TextDecoder()
      const headerText = textDecoder.decode(data.slice(0, 2048))
      const headerEnd = headerText.indexOf('}\n') + 1
      const jsonStr = headerText.substring(0, headerEnd)
      const parsed = JSON.parse(jsonStr)
      
      return parsed.ovds_header || parsed.header || {
        format: 'Unknown',
        version: '0.0',
        createdBy: 'Unknown',
        creationTime: '',
        sourceFormat: 'Unknown',
        azureCompatible: false
      }
    } catch {
      throw new Error('Invalid OVDS header structure')
    }
  }

  private static async extractVolumeInfo(data: ArrayBuffer): Promise<OVDSVolumeInfo> {
    // Extract volume information from OVDS metadata
    try {
      const textDecoder = new TextDecoder()
      const headerText = textDecoder.decode(data.slice(0, 4096))
      const parsed = JSON.parse(headerText.substring(0, headerText.indexOf('}\n') + 1))
      
      return parsed.volume_info || parsed.volumeInfo || {
        dimensionality: 3,
        format: 'float32',
        components: 1,
        lodLevels: 1,
        brickSize: [64, 64, 64],
        negativeMargin: [0, 0, 0],
        positiveMargin: [0, 0, 0]
      }
    } catch {
      throw new Error('Invalid OVDS volume information')
    }
  }

  private static async extractGeometry(data: ArrayBuffer): Promise<OVDSGeometry> {
    // Extract geometry information
    try {
      const textDecoder = new TextDecoder()
      const headerText = textDecoder.decode(data.slice(0, 4096))
      const parsed = JSON.parse(headerText.substring(0, headerText.indexOf('}\n') + 1))
      
      return parsed.geometry || {
        inlineRange: [1, 1000],
        crosslineRange: [1, 100],
        sampleRange: [0, 2000],
        ijkToWorld: Array(16).fill(0).map((_, i) => i % 5 === 0 ? 1 : 0) // Identity matrix
      }
    } catch {
      throw new Error('Invalid OVDS geometry information')
    }
  }

  private static validateHeader(header: OVDSHeader, validation: OVDSValidationResult): boolean {
    let isValid = true

    // Check format
    if (header.format !== 'OVDS') {
      validation.warnings.push('Header format field should be "OVDS"')
      isValid = false
    }

    // Check version compatibility
    const version = parseFloat(header.version)
    if (version < 1.0) {
      validation.warnings.push('OVDS version should be 1.0 or higher for Azure compatibility')
    }

    // Check Azure compatibility flag
    if (!header.azureCompatible) {
      validation.recommendations.push('Enable Azure compatibility flag for optimal cloud performance')
    }

    // Check creation metadata
    if (!header.creationTime || !header.createdBy) {
      validation.warnings.push('Missing creation metadata - recommended for data lineage tracking')
    }

    return isValid
  }

  private static validateVolumeInfo(volumeInfo: OVDSVolumeInfo, validation: OVDSValidationResult): boolean {
    let isValid = true

    // Check dimensionality
    if (volumeInfo.dimensionality !== 3) {
      validation.warnings.push('Only 3D volumes are fully supported by Azure Energy Data Services')
      isValid = false
    }

    // Check data format
    if (volumeInfo.format !== 'float32') {
      validation.warnings.push('float32 format recommended for best Azure compatibility')
    }

    // Check LOD levels
    if (volumeInfo.lodLevels < 4) {
      validation.recommendations.push('Consider using 4+ LOD levels for better streaming performance')
    }

    // Check brick size
    const optimalBrickSizes = [[32, 32, 32], [64, 64, 64], [128, 128, 128]]
    const isOptimalBrickSize = optimalBrickSizes.some(size => 
      JSON.stringify(size) === JSON.stringify(volumeInfo.brickSize)
    )
    
    if (!isOptimalBrickSize) {
      validation.recommendations.push('Use brick sizes of 32³, 64³, or 128³ for optimal cloud performance')
    }

    return isValid
  }

  private static validateGeometry(geometry: OVDSGeometry, validation: OVDSValidationResult): boolean {
    let isValid = true

    // Check coordinate ranges
    const inlineCount = geometry.inlineRange[1] - geometry.inlineRange[0] + 1
    const crosslineCount = geometry.crosslineRange[1] - geometry.crosslineRange[0] + 1
    const sampleCount = geometry.sampleRange[1] - geometry.sampleRange[0]

    if (inlineCount <= 0 || crosslineCount <= 0 || sampleCount <= 0) {
      validation.warnings.push('Invalid coordinate ranges detected')
      isValid = false
    }

    // Check transformation matrix
    if (geometry.ijkToWorld.length !== 16) {
      validation.warnings.push('IJK to World transformation matrix should be 4x4 (16 elements)')
      isValid = false
    }

    // Warn about large volumes
    const totalSamples = inlineCount * crosslineCount * sampleCount
    if (totalSamples > 1e9) {
      validation.recommendations.push('Large volumes benefit from higher compression and more LOD levels')
    }

    return isValid
  }

  private static validateCompression(data: ArrayBuffer, validation: OVDSValidationResult): boolean {
    // Check if compression metadata exists
    try {
      const textDecoder = new TextDecoder()
      const headerText = textDecoder.decode(data.slice(0, 4096))
      const parsed = JSON.parse(headerText.substring(0, headerText.indexOf('}\n') + 1))
      
      const compression = parsed.compression
      if (!compression) {
        validation.warnings.push('No compression configuration found - file may be inefficient for cloud storage')
        return false
      }

      // Check compression algorithm
      const recommendedAlgorithms = ['wavelet', 'zstd', 'lz4']
      if (!recommendedAlgorithms.includes(compression.algorithm)) {
        validation.recommendations.push(`Consider using wavelet, zstd, or lz4 compression for better performance`)
      }

      // Check tolerance for lossy compression
      if (compression.tolerance && compression.tolerance > 0.05) {
        validation.warnings.push('Compression tolerance >5% may affect data quality for seismic analysis')
      }

      return true
    } catch {
      validation.warnings.push('Cannot validate compression settings')
      return false
    }
  }

  private static validateLODStructure(data: ArrayBuffer, volumeInfo: OVDSVolumeInfo, validation: OVDSValidationResult): boolean {
    // Check LOD pyramid structure
    const expectedLODHeaderSize = volumeInfo.lodLevels * 8 // 8 bytes per LOD header
    
    try {
      // Look for LOD headers after main metadata
      const headerSize = this.findMetadataEnd(data)
      const lodHeaders = new DataView(data, headerSize, expectedLODHeaderSize)
      
      // Validate LOD offsets are increasing
      let previousOffset = 0
      for (let i = 0; i < volumeInfo.lodLevels; i++) {
        const offset = lodHeaders.getUint32(i * 8, true)
        const size = lodHeaders.getUint32(i * 8 + 4, true)
        
        if (offset <= previousOffset) {
          validation.warnings.push('Invalid LOD structure - offsets should be increasing')
          return false
        }
        
        if (size === 0) {
          validation.warnings.push(`LOD level ${i} has zero size`)
          return false
        }
        
        previousOffset = offset
      }

      validation.recommendations.push('LOD structure validated - supports efficient multi-resolution streaming')
      return true
    } catch {
      validation.warnings.push('Cannot validate LOD structure')
      return false
    }
  }

  private static validateBrickLayout(data: ArrayBuffer, volumeInfo: OVDSVolumeInfo, validation: OVDSValidationResult): boolean {
    // Validate spatial brick organization
    const brickSize = volumeInfo.brickSize
    const totalBrickSize = brickSize[0] * brickSize[1] * brickSize[2]
    
    if (totalBrickSize > 1048576) { // 1M samples per brick
      validation.warnings.push('Large brick size may impact random access performance')
    }
    
    if (totalBrickSize < 4096) { // 4K samples per brick
      validation.warnings.push('Small brick size may cause overhead in cloud storage')
    }

    // Check for spatial indexing metadata
    try {
      const textDecoder = new TextDecoder()
      const text = textDecoder.decode(data.slice(0, 8192))
      
      if (text.includes('morton_order') || text.includes('z_order')) {
        validation.recommendations.push('Spatial ordering detected - optimizes cache locality')
      } else {
        validation.recommendations.push('Consider using Morton/Z-order curve for better spatial locality')
      }
      
      return true
    } catch {
      return true // Non-critical validation
    }
  }

  private static validateAzureOptimization(data: ArrayBuffer, validation: OVDSValidationResult): boolean {
    // Check for Azure-specific optimizations
    try {
      const textDecoder = new TextDecoder()
      const text = textDecoder.decode(data.slice(0, 8192))
      
      let score = 0
      let maxScore = 5

      // Check for Azure optimization metadata
      if (text.includes('azure_optimization') || text.includes('azureOptimization')) {
        score += 1
        validation.recommendations.push('Azure optimization metadata found')
      }

      // Check for recommended chunking strategy
      if (text.includes('spatial_locality') || text.includes('spatial_chunking')) {
        score += 1
      }

      // Check for appropriate access patterns
      if (text.includes('random_slice') || text.includes('random_access')) {
        score += 1
      }

      // Check for storage class optimization
      if (text.includes('hot') || text.includes('standard')) {
        score += 1
      }

      // Check for redundancy settings
      if (text.includes('redundant') || text.includes('replication')) {
        score += 1
      }

      const optimizationScore = score / maxScore
      if (optimizationScore < 0.6) {
        validation.recommendations.push('Consider adding Azure-specific optimization metadata')
      }

      return optimizationScore > 0.4
    } catch {
      validation.warnings.push('Cannot validate Azure optimizations')
      return false
    }
  }

  private static calculatePerformanceMetrics(validation: OVDSValidationResult, volumeInfo: OVDSVolumeInfo): void {
    const fileSize = validation.performanceMetrics.fileSize
    
    // Estimate load time based on file size and compression
    const baseMBps = 100 // Base transfer rate in MB/s for Azure
    const compressionBonus = validation.validationSteps.compression ? 1.5 : 1.0
    const lodBonus = volumeInfo.lodLevels > 4 ? 1.3 : 1.0
    
    const effectiveTransferRate = baseMBps * compressionBonus * lodBonus
    validation.performanceMetrics.estimatedLoadTime = (fileSize / 1024 / 1024) / effectiveTransferRate

    // Calculate random access score
    let accessScore = 0.5 // Base score
    
    if (validation.validationSteps.brickLayout) accessScore += 0.15
    if (validation.validationSteps.lodStructure) accessScore += 0.15
    if (validation.validationSteps.compression) accessScore += 0.1
    if (validation.validationSteps.azureOptimization) accessScore += 0.1
    
    validation.performanceMetrics.randomAccessScore = Math.min(1.0, accessScore)
  }

  private static generateRecommendations(validation: OVDSValidationResult): void {
    // Performance-based recommendations
    if (validation.performanceMetrics.estimatedLoadTime > 10) {
      validation.recommendations.push('File may benefit from higher compression or chunking optimization')
    }

    if (validation.performanceMetrics.randomAccessScore < 0.7) {
      validation.recommendations.push('Optimize brick layout and LOD structure for better random access')
    }

    if (validation.performanceMetrics.compressionRatio > 0.8) {
      validation.recommendations.push('Low compression ratio - consider wavelet compression for seismic data')
    }

    // Azure-specific recommendations
    if (!validation.azureCompatible) {
      validation.recommendations.push('Enable Azure-specific optimizations for best cloud performance')
    }

    // Add final summary
    if (validation.isValid && validation.azureCompatible) {
      validation.recommendations.unshift('✅ OVDS file is optimized for Azure Energy Data Services')
    }
  }

  private static findMetadataEnd(data: ArrayBuffer): number {
    // Find the end of JSON metadata to locate binary data
    try {
      const textDecoder = new TextDecoder()
      const text = textDecoder.decode(data.slice(0, 8192))
      const lastBrace = text.lastIndexOf('}')
      return lastBrace > 0 ? lastBrace + 1 : 4096
    } catch {
      return 4096 // Default metadata size
    }
  }
}

// Export utility functions for testing
export const OVDSTestUtils = {
  createMockOVDS: (size: number = 1024 * 1024): ArrayBuffer => {
    const mockHeader = {
      ovds_header: {
        format: 'OVDS',
        version: '1.2',
        createdBy: 'Test Suite',
        creationTime: new Date().toISOString(),
        sourceFormat: 'SEG-Y',
        azureCompatible: true
      },
      volume_info: {
        dimensionality: 3,
        format: 'float32',
        components: 1,
        lodLevels: 6,
        brickSize: [64, 64, 64],
        negativeMargin: [4, 4, 4],
        positiveMargin: [4, 4, 4]
      },
      geometry: {
        inlineRange: [1, 1000],
        crosslineRange: [1, 100], 
        sampleRange: [0, 2000],
        ijkToWorld: [25, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0.002, 0, 0, 0, 0, 1]
      },
      compression: {
        algorithm: 'wavelet',
        tolerance: 0.01,
        brickCompression: 'zstd'
      },
      azure_optimization: {
        chunkingStrategy: 'spatial_locality',
        accessPattern: 'random_slice',
        storageClass: 'hot'
      }
    }

    const headerText = JSON.stringify(mockHeader) + '\n'
    const headerBytes = new TextEncoder().encode(headerText)
    const dataSize = size - headerBytes.length
    
    const result = new ArrayBuffer(size)
    const view = new Uint8Array(result)
    
    // Write header
    view.set(headerBytes, 0)
    
    // Write mock seismic data
    const dataView = new Float32Array(result, headerBytes.length, Math.floor(dataSize / 4))
    for (let i = 0; i < dataView.length; i++) {
      dataView[i] = Math.sin(i * 0.01) * Math.exp(-i * 0.0001)
    }
    
    return result
  }
}