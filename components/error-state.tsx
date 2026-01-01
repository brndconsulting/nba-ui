import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ErrorStateProps {
  errors: Array<{ code: string; message: string; field?: string }>
}

export function ErrorState({ errors }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="mx-auto max-w-md">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
