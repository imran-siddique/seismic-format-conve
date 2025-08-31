# 🚀 Quick Start Guide

Get started with the Seismic Format Converter in just 5 minutes! This guide walks you through your first conversion from a legacy format to modern HDF5.

## ⚡ 60-Second Setup

```bash
# 1. Clone and install (30 seconds)
git clone https://github.com/imran-siddique/seismic-format-conve.git
cd seismic-format-conve
npm install

# 2. Start development server (30 seconds)
npm run dev
# Open http://localhost:5173
```

## 🎯 Your First Conversion

### **Step 1: Upload a File**

1. **Open the application** in your browser
2. **Drag and drop** any seismic file into the upload zone
3. **Watch automatic format detection** identify your file type

**Supported test files:**
- `.segy` / `.sgy` - SEG-Y seismic data
- `.csv` - Comma-separated seismic traces
- `.las` - Well log ASCII standard
- `.txt` - ASCII seismic data

> **💡 No seismic files?** Use any CSV or text file to test the interface

### **Step 2: Select Target Format**

Choose your conversion target:

| Format | Best For | Cloud Ready |
|--------|----------|-------------|
| **HDF5** | Modern workflows, data science | ✅ |
| **OVDS** | Azure Energy Data Services | ✅ |
| **JSON** | Web applications, APIs | ✅ |
| **CSV** | Spreadsheet analysis | ⚠️ |

**Recommendation**: Start with **HDF5** for maximum compatibility.

### **Step 3: Run Conversion**

1. **Click "Convert File"** button
2. **Watch real-time progress** with detailed steps
3. **Download your converted file** when complete

**Typical conversion flow:**
```
📁 File Upload (2s)
🔍 Format Detection (1s)
📊 Metadata Extraction (3s)
🔄 Data Conversion (10-30s)
📦 Compression & Optimization (5s)
✅ Download Ready
```

## 🧪 Test the Validation Suite

Run the built-in testing to verify conversion quality:

1. **Upload a SEG-Y file** (or any binary file for demo)
2. **Navigate to the "Conversion Test" section**
3. **Click "Run Test Suite"**
4. **Review validation results**

**Test categories:**
- **Format Validation**: File structure integrity
- **Azure Compatibility**: Energy Data Services readiness
- **Data Integrity**: Amplitude preservation
- **Metadata Preservation**: Parameter retention

## 📊 Understanding the Interface

### **Main Sections**

#### **1. File Upload Zone**
```
┌─────────────────────────────────────┐
│  📁 Drag & Drop Your Seismic File   │
│                                     │
│  Supports: SEG-Y, SEG-D, LAS,      │
│  NetCDF, HDF5, CSV, and 15+ more   │
│                                     │
│  [Browse Files]                     │
└─────────────────────────────────────┘
```

#### **2. Format Selector**
```
Source: SEG-Y (Detected) ───┐
                            │ 
Target: [HDF5 ▼]            │
                            │
Azure Optimized: ☑          │
                            │
[Convert File] ─────────────┘
```

#### **3. Progress Monitor**
```
Converting seismic_data.segy...
[████████████████████░░░░] 85%

✅ Header parsing complete
✅ Trace extraction complete  
🔄 HDF5 structure creation...
⏳ Compression optimization...
```

#### **4. Results & Download**
```
✅ Conversion Complete!

📈 Statistics:
• Processing time: 12.3 seconds
• Compression ratio: 65%
• File size: 45.2 MB → 15.8 MB

[📥 Download HDF5] [📋 View Report]
```

## 🎯 Common Use Cases

### **Case 1: Legacy SEG-Y to Modern HDF5**

**Scenario**: You have old SEG-Y files that need to work with modern Python tools.

```typescript
// Conversion configuration
const config = {
  sourceFormat: 'SEG-Y',
  targetFormat: 'HDF5',
  preserveMetadata: true,
  compressionLevel: 6
}
```

**Benefits:**
- 📈 **2-5x faster** I/O performance
- 💾 **30-70% smaller** file sizes
- 🔧 **Universal tool** compatibility
- 📊 **Rich metadata** support

### **Case 2: Cloud Migration to Azure**

**Scenario**: Preparing data for Azure Energy Data Services.

```typescript
// Azure-optimized conversion
const config = {
  sourceFormat: 'SEG-Y',
  targetFormat: 'OVDS',
  azureCompatible: true,
  cloudOptimized: true
}
```

**Features:**
- ☁️ **Streaming access** optimized
- 🗂️ **Level of detail** for different resolutions
- 🔍 **Spatial indexing** for efficient queries
- 🗜️ **Smart compression** for cloud storage

### **Case 3: Research Data Standardization**

**Scenario**: Converting various formats for consistent analysis.

