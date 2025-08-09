import { useCallback, useState } from 'react'
import { Upload } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
}

export function FileUploadZone({ onFileSelect }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }, [onFileSelect])

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <Upload size={32} className={cn(
          "transition-colors",
          isDragOver ? "text-primary" : "text-muted-foreground"
        )} />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Drop your seismic file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: SEG-Y (.segy, .sgy), Seismic Unix (.su), ASCII (.txt, .dat, .csv)
          </p>
        </div>

        <input
          type="file"
          accept=".segy,.sgy,.su,.txt,.dat,.csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}