import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock } from "lucide-react"

interface StaleStateProps {
  lastSyncAt: string
}

export function StaleState({ lastSyncAt }: StaleStateProps) {
  return (
    <Alert variant="warning" className="mx-auto max-w-md">
      <Clock className="h-4 w-4" />
      <AlertTitle>Data may be outdated</AlertTitle>
      <AlertDescription>
        Last sync: {new Date(lastSyncAt).toLocaleString()}
      </AlertDescription>
    </Alert>
  )
}
