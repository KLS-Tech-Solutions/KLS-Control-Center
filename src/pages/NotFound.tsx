import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

/** Catch-all route so a mistyped path still lands somewhere branded. */
export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-azure-600 text-[13px] font-semibold tracking-[0.14em] uppercase">
        Error 404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-secondary mt-2 max-w-sm text-sm">
        The page you are looking for does not exist in the KLS Control Center prototype.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>
          <ArrowLeft size={15} /> Back to dashboard
        </Button>
      </Link>
    </div>
  )
}
