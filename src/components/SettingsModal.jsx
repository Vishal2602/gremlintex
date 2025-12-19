import { useState } from 'react'
import { X, Key, Eye, EyeOff, Check } from 'lucide-react'
import { useStore } from '../store/useStore'

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen, apiKey, setApiKey, addToast } = useStore()
  const [key, setKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)

  if (!settingsOpen) return null

  const handleSave = () => {
    setApiKey(key)
    addToast({ type: 'success', message: 'API key saved!' })
    setSettingsOpen(false)
  }

  return (
    <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button onClick={() => setSettingsOpen(false)} className="btn btn-icon btn-ghost">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Key size={14} />
              OpenRouter API Key
            </label>
            <p className="text-text-secondary text-xs mb-3">
              Get your API key from{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
            <div className="input-group">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="input"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="btn btn-icon btn-secondary"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="bg-surface-elevated p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-2">AI Features</h4>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• Error explanations in plain English</li>
              <li>• Auto-patch suggestions with diffs</li>
              <li>• Math sanity checks</li>
              <li>• Structure helper for rough notes</li>
              <li>• Citation generator from DOI/titles</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => setSettingsOpen(false)} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <Check size={14} />
            Save Key
          </button>
        </div>
      </div>
    </div>
  )
}
