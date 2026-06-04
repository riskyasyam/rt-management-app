import * as React from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

const ToastContext = React.createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, title, description, variant }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-[var(--radius)] border bg-white p-4 shadow-lg animate-fade-in',
              toast.variant === 'success'     && 'border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success-bg))]',
              toast.variant === 'destructive' && 'border-[hsl(var(--danger)/0.3)]  bg-[hsl(var(--danger-bg))]',
              toast.variant === 'default'     && 'border-[hsl(var(--border))]',
            )}
          >
            {toast.variant === 'success'     && <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />}
            {toast.variant === 'destructive' && <AlertCircle  className="h-4 w-4 text-[hsl(var(--danger))]  mt-0.5 shrink-0" />}
            {toast.variant === 'default'     && <Info         className="h-4 w-4 text-[hsl(var(--info))]    mt-0.5 shrink-0" />}
            <div className="flex-1 min-w-0">
              {toast.title       && <p className="text-sm font-semibold text-[hsl(var(--text-primary))] leading-tight">{toast.title}</p>}
              {toast.description && <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5 leading-relaxed">{toast.description}</p>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="shrink-0 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
