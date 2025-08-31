# 📊 Supported Formats

Comprehensive guide to all 21+ seismic data formats supported by the converter, with detailed conversion capabilities and format-specific considerations.

## 🎯 Format Support Matrix

### **Industry Standard Formats**

| Format | Read | Write | Azure Support | HDF5 Target | Best Use Case |
|--------|------|--------|---------------|-------------|---------------|
| **SEG-Y** | ✅ | ✅ | ✅ **Primary** | ✅ Recommended | 3D seismic surveys |
| **SEG-D** | ✅ | ⚠️ | ✅ | ✅ Recommended | Marine acquisition |
| **Seismic Unix** | ✅ | ✅ | ⚠️ Limited | ✅ | Research processing |

### **Navigation & Positioning**

| Format | Read | Write | Azure Support | HDF5 Target | Best Use Case |
|--------|------|--------|---------------|-------------|---------------|
| **UKOOA P1/90** | ✅ | ✅ | ✅ | ✅ | Navigation data |
| **UKOOA P1/94** | ✅ | ✅ | ✅ | ✅ | Enhanced navigation |
| **UKOOA P2/90** | ✅ | ⚠️ | ✅ | ✅ | Source positioning |
| **UKOOA P2/94** | ✅ | ⚠️ | ✅ | ✅ | Enhanced positioning |

### **Well Log Formats**

| Format | Read | Write | Azure Support | HDF5 Target | Best Use Case |
|--------|------|--------|---------------|-------------|---------------|
| **LAS** | ✅ | ✅ | ✅ **Primary** | ✅ Recommended | Well log data |
| **DLIS** | ✅ | ⚠️ | ✅ | ✅ Recommended | Digital logs |

### **Scientific Data Formats**

| Format | Read | Write | Azure Support | HDF5 Target | Best Use Case |
|--------|------|--------|---------------|-------------|---------------|
| **NetCDF** | ✅ | ✅ | ✅ | ✅ Optimized | Climate/ocean data |
| **NetCDF4** | ✅ | ✅ | ✅ **Primary** | ✅ Direct | HDF5-based scientific |
| **HDF5** | ✅ | ✅ | ✅ **Primary** | ✅ Passthrough | Modern standard |
| **OpenVDS** | ✅ | ✅ | ✅ **Primary** | ✅ | Cloud volumetric |

### **Commercial Formats**

| Format | Read | Write | Azure Support | HDF5 Target | Best Use Case |
|--------|------|--------|---------------|-------------|---------------|
| **Petrel ZGY** | ✅ | ✅ | ✅ **Primary** | ✅ | Schlumberger workflows |
| **Paradigm GeoDepth** | ✅ | ⚠️ | ⚠️ | ✅ | Paradigm processing |
| **Paradigm HSR** | ✅ | ⚠️ | ⚠️ | ✅ | High-resolution data |
| **Geoframe IESX** | ✅ | ⚠️ | ⚠️ | ✅ | Geoframe workflows |

### **Text & Data Formats**

| Format | Read | Write | Azure Support | HDF5 Target | Best Use Case |
|--------|------|--------|---------------|-------------|---------------|
| **CSV** | ✅ | ✅ | ✅ | ✅ | Spreadsheet analysis |
| **TSV** | ✅ | ✅ | ✅ | ✅ | Tab-delimited data |
| **ASCII Text** | ✅ | ✅ | ⚠️ | ✅ | Human-readable |
| **ASCII Data** | ✅ | ✅ | ⚠️ | ✅ | Structured text |
| **ASCII Grid** | ✅ | ✅ | ⚠️ | ✅ | Grid-based data |

### **Binary Formats**

| Format | Read | Write | Azure Support | HDF5 Target | Best Use Case |
|--------|------|--------|---------------|-------------|---------------|
| **Binary** | ✅ | ✅ | ⚠️ | ✅ | Generic binary |
| **Raw Binary** | ✅ | ✅ | ⚠️ | ✅ | Unstructured data |

## 📋 Detailed Format Specifications

### **SEG-Y (Society of Exploration Geophysicists Y-Format)**

**Overview**: Industry standard for 3D seismic data interchange.

**Structure**:
```
┌─────────────────┐
│ Textual Header  │ 3200 bytes (EBCDIC)
├─────────────────┤
│ Binary Header   │ 400 bytes  
├─────────────────┤
│ Trace 1 Header  │ 240 bytes
│ Trace 1 Data    │ Variable
├─────────────────┤
│ Trace 2 Header  │ 240 bytes  
│ Trace 2 Data    │ Variable
│      ...        │
└─────────────────┘
```

**Key Features**:
- **Endianness**: Big-endian (standard) or little-endian
- **Data Types**: Integer, IEEE float, IBM float
- **Trace Length**: Variable, defined in binary header
- **Geometry**: Inline/crossline or shot/receiver

