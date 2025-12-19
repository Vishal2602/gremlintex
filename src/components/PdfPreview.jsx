import { useState } from 'react'
import { ZoomIn, ZoomOut, FileText, AlertCircle } from 'lucide-react'
import { useStore } from '../store/useStore'

export function PdfPreview() {
  const { latex, compiling, gremlins } = useStore()
  const [zoom, setZoom] = useState(100)

  const activeGremlins = gremlins.filter(g => g.status !== 'fixed' && g.severity === 'error')
  const hasErrors = activeGremlins.length > 0

  // Simple LaTeX to preview conversion (renders a styled preview)
  const renderPreview = () => {
    if (compiling) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-text-secondary">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
          <p>Compiling...</p>
        </div>
      )
    }

    if (hasErrors) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-text-secondary p-8 text-center">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {activeGremlins.length} Gremlin{activeGremlins.length > 1 ? 's' : ''} Blocking Compile
          </h3>
          <p className="text-sm">Fix the errors in the sidebar to see your PDF preview.</p>
        </div>
      )
    }

    // Extract document info for preview
    const titleMatch = latex.match(/\\title\{([^}]*)\}/)
    const authorMatch = latex.match(/\\author\{([^}]*)\}/)
    const dateMatch = latex.match(/\\date\{([^}]*)\}/)
    const sections = latex.match(/\\section\*?\{([^}]*)\}/g) || []
    const content = latex
      .replace(/\\documentclass.*$/gm, '')
      .replace(/\\usepackage.*$/gm, '')
      .replace(/\\begin\{document\}/g, '')
      .replace(/\\end\{document\}/g, '')
      .replace(/\\maketitle/g, '')
      .replace(/\\title\{[^}]*\}/g, '')
      .replace(/\\author\{[^}]*\}/g, '')
      .replace(/\\date\{[^}]*\}/g, '')

    return (
      <div
        className="pdf-page p-12 min-h-[800px]"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          width: '8.5in',
          minHeight: '11in'
        }}
      >
        {/* Title Block */}
        {(titleMatch || authorMatch) && (
          <div className="text-center mb-8">
            {titleMatch && (
              <h1 className="text-2xl font-bold text-black mb-2">
                {titleMatch[1]}
              </h1>
            )}
            {authorMatch && (
              <p className="text-gray-700">{authorMatch[1].replace(/\\\\|\\and/g, ', ')}</p>
            )}
            {dateMatch && (
              <p className="text-gray-500 text-sm mt-1">
                {dateMatch[1] === '\\today' ? new Date().toLocaleDateString() : dateMatch[1]}
              </p>
            )}
          </div>
        )}

        {/* Render content sections */}
        <div className="text-black text-sm leading-relaxed space-y-4">
          {content.split(/\\section\*?\{/).slice(1).map((section, i) => {
            const [title, ...body] = section.split('}')
            const bodyText = body.join('}')
              .replace(/\\begin\{itemize\}/g, '<ul>')
              .replace(/\\end\{itemize\}/g, '</ul>')
              .replace(/\\begin\{enumerate\}/g, '<ol>')
              .replace(/\\end\{enumerate\}/g, '</ol>')
              .replace(/\\item\s*/g, '<li>')
              .replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>')
              .replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>')
              .replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, '<div class="equation">$1</div>')
              .replace(/\$([^$]+)\$/g, '<span class="math">$1</span>')
              .replace(/\\\\/g, '<br/>')
              .replace(/\\[a-zA-Z]+\{[^}]*\}/g, '') // Remove other commands
              .replace(/\\[a-zA-Z]+/g, '') // Remove remaining commands
              .trim()

            return (
              <div key={i} className="mb-6">
                <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-200 pb-1">
                  {i + 1}. {title}
                </h2>
                <div
                  className="text-gray-800 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: bodyText }}
                />
              </div>
            )
          })}

          {/* Show abstract if present */}
          {latex.includes('\\begin{abstract}') && (
            <div className="mb-6 p-4 bg-gray-50 border-l-4 border-gray-300">
              <h3 className="font-bold text-black mb-2">Abstract</h3>
              <p className="text-gray-700 italic text-sm">
                {latex.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/)?.[1]?.trim() || ''}
              </p>
            </div>
          )}
        </div>

        {/* Page number */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-gray-400 text-sm">
          1
        </div>
      </div>
    )
  }

  return (
    <div className="preview-panel">
      <div className="pdf-viewer">
        {renderPreview()}
      </div>

      <div className="pdf-controls">
        <button
          onClick={() => setZoom(z => Math.max(50, z - 10))}
          className="btn btn-icon btn-ghost"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-sm text-text-secondary min-w-[4ch] text-center">
          {zoom}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(200, z + 10))}
          className="btn btn-icon btn-ghost"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-4 bg-surface-elevated mx-1"></div>
        <button
          onClick={() => setZoom(100)}
          className="btn btn-sm btn-ghost"
          title="Reset zoom"
        >
          <FileText size={14} className="mr-1" />
          Fit
        </button>
      </div>
    </div>
  )
}
