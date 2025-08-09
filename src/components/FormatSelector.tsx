import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface FormatSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const SUPPORTED_FORMATS = [
  { value: 'HDF5', label: 'HDF5', description: 'Hierarchical Data Format 5 - Primary target', priority: true },
  { value: 'OVDS', label: 'OVDS (OpenVDS)', description: 'Open Volumetric Data Standard - Azure optimized', priority: true, azure: true },
  { value: 'ZGY', label: 'ZGY (Petrel)', description: 'Azure Energy Data Services compatible format', priority: true, azure: true },
  { value: 'JSON', label: 'JSON', description: 'Web-friendly structured format' },
  { value: 'CSV', label: 'CSV', description: 'Comma-separated values' },
  { value: 'SEG-Y', label: 'SEG-Y', description: 'Society of Exploration Geophysicists Y format' },
  { value: 'SEG-D', label: 'SEG-D', description: 'SEG field recording format' },
  { value: 'SU', label: 'Seismic Unix', description: 'Seismic Unix format' },
  { value: 'UKOOA', label: 'UKOOA', description: 'UK Offshore Operators Association format' },
  { value: 'NetCDF', label: 'NetCDF', description: 'Network Common Data Form' },
  { value: 'WebGL', label: 'WebGL Buffer', description: 'Optimized for web rendering' },
  { value: 'Binary', label: 'Binary Array', description: 'Compact binary format' }
]

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="format-select">Target Format</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="format-select">
          <SelectValue placeholder="Select output format" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_FORMATS.map((format) => (
            <SelectItem key={format.value} value={format.value}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{format.label}</span>
                  {format.priority && !format.azure && (
                    <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                  {format.azure && (
                    <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                      Azure Compatible
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{format.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}