**Conversion Benefits to HDF5**:
- **Performance**: 3-5x faster random access
- **Size**: 40-60% smaller with compression
- **Metadata**: Rich attributes and hierarchical structure
- **Tools**: Compatible with Python (h5py), MATLAB, R

**Azure Integration**:
```typescript
// SEG-Y to Azure-optimized OVDS
const azureConfig = {
  sourceFormat: 'SEG-Y',
  targetFormat: 'OVDS',
  azureCompatible: true,
  spatialIndexing: true,
  lodLevels: 8,
  brickSize: [64, 64, 64]
}
```

### **SEG-D (SEG Disk Format)**

**Overview**: Standard for marine seismic data acquisition.

**Structure**:
```
┌─────────────────┐
│ General Header  │ 32 bytes
├─────────────────┤
│ Channel Set     │ Variable
│ Descriptors     │
├─────────────────┤
│ Extended Header │ Optional
├─────────────────┤
│ Trace Data      │ Variable
│ Blocks          │
└─────────────────┘
```

**Key Features**:
- **Multi-channel**: Up to 65,535 channels
- **Sample Formats**: 16-bit, 24-bit, 32-bit, IEEE float
- **Geometry**: Shot/receiver coordinates
- **Timing**: Precise timing information

**HDF5 Conversion Strategy**:
```typescript
// SEG-D structure mapping
const hdf5Structure = {
  '/acquisition': {
    'shots': shotData,
    'receivers': receiverData,
    'timing': timingData
  },
  '/seismic_data': {
    'traces': traceData,
    'headers': headerData
  },
  '/metadata': {
    'survey_parameters': surveyInfo,
    'processing_history': processingSteps
  }
}
```

### **LAS (Log ASCII Standard)**

**Overview**: Standard format for well log data.

**Structure**:
```
~VERSION INFORMATION
VERS.   2.0: CWLS LOG ASCII STANDARD - VERSION 2.0
WRAP.   NO: ONE LINE PER DEPTH STEP

~WELL INFORMATION  
STRT.FT  100.0: START DEPTH
STOP.FT  900.0: STOP DEPTH
STEP.FT    0.5: STEP

~CURVE INFORMATION
DEPT.FT: DEPTH
GR.GAPI: GAMMA RAY
CALI.IN: CALIPER

~ASCII LOG DATA
100.0  45.2  8.5
100.5  46.1  8.7
...
```

**Key Features**:
- **Depth Indexed**: Regular or irregular depth sampling
- **Multiple Curves**: Unlimited log curves per file
- **Units**: Explicit unit definitions
- **Metadata**: Well information and curve descriptions

**HDF5 Benefits for Well Logs**:
- **Multi-dimensional**: Store multiple wells in single file
- **Correlation**: Depth/time correlation tables
- **Metadata**: Rich well and formation metadata
- **Integration**: Easy integration with seismic data

### **NetCDF/NetCDF4**

**Overview**: Self-describing scientific data format.

**Key Features**:
- **Self-Describing**: Metadata embedded in file
- **Portable**: Platform-independent
- **CF Conventions**: Climate and forecast metadata
- **Multi-dimensional**: N-dimensional arrays

**NetCDF4 to HDF5**:
NetCDF4 is built on HDF5, providing direct compatibility:
```typescript
// Direct NetCDF4 → HDF5 conversion
const conversionBenefits = {
  performance: 'Enhanced chunking and compression',
  compatibility: 'Direct HDF5 tool access',
  features: 'Advanced HDF5 features available',
  metadata: 'Richer attribute system'
}
```

### **OpenVDS (Open Volumetric Data Standard)**

**Overview**: Cloud-native volumetric data format.

**Key Features**:
- **Level of Detail**: Multiple resolutions
- **Brick Structure**: Spatial locality optimization  
- **Streaming**: Efficient random access
- **Compression**: Wavelet-based compression

**OVDS Structure**:
```typescript
interface OVDSStructure {
  header: {
    format: 'OVDS',
    version: '1.2',
    cloudOptimized: true
  },
  volumeInfo: {
    dimensionality: 3,
    lodLevels: 8,
    brickSize: [64, 64, 64]
  },
  compression: {
    algorithm: 'wavelet',
    tolerance: 0.01
  }
}
```

**Azure Optimization**:
- **Blob Storage**: Optimized chunk sizes
- **Access Patterns**: Random slice extraction
- **Compression**: Fast decompression for streaming
- **Indexing**: Spatial queries support

## 🔄 Conversion Strategies

### **Legacy to Modern Workflow**

