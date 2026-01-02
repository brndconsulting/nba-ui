import { AlertTriangle } from "lucide-react"
import { copy } from "@/copy/es"

interface ErrorStateProps {
  errors: Array<{ code: string; message: string; field?: string }>
}

export function ErrorState({ errors }: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
        <div>
          <h3 className="font-semibold text-destructive">{copy.common.errorTitle}</h3>
          <ul className="mt-2 space-y-1 text-sm text-destructive/80">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
