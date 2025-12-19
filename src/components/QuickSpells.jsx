import { Wand2, Braces, Box, Link, Table, Sparkles, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { applyQuickSpell } from '../services/aiService'

const SPELLS = [
  { id: 'fix-braces', label: 'Fix Braces', icon: Braces },
  { id: 'fix-environment', label: 'Fix Environments', icon: Box },
  { id: 'normalize-refs', label: 'Normalize Refs', icon: Link },
  { id: 'clean-table', label: 'Clean Tables', icon: Table },
  { id: 'improve-clarity', label: 'Improve Clarity', icon: Sparkles },
]

export function QuickSpells() {
  const { latex, setLatex, apiKey, addToast, aiLoading, setAiLoading } = useStore()

  const handleSpell = async (spellId) => {
    if (!apiKey) {
      addToast({ type: 'error', message: 'Please set your OpenRouter API key in settings' })
      return
    }

    setAiLoading(true)
    try {
      const result = await applyQuickSpell(apiKey, latex, spellId)
      if (result && result.trim()) {
        setLatex(result)
        addToast({ type: 'success', message: 'Spell cast successfully!' })
      }
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Spell failed' })
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="spells-container">
      <Wand2 size={16} className="text-secondary shrink-0" />
      {SPELLS.map(spell => {
        const Icon = spell.icon
        return (
          <button
            key={spell.id}
            onClick={() => handleSpell(spell.id)}
            disabled={aiLoading}
            className="spell-btn"
          >
            {aiLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Icon size={14} />
            )}
            {spell.label}
          </button>
        )
      })}
    </div>
  )
}