```typescript
// Multi-format to HDF5 standardization
const formats = ['SEG-Y', 'NetCDF', 'LAS', 'CSV']
const target = 'HDF5'

// All formats → standardized HDF5 output
```

**Advantages:**
- 🔄 **Consistent data structure**
- 📚 **Preserved metadata** across formats
- 🛠️ **Same analysis tools** for all data
- 📁 **Organized data hierarchy**

## 🔍 Exploring Advanced Features

### **Metadata Inspection**

After conversion, examine preserved metadata:

```json
{
  "format": "HDF5",
  "dimensions": {
    "samples": 2048,
    "traces": 1200,
    "lines": 96
  },
  "samplingRate": 2000,
  "units": "meters",
  "acquisitionParameters": {
    "survey_type": "3D",
    "acquisition_date": "2024-01-01"
  },
  "azureCompatibility": {
    "version": "2024.1",
    "supportedOperations": ["read", "write", "slice"]
  }
}
```

### **Compression Options**

Test different compression levels:

| Level | Speed | Size | Quality |
|-------|-------|------|---------|
| **1** | Fastest | Largest | Lossless |
| **6** | Balanced | Medium | Lossless |
| **9** | Slowest | Smallest | Lossless |

### **Batch Processing** (Coming Soon)

```typescript
// Future feature: Process multiple files
const batchConfig = {
  inputFolder: '/seismic-data/',
  outputFormat: 'HDF5',
  preserveStructure: true,
  parallelJobs: 4
}
```

## 🛠️ Developer Quick Start

### **Customize the Converter**

```typescript
// Add custom format parser
import { SeismicConverter } from '@/lib/seismicConverter'

// Extend with new format
SeismicConverter.addParser('MyFormat', (data: ArrayBuffer) => {
  // Your parsing logic
  return parsedData
})
```

### **Integration Examples**

```typescript
// Programmatic conversion
import { SeismicConverter } from '@/lib/seismicConverter'

const result = await SeismicConverter.convert(file, {
  sourceFormat: 'SEG-Y',
  targetFormat: 'HDF5',
  preserveMetadata: true
}, (progress) => {
  console.log(`Progress: ${progress}%`)
})
```

### **Custom UI Components**

```tsx
// Use converter components in your app
import { FileUploadZone, FormatSelector } from '@/components'

function MyConverter() {
  return (
    <div>
      <FileUploadZone onFileSelect={handleFile} />
      <FormatSelector value={format} onChange={setFormat} />
    </div>
  )
}
```

## 📚 Learning Resources

### **Essential Reading**
1. **[Supported Formats](Supported-Formats.md)** - Complete format matrix
2. **[Azure Integration](Azure-Integration.md)** - Cloud workflow guide
3. **[Architecture](Architecture.md)** - Technical deep dive

### **Video Tutorials** (Planned)
- 🎥 **"Converting SEG-Y to HDF5"** (5 minutes)
- 🎥 **"Azure Cloud Migration"** (10 minutes)
- 🎥 **"Batch Processing Setup"** (8 minutes)

### **Sample Data**
Download test files for practice:
- **[Sample SEG-Y](samples/seismic_3d.segy)** (15 MB)
- **[Well Log LAS](samples/well_log.las)** (2 MB)
- **[Navigation P190](samples/navigation.p190)** (1 MB)

## ⚡ Performance Tips

### **For Large Files (>100 MB)**
- Use **chunked processing** mode
- Enable **streaming compression**
- Monitor **memory usage** in browser dev tools
- Consider **Web Worker** processing (coming soon)

### **For Cloud Workflows**
- Choose **OVDS format** for Azure
- Enable **spatial indexing**
- Use **level-of-detail** optimization
- Test with **small files first**

### **For Batch Processing**
- Process files **sequentially** to avoid memory issues
- Use **consistent compression** settings
- **Validate each file** before processing
- **Monitor disk space** for output files

## 🎯 What's Next?

After completing your first conversion:

1. **[Explore Examples](Examples-and-Usage.md)** - See real-world scenarios
2. **[Read Format Guide](Supported-Formats.md)** - Understand format capabilities  
3. **[Join Development](Contributing.md)** - Help improve the converter
4. **[Deploy Production](Deployment.md)** - Set up for your organization

## 🆘 Quick Help

**Common questions:**
- **Q**: File not detected correctly?
- **A**: Check [Format Detection](Troubleshooting.md#format-detection)

- **Q**: Conversion taking too long?
- **A**: See [Performance Optimization](Troubleshooting.md#performance)

- **Q**: Azure integration not working?
- **A**: Review [Azure Setup Guide](Azure-Integration.md)

---

**🎉 Congratulations!** You've successfully completed your first seismic data conversion. The converter is now ready for production use with your real seismic datasets.

*Ready for advanced features? Dive into our [comprehensive examples](Examples-and-Usage.md) next!*