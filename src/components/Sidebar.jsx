import { X, Sparkles, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { GremlinMeter } from './GremlinMeter'
import { GremlinCard } from './GremlinCard'
import { checkMathSanity } from '../services/aiService'

export function Sidebar() {
  const {
    gremlins,
    sidebarOpen,
    toggleSidebar,
    apiKey,
    latex,
    setGremlins,
    addToast,
    aiLoading,
    setAiLoading
  } = useStore()

  const handleMathCheck = async () => {
    if (!apiKey) {
      addToast({ type: 'error', message: 'Please set your OpenRouter API key first' })
      return
    }

    setAiLoading(true)
    try {
      const suggestions = await checkMathSanity(apiKey, latex)
      if (suggestions.length > 0) {
        const newGremlins = suggestions.map(s => ({
          id: Date.now() + Math.random(),
          severity: s.severity,
          message: s.message,
          lineStart: s.lineStart,
          lineEnd: s.lineEnd,
          fix: s.suggestion,
          type: s.type
        }))
        setGremlins([...gremlins, ...newGremlins])
        addToast({ type: 'info', message: `Found ${suggestions.length} math suggestion${suggestions.length > 1 ? 's' : ''}` })
      } else {
        addToast({ type: 'success', message: 'Math looks good!' })
      }
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Math check failed' })
    } finally {
      setAiLoading(false)
    }
  }

  const activeGremlins = gremlins.filter(g => g.status !== 'fixed')
  const fixedGremlins = gremlins.filter(g => g.status === 'fixed')

  return (
    <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-header">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="font-gremlin text-primary">Gremlins</span>
            {activeGremlins.length > 0 && (
              <span className="bg-error text-white text-xs px-2 py-0.5 rounded-full">
                {activeGremlins.length}
              </span>
            )}
          </h2>
          <button
            onClick={toggleSidebar}
            className="btn btn-icon btn-ghost lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleMathCheck}
            disabled={aiLoading}
            className="btn btn-sm btn-secondary flex-1"
          >
            {aiLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Math Check
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        <GremlinMeter />

        {activeGremlins.length === 0 && fixedGremlins.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-medium">No gremlins here!</p>
            <p className="text-sm mt-1">Your document is gremlin-free.</p>
          </div>
        )}

        {activeGremlins.map(gremlin => (
          <GremlinCard key={gremlin.id} gremlin={gremlin} />
        ))}

        {fixedGremlins.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm text-text-secondary mb-2">Tamed Gremlins</h3>
            {fixedGremlins.map(gremlin => (
              <GremlinCard key={gremlin.id} gremlin={gremlin} />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
