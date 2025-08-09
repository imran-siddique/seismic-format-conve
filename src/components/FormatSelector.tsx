import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface FormatSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const SUPPORTED_FORMATS = [
  { value: 'JSON', label: 'JSON', description: 'Web-friendly structured format' },
  { value: 'CSV', label: 'CSV', description: 'Comma-separated values' },
  { value: 'HDF5', label: 'HDF5', description: 'Hierarchical Data Format' },
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
                <span className="font-medium">{format.label}</span>
                <span className="text-xs text-muted-foreground">{format.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}