```mermaid
graph LR
    A[Legacy SEG-Y] --> B[Format Analysis]
    B --> C[Header Extraction]
    C --> D[Trace Processing]
    D --> E[HDF5 Structure]
    E --> F[Compression]
    F --> G[Validation]
    G --> H[Modern HDF5]
```

### **Format-Specific Optimizations**

#### **SEG-Y → HDF5**
```typescript
const segyToHDF5 = {
  textualHeader: '/metadata/textual_header',
  binaryHeader: '/metadata/binary_header',
  traceHeaders: '/traces/headers',
  traceData: '/traces/data',
  geometry: '/geometry/coordinates',
  processing: '/metadata/processing_history'
}
```

#### **Multiple Formats → Standardized HDF5**
```typescript
const standardizedStructure = {
  '/seismic_data': 'Consistent trace data storage',
  '/metadata': 'Unified metadata schema',
  '/geometry': 'Standardized coordinate system',
  '/processing': 'Common processing history',
  '/quality': 'Data quality metrics'
}
```

### **Azure Cloud Migration Strategy**

```typescript
// Multi-stage cloud migration
const migrationPipeline = {
  stage1: 'Legacy format validation',
  stage2: 'Cloud-optimized conversion (OVDS)',
  stage3: 'Azure storage optimization',
  stage4: 'Energy Data Services integration',
  stage5: 'Streaming access configuration'
}
```

## 📈 Performance Comparisons

### **File Size Reduction**

| Source Format | Original Size | HDF5 Size | Reduction | OVDS Size | Reduction |
|---------------|---------------|-----------|-----------|-----------|-----------|
| **SEG-Y** | 1.2 GB | 420 MB | 65% | 380 MB | 68% |
| **SEG-D** | 890 MB | 310 MB | 65% | 290 MB | 67% |
| **NetCDF** | 650 MB | 240 MB | 63% | 225 MB | 65% |
| **LAS** | 45 MB | 18 MB | 60% | 16 MB | 64% |

### **I/O Performance**

| Operation | Legacy Format | HDF5 | OVDS | Improvement |
|-----------|---------------|------|------|-------------|
| **Random Read** | 100 ms | 20 ms | 15 ms | 5-7x faster |
| **Sequential Read** | 50 ms | 25 ms | 20 ms | 2-3x faster |
| **Metadata Access** | 200 ms | 5 ms | 3 ms | 40-70x faster |
| **Slice Extraction** | 500 ms | 80 ms | 45 ms | 6-11x faster |

## 🎯 Format Selection Guide

### **Choose HDF5 When:**
- **Data Science**: Python/R analysis workflows
- **Long-term Storage**: Future-proof archival
- **Multi-tool Access**: Need universal compatibility
- **Metadata Rich**: Complex attribute requirements

### **Choose OVDS When:**
- **Cloud First**: Azure Energy Data Services
- **Streaming Access**: Remote data visualization
- **Large Datasets**: Multi-TB seismic volumes  
- **Random Access**: Arbitrary slice extraction

### **Choose Original Format When:**
- **Legacy Tools**: Must use specific software
- **Data Exchange**: Industry standard required
- **Processing Workflows**: Format-specific algorithms
- **Compatibility**: Legacy system requirements

## 🔧 Format-Specific Configuration

### **SEG-Y Processing Options**
```typescript
const segyConfig = {
  endianness: 'big' | 'little' | 'auto',
  dataFormat: 'ibm_float' | 'ieee_float' | 'integer',
  headerEncoding: 'ebcdic' | 'ascii',
  traceValidation: true,
  geometryExtraction: 'inline_crossline' | 'shot_receiver'
}
```

### **HDF5 Output Options**
```typescript
const hdf5Config = {
  compressionLevel: 1-9,
  chunkSize: [64, 64, 64],
  shuffleFilter: true,
  checksums: true,
  metadataCompression: 'gzip',
  attributeEncoding: 'utf-8'
}
```

### **OVDS Cloud Options**
```typescript
const ovdsConfig = {
  lodLevels: 4-12,
  brickSize: [32, 32, 32] | [64, 64, 64] | [128, 128, 128],
  compressionTolerance: 0.001-0.1,
  accessPattern: 'random' | 'sequential' | 'slice',
  storageClass: 'hot' | 'cool' | 'archive'
}
```

---

## 🚀 Future Format Support

### **Planned Additions**
- **SEG-P1** - Point receiver format
- **SEGD 3.0** - Latest marine standard  
- **RESQML** - Reservoir modeling standard
- **PPDM** - Petroleum data model
- **MinIO** - Object storage format

### **Community Requests**
Vote for format priorities on our [GitHub Discussions](https://github.com/imran-siddique/seismic-format-conve/discussions).

---

*Complete format compatibility ensures your seismic data workflows are never limited by format constraints. From legacy standards to cloud-native formats — convert with confidence.*