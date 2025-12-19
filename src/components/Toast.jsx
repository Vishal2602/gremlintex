import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const typeConfig = {
  success: { icon: CheckCircle, className: 'toast--success' },
  error: { icon: XCircle, className: 'toast--error' },
  info: { icon: Info, className: 'toast--info' },
}

export function ToastContainer() {
  const { toasts, removeToast } = useStore()

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const config = typeConfig[toast.type] || typeConfig.info
        const Icon = config.icon

        return (
          <div key={toast.id} className={`toast ${config.className}`}>
            <Icon size={18} />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn btn-icon btn-ghost btn-sm"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
