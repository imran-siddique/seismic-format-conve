import { Download, CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ConversionJob {
  id: string
  fileName: string
  sourceFormat: string
  targetFormat: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  timestamp: number
  error?: string
  downloadUrl?: string
}

interface ConversionHistoryProps {
  history: ConversionJob[]
  onDownload: (job: ConversionJob) => void
}

export function ConversionHistory({ history, onDownload }: ConversionHistoryProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-accent" />
      case 'error':
        return <XCircle size={16} className="text-destructive" />
      case 'processing':
        return <Clock size={16} className="text-blue-500 animate-spin" />
      default:
        return <Clock size={16} className="text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-accent/10 text-accent">Completed</Badge>
      case 'error':
        return <Badge variant="destructive">Failed</Badge>
      case 'processing':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Processing</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock size={32} className="mx-auto mb-2 opacity-50" />
        <p>No conversion history yet</p>
        <p className="text-sm">Completed conversions will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead>Conversion</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                {job.fileName}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{job.sourceFormat}</Badge>
                  <span>→</span>
                  <Badge variant="outline">{job.targetFormat}</Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  {getStatusBadge(job.status)}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatTime(job.timestamp)}
              </TableCell>
              <TableCell>
                {job.status === 'completed' && job.downloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(job)}
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}