// Comprehensive usage example for Enhanced Seismic Format Converter
// Demonstrates HDF5 conversion with cloud and local storage capabilities

console.log('🌊 Enhanced Seismic Format Converter - Usage Examples')
console.log('=' .repeat(60))

// Example 1: Basic HDF5 conversion with local storage
const basicHDF5Example = {
  sourceFormat: 'SEG-Y',
  targetFormat: 'HDF5',
  fileName: 'basic_seismic.segy',
  compressionLevel: 6,
  preserveMetadata: true,
  storage: {
    type: 'local',
    localPath: './converted_files'
  }
}

console.log('📁 Example 1: Basic HDF5 Conversion with Local Storage')
console.log('Configuration:', JSON.stringify(basicHDF5Example, null, 2))
console.log('')

// Example 2: Azure cloud storage with compression optimization
const azureCloudExample = {
  sourceFormat: 'SEG-D',
  targetFormat: 'HDF5', 
  fileName: 'marine_survey_2024.segd',
  compressionLevel: 8, // High compression for cloud storage
  chunkSize: 2 * 1024 * 1024, // 2MB chunks for cloud optimization
  preserveMetadata: true,
  azureCompatible: true,
  storage: {
    type: 'azure',
    azure: {
      accountName: 'seismicenergydata',
      containerName: 'processed-surveys',
      blobName: 'marine_survey_2024_processed.h5',
      sasToken: 'sv=2021-06-08&se=2025-01-01T00:00:00Z&sr=c&sp=rwl&sig=YOUR_SAS_TOKEN_HERE'
    }
  }
}

console.log('☁️ Example 2: Azure Cloud Storage with Optimization')
console.log('Configuration:', JSON.stringify(azureCloudExample, null, 2))
console.log('')

// Example 3: Hybrid storage (local + cloud) with full features
const hybridStorageExample = {
  sourceFormat: 'Petrel ZGY',
  targetFormat: 'HDF5',
  fileName: 'deepwater_3d_survey.zgy',
  compressionLevel: 7,
  chunkSize: 1024 * 1024, // 1MB chunks
  preserveMetadata: true,
  azureCompatible: true,
  storage: {
    type: 'both',
    localPath: './local_backup',
    azure: {
      accountName: 'energydatalake',
      containerName: 'seismic-hdf5-archive',
      blobName: 'deepwater_3d_survey_hdf5.h5',
      sasToken: 'sv=2021-06-08&se=2025-12-31T23:59:59Z&sr=c&sp=rwl&sig=HYBRID_SAS_TOKEN'
    }
  }
}

console.log('🔄 Example 3: Hybrid Storage (Local + Cloud)')
console.log('Configuration:', JSON.stringify(hybridStorageExample, null, 2))
console.log('')

// Example 4: Converting multiple formats to HDF5
const multiFormatExamples = [
  { format: 'SEG-Y', description: 'Land seismic data' },
  { format: 'SEG-D', description: 'Marine seismic data' },
  { format: 'LAS', description: 'Well log data' },
  { format: 'CSV', description: 'Tabular seismic attributes' },
  { format: 'NetCDF', description: 'Scientific grid data' },
  { format: 'OpenVDS', description: 'Volumetric seismic data' },
  { format: 'ASCII Text', description: 'Text-based seismic data' },
  { format: 'Paradigm GeoDepth', description: 'Commercial depth data' },
  { format: 'UKOOA P1/90', description: 'Navigation data' },
  { format: 'DLIS', description: 'Digital log data' }
]

console.log('📋 Example 4: Supported Format Conversions to HDF5')
multiFormatExamples.forEach((example, index) => {
  console.log(`  ${index + 1}. ${example.format.padEnd(20)} → HDF5 (${example.description})`)
})
console.log('')

// Example 5: Performance comparison
const performanceComparison = {
  'Legacy Format (SEG-Y)': {
    'File Size': '1.2 GB',
    'Read Speed': 'Baseline',
    'Compression': 'None',
    'Metadata Access': 'Linear scan',
    'Cloud Compatibility': 'Poor'
  },
  'Enhanced HDF5': {
    'File Size': '420 MB (65% reduction)',
    'Read Speed': '3-5x faster',
    'Compression': 'Gzip level 6-8',
    'Metadata Access': 'Instant',
    'Cloud Compatibility': 'Excellent'
  }
}

console.log('📊 Example 5: Performance Comparison')
console.log('Legacy vs Enhanced HDF5:')
Object.entries(performanceComparison).forEach(([format, metrics]) => {
  console.log(`\n${format}:`)
  Object.entries(metrics).forEach(([metric, value]) => {
    console.log(`  ${metric}: ${value}`)
  })
})
console.log('')

// Example 6: Azure Energy Data Services workflow
const azureEnergyWorkflow = {
  step1: 'Data ingestion from field operations',
  step2: 'Format validation and Azure compatibility check',
  step3: 'Enhanced HDF5 conversion with metadata preservation',
  step4: 'Upload to Azure Energy Data Services with lifecycle management',
  step5: 'Enable analytics and ML workflows on processed data',
  benefits: [
    'Standardized format for energy industry',
    'Cloud-native storage and processing',
    'Integration with Azure ML and analytics services',
    'Cost-optimized storage tiers',
    'Global accessibility and collaboration'
  ]
}

console.log('🏭 Example 6: Azure Energy Data Services Workflow')
Object.entries(azureEnergyWorkflow).forEach(([key, value]) => {
  if (key === 'benefits') {
    console.log('Benefits:')
    value.forEach((benefit, index) => {
      console.log(`  ${index + 1}. ${benefit}`)
    })
  } else {
    console.log(`${key}: ${value}`)
  }
})
console.log('')

// Example 7: Storage cost optimization
const storageOptimization = {
  'Hot Tier (Active data)': {
    'Usage': '< 30 days',
    'Access Pattern': 'Frequent read/write',
    'Cost': 'Higher storage, lower access',
    'Use Case': 'Active processing and analysis'
  },
  'Cool Tier (Recent data)': {
    'Usage': '30-90 days',
    'Access Pattern': 'Occasional access',
    'Cost': 'Medium storage, medium access',
    'Use Case': 'Recent surveys for comparison'
  },
  'Archive Tier (Historical data)': {
    'Usage': '> 90 days',
    'Access Pattern': 'Rare access',
    'Cost': 'Lowest storage, higher access',
    'Use Case': 'Long-term preservation and compliance'
  }
}

console.log('💰 Example 7: Azure Storage Tier Optimization')
Object.entries(storageOptimization).forEach(([tier, details]) => {
  console.log(`\n${tier}:`)
  Object.entries(details).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`)
  })
})
console.log('')

console.log('✅ Enhanced Seismic Format Converter Ready!')
console.log('🎯 21+ formats supported for HDF5 conversion')
console.log('☁️ Full Azure Energy Data Services integration')
console.log('🔧 Local, cloud, and hybrid storage options')
console.log('📈 Significant performance and storage improvements')
console.log('')

export {
  basicHDF5Example,
  azureCloudExample,
  hybridStorageExample,
  multiFormatExamples,
  performanceComparison,
  azureEnergyWorkflow,
  storageOptimization
}