import { useStore } from '../store/useStore'

export function GremlinMeter() {
  const { gremlins } = useStore()

  const total = gremlins.length
  const fixed = gremlins.filter(g => g.status === 'fixed').length
  const active = total - fixed
  const percentage = total > 0 ? ((total - active) / total) * 100 : 100

  const getHealthStatus = () => {
    if (active === 0) return { text: 'All clear!', color: 'text-success' }
    if (active <= 2) return { text: 'Almost there!', color: 'text-warning' }
    return { text: `${active} gremlins`, color: 'text-error' }
  }

  const status = getHealthStatus()

  return (
    <div className="gremlin-meter">
      <div className="gremlin-meter-label">
        <span className="font-gremlin text-lg">Gremlin Meter</span>
        <span className={`gremlin-meter-count ${status.color}`}>
          {status.text}
        </span>
      </div>

      <div className="gremlin-meter-bar">
        <div
          className="gremlin-meter-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {total > 0 && (
        <div className="gremlin-meter-icons">
          {gremlins.map((g, i) => (
            <div
              key={g.id || i}
              className={`gremlin-meter-icon ${
                g.status === 'fixed' ? 'gremlin-meter-icon--fixed' : 'gremlin-meter-icon--active'
              }`}
              title={g.message}
            >
              {g.status === 'fixed' ? '✓' :
               g.severity === 'error' ? '!' :
               g.severity === 'warning' ? '?' : 'i'}
            </div>
          ))}
        </div>
      )}

      {active === 0 && total > 0 && (
        <div className="text-center mt-2 text-success text-sm celebrate">
          All gremlins tamed!
        </div>
      )}
    </div>
  )
}
