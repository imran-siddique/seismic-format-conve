import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Info, ArrowRight, Lightning } from '@phosphor-icons/react'

interface FormatInfoProps {
  sourceFormat: string
  targetFormat: string
  fileName: string
}

const FORMAT_INFO = {
  'SEG-Y': {
    description: 'Standard seismic data exchange format',
    characteristics: ['Binary traces', 'EBCDIC/ASCII headers', 'Industry standard'],
    toHDF5Benefits: ['Faster I/O', 'Better compression', 'Metadata preservation']
  },
  'SEG-D': {
    description: 'Field recording format for raw seismic data',
    characteristics: ['Multiplexed format', 'Auxiliary channels', 'Real-time data'],
    toHDF5Benefits: ['Structured storage', 'Channel organization', 'Processing efficiency']
  },
  'Seismic Unix': {
    description: 'Open-source seismic processing format',
    characteristics: ['Header + data traces', 'Processing friendly', 'ASCII headers'],
    toHDF5Benefits: ['Modern storage', 'Better scalability', 'Metadata richness']
  },
  'UKOOA P1/90': {
    description: 'UK offshore navigation format',
    characteristics: ['Navigation data', 'Position records', 'Time correlation'],
    toHDF5Benefits: ['Geospatial indexing', 'Coordinate systems', 'Query efficiency']
  },
  'LAS': {
    description: 'Well log data format',
    characteristics: ['ASCII format', 'Depth indexed', 'Curve data'],
    toHDF5Benefits: ['Multi-dimensional storage', 'Depth/time correlation', 'Metadata linking']
  },
  'DLIS': {
    description: 'Digital Log Interchange Standard',
    characteristics: ['Binary format', 'Complex structures', 'Rich metadata'],
    toHDF5Benefits: ['Simplified access', 'Better performance', 'Standard compliance']
  },
  'NetCDF': {
    description: 'Network Common Data Form',
    characteristics: ['Self-describing', 'Portable', 'Scientific format'],
    toHDF5Benefits: ['Enhanced performance', 'Better compression', 'Richer metadata']
  },
  'OpenVDS': {
    description: 'Open Volumetric Data Standard',
    characteristics: ['3D/4D volumes', 'Compressed', 'Cloud optimized'],
    toHDF5Benefits: ['Open standard', 'Better tooling', 'Universal access']
  },
  'ASCII Text': {
    description: 'Plain text seismic data',
    characteristics: ['Human readable', 'Simple format', 'Custom structures'],
    toHDF5Benefits: ['Binary efficiency', 'Metadata structure', 'Processing speed']
  },
  'UKOOA P1/94': {
    description: 'UK offshore navigation format (P1/94 standard)',
    characteristics: ['Enhanced navigation', 'Position records', 'Time correlation', '1994 standard'],
    toHDF5Benefits: ['Geospatial indexing', 'Coordinate systems', 'Query efficiency', 'Time series support']
  },
  'Petrel ZGY': {
    description: 'Schlumberger Petrel native seismic format',
    characteristics: ['3D volumes', 'Compressed storage', 'Petrel optimized', 'Brick layout'],
    toHDF5Benefits: ['Open format', 'Better compression', 'Cross-platform access', 'Universal tooling']
  },
  'CSV': {
    description: 'Comma-separated values seismic data',
    characteristics: ['Tabular format', 'Human readable', 'Spreadsheet compatible', 'Simple structure'],
    toHDF5Benefits: ['Binary efficiency', 'Metadata linking', 'Multi-dimensional arrays', 'Compression']
  },
  'NetCDF4': {
    description: 'Network Common Data Form version 4 (HDF5-based)',
    characteristics: ['Self-describing', 'HDF5-based', 'Scientific format', 'Compressed'],
    toHDF5Benefits: ['Direct compatibility', 'Enhanced features', 'Better performance', 'Modern tooling']
  },
  'TSV': {
    description: 'Tab-separated values seismic data',
    characteristics: ['Tabular format', 'Tab delimited', 'Human readable', 'Simple structure'],
    toHDF5Benefits: ['Binary efficiency', 'Metadata structure', 'Multi-dimensional arrays', 'Compression']
  },
  'ASCII Data': {
    description: 'Generic ASCII seismic data format',
    characteristics: ['Human readable', 'Flexible structure', 'Whitespace delimited', 'Text-based'],
    toHDF5Benefits: ['Binary efficiency', 'Structured metadata', 'Processing speed', 'Compression']
  },
  'ASCII Grid': {
    description: 'ASCII grid format for seismic surfaces',
    characteristics: ['Grid structure', 'Header metadata', 'Spatial data', 'Human readable'],
    toHDF5Benefits: ['Efficient storage', 'Spatial indexing', 'Metadata preservation', 'Multi-dimensional']
  },
  'Binary': {
    description: 'Generic binary seismic data',
    characteristics: ['Binary format', 'Compact storage', 'Fast access', 'Platform specific'],
    toHDF5Benefits: ['Standardization', 'Metadata structure', 'Cross-platform', 'Self-describing']
  },
  'Raw Binary': {
    description: 'Raw binary seismic data arrays',
    characteristics: ['Unstructured binary', 'Minimal overhead', 'Direct data', 'No metadata'],
    toHDF5Benefits: ['Metadata addition', 'Structure definition', 'Validation', 'Documentation']
  },
  'Paradigm GeoDepth': {
    description: 'Paradigm GeoDepth seismic format',
    characteristics: ['Proprietary format', 'Velocity models', 'Depth processing', 'Commercial software'],
    toHDF5Benefits: ['Open standard', 'Tool interoperability', 'Better accessibility', 'Future-proofing']
  },
  'Paradigm HSR': {
    description: 'Paradigm HSR seismic format',
    characteristics: ['High-resolution', 'Paradigm proprietary', 'Processing optimized', 'Binary structure'],
    toHDF5Benefits: ['Open access', 'Standard compliance', 'Tool compatibility', 'Metadata richness']
  },
  'Geoframe IESX': {
    description: 'Schlumberger Geoframe IESX format',
    characteristics: ['Integrated workflow', 'Proprietary format', 'Multi-domain data', 'Complex structure'],
    toHDF5Benefits: ['Standardization', 'Simplified access', 'Open tools', 'Better interoperability']
  }
} as const

export function FormatInfo({ sourceFormat, targetFormat, fileName }: FormatInfoProps) {
  const sourceInfo = FORMAT_INFO[sourceFormat as keyof typeof FORMAT_INFO]
  const isHDF5Target = targetFormat === 'HDF5'
  
  if (!sourceInfo) return null

  return (
    <div className="space-y-4">
      {/* Source Format Info */}
      <Alert>
        <Info size={16} />
        <AlertDescription>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Source: {sourceFormat}</span>
              <Badge variant="outline">{fileName.split('.').pop()?.toUpperCase()}</Badge>
            </div>
            <p className="text-sm">{sourceInfo.description}</p>
            <div className="flex flex-wrap gap-1">
              {sourceInfo.characteristics.map((char, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {char}
                </Badge>
              ))}
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* HDF5 Conversion Benefits */}
      {isHDF5Target && (
        <Alert className="border-accent/50 bg-accent/5">
          <Lightning size={16} className="text-accent" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <span>{sourceFormat}</span>
                <ArrowRight size={14} />
                <span>HDF5 Conversion Benefits</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {sourceInfo.toHDF5Benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-accent/50">
                    {benefit}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                HDF5 provides a modern, self-describing format optimized for scientific computing 
                with excellent compression, chunking, and parallel I/O capabilities.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}