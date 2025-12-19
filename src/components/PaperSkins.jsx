import { X } from 'lucide-react'
import { useStore } from '../store/useStore'

const SKINS = [
  { id: 'ieee', label: 'IEEE', description: 'Conference paper format' },
  { id: 'acm', label: 'ACM', description: 'ACM publication format' },
  { id: 'homework', label: 'Homework', description: 'Clean assignment template' },
  { id: 'resume', label: 'Resume', description: 'Professional CV layout' },
  { id: 'poster', label: 'Poster', description: 'Research poster (TikZposter)' },
  { id: 'blank', label: 'Blank', description: 'Start from scratch' },
]

export function PaperSkinsModal() {
  const { skinsOpen, setSkinsOpen, currentSkin, setSkin } = useStore()

  if (!skinsOpen) return null

  const handleSelect = (skinId) => {
    setSkin(skinId)
    setSkinsOpen(false)
  }

  return (
    <div className="modal-overlay" onClick={() => setSkinsOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title font-gremlin">Paper Skins</h2>
          <button onClick={() => setSkinsOpen(false)} className="btn btn-icon btn-ghost">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-text-secondary text-sm mb-4">
            Choose a template to get started. This will replace your current document.
          </p>

          <div className="skins-grid">
            {SKINS.map(skin => (
              <button
                key={skin.id}
                onClick={() => handleSelect(skin.id)}
                className={`skin-card ${currentSkin === skin.id ? 'skin-card--selected' : ''}`}
              >
                <div className="skin-preview">
                  <div className="h-full flex flex-col p-2 text-[6px] text-gray-400 leading-tight">
                    <div className="text-center text-[8px] font-bold text-gray-600 mb-1">
                      {skin.label}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-0.5 bg-gray-100 rounded w-1/2 mx-auto"></div>
                      <div className="mt-2 space-y-0.5">
                        <div className="h-0.5 bg-gray-100 rounded"></div>
                        <div className="h-0.5 bg-gray-100 rounded w-5/6"></div>
                        <div className="h-0.5 bg-gray-100 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="skin-label">{skin.label}</div>
                <div className="text-[10px] text-text-muted text-center">{skin.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
