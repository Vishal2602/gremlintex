import { useState } from 'react'
import { X, Book, Search, Copy, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { generateBibTeX } from '../services/aiService'

export function CitationModal() {
  const { citationOpen, setCitationOpen, apiKey, latex, setLatex, addToast } = useStore()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!citationOpen) return null

  const handleSearch = async () => {
    if (!apiKey) {
      addToast({ type: 'error', message: 'Please set your OpenRouter API key first' })
      return
    }
    if (!query.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const data = await generateBibTeX(apiKey, query)
      if (data.error) {
        addToast({ type: 'error', message: data.error })
      } else {
        setResult(data)
      }
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Citation lookup failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyBibTeX = () => {
    if (result?.bibtex) {
      navigator.clipboard.writeText(result.bibtex)
      addToast({ type: 'success', message: 'BibTeX copied to clipboard!' })
    }
  }

  const handleInsertCite = () => {
    if (result?.citeCommand) {
      // Insert cite command at cursor position or end
      setLatex(latex + '\n' + result.citeCommand)
      addToast({ type: 'success', message: 'Citation inserted!' })
    }
  }

  const handleAddToBibliography = () => {
    if (!result?.bibtex) return

    // Check if there's a bibliography section
    if (latex.includes('\\begin{thebibliography}')) {
      // Add before \end{thebibliography}
      const newLatex = latex.replace(
        '\\end{thebibliography}',
        `\n${result.bibtex}\n\\end{thebibliography}`
      )
      setLatex(newLatex)
    } else {
      // Add bibtex comment at the end
      setLatex(latex + `\n\n% Add this to your .bib file:\n% ${result.bibtex.replace(/\n/g, '\n% ')}`)
    }
    addToast({ type: 'success', message: 'BibTeX entry added!' })
    setCitationOpen(false)
  }

  return (
    <div className="modal-overlay" onClick={() => setCitationOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title flex items-center gap-2">
            <Book size={18} />
            Citation Helper
          </h2>
          <button onClick={() => setCitationOpen(false)} className="btn btn-icon btn-ghost">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-text-secondary text-sm mb-4">
            Enter a DOI, paper title, or URL to generate a BibTeX entry.
          </p>

          <div className="input-group mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="10.1000/xyz123 or 'Attention Is All You Need'"
              className="input"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </div>

          {result && (
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Generated BibTeX</span>
                <button onClick={handleCopyBibTeX} className="btn btn-sm btn-ghost">
                  <Copy size={12} />
                  Copy
                </button>
              </div>

              <pre className="text-xs text-text-code bg-surface p-3 rounded overflow-x-auto mb-3">
                {result.bibtex}
              </pre>

              <div className="text-sm mb-3">
                <span className="text-text-secondary">Citation key: </span>
                <code className="text-primary">{result.citeKey}</code>
              </div>

              <div className="flex gap-2">
                <button onClick={handleInsertCite} className="btn btn-sm btn-secondary">
                  Insert \cite
                </button>
                <button onClick={handleAddToBibliography} className="btn btn-sm btn-primary">
                  Add to Bibliography
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
