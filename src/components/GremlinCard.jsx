import { AlertTriangle, XCircle, Info, CheckCircle, Wand2, Eye, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const severityConfig = {
  error: {
    icon: XCircle,
    className: '',
    badgeClass: '',
    label: 'Error'
  },
  warning: {
    icon: AlertTriangle,
    className: 'gremlin-card--warning',
    badgeClass: 'gremlin-badge--warning',
    label: 'Warning'
  },
  info: {
    icon: Info,
    className: 'gremlin-card--info',
    badgeClass: 'gremlin-badge--info',
    label: 'Suggestion'
  },
  fixed: {
    icon: CheckCircle,
    className: 'gremlin-card--fixed',
    badgeClass: 'gremlin-badge--fixed',
    label: 'Fixed'
  }
}

export function GremlinCard({ gremlin }) {
  const { latex, setLatex, fixGremlin, removeGremlin, addToast } = useStore()

  const status = gremlin.status === 'fixed' ? 'fixed' : gremlin.severity
  const config = severityConfig[status] || severityConfig.error
  const Icon = config.icon

  const handleApplyFix = () => {
    if (!gremlin.fix) return

    try {
      // Simple fix application - replace the problematic section
      let newLatex = latex

      if (gremlin.oldCode && gremlin.fix) {
        newLatex = latex.replace(gremlin.oldCode, gremlin.fix)
      } else if (gremlin.lineStart && gremlin.fix) {
        const lines = latex.split('\n')
        const start = Math.max(0, gremlin.lineStart - 1)
        const end = gremlin.lineEnd || gremlin.lineStart
        lines.splice(start, end - start + 1, gremlin.fix)
        newLatex = lines.join('\n')
      }

      setLatex(newLatex)
      fixGremlin(gremlin.id)
      addToast({ type: 'success', message: 'Gremlin tamed!' })
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to apply fix' })
    }
  }

  const handleDismiss = () => {
    removeGremlin(gremlin.id)
  }

  return (
    <div className={`gremlin-card ${config.className}`}>
      <div className="gremlin-header">
        <span className={`gremlin-badge ${config.badgeClass}`}>
          <Icon size={12} />
          {config.label}
        </span>
        {gremlin.lineStart && (
          <span className="gremlin-lines">
            {gremlin.lineEnd && gremlin.lineEnd !== gremlin.lineStart
              ? `Lines ${gremlin.lineStart}-${gremlin.lineEnd}`
              : `Line ${gremlin.lineStart}`}
          </span>
        )}
      </div>

      <p className="gremlin-description">{gremlin.message}</p>

      {gremlin.diff && (
        <div className="gremlin-diff">
          {gremlin.diff.map((line, i) => (
            <div
              key={i}
              className={`gremlin-diff-line ${
                line.startsWith('+') ? 'gremlin-diff-line--add' :
                line.startsWith('-') ? 'gremlin-diff-line--remove' : ''
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {gremlin.status !== 'fixed' && (
        <div className="gremlin-actions">
          {gremlin.fix && (
            <button className="btn btn-sm btn-primary" onClick={handleApplyFix}>
              <Wand2 size={12} />
              Apply Fix
            </button>
          )}
          <button className="btn btn-sm btn-ghost" onClick={handleDismiss}>
            <X size={12} />
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
