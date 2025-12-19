import {
  Play,
  Settings,
  FileText,
  Book,
  Layout,
  Menu,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { suggestStructure, checkCitations } from '../services/aiService'

export function Toolbar() {
  const {
    toggleSidebar,
    setSettingsOpen,
    setSkinsOpen,
    setCitationOpen,
    latex,
    setLatex,
    apiKey,
    addToast,
    compiling,
    setCompiling,
    gremlins,
    setGremlins,
    aiLoading,
    setAiLoading
  } = useStore()

  const handleCompile = () => {
    setCompiling(true)

    // Simulate compilation and error detection
    setTimeout(() => {
      const errors = []

      // Check for common LaTeX errors
      const lines = latex.split('\n')

      // Check for unmatched braces
      let braceCount = 0
      lines.forEach((line, i) => {
        for (const char of line) {
          if (char === '{') braceCount++
          if (char === '}') braceCount--
        }
        if (braceCount < 0) {
          errors.push({
            id: Date.now() + Math.random(),
            severity: 'error',
            message: 'Extra closing brace found',
            lineStart: i + 1,
            fix: line.replace(/\}/, ''),
            oldCode: line
          })
          braceCount = 0
        }
      })

      if (braceCount > 0) {
        errors.push({
          id: Date.now() + Math.random(),
          severity: 'error',
          message: `Missing ${braceCount} closing brace${braceCount > 1 ? 's' : ''}`,
          lineStart: lines.length
        })
      }

      // Check for unmatched environments
      const beginMatches = latex.match(/\\begin\{(\w+)\}/g) || []
      const endMatches = latex.match(/\\end\{(\w+)\}/g) || []

      const begins = beginMatches.map(m => m.match(/\\begin\{(\w+)\}/)[1])
      const ends = endMatches.map(m => m.match(/\\end\{(\w+)\}/)[1])

      begins.forEach((env, i) => {
        if (!ends.includes(env)) {
          const lineNum = lines.findIndex(l => l.includes(`\\begin{${env}}`)) + 1
          errors.push({
            id: Date.now() + Math.random(),
            severity: 'error',
            message: `Environment '${env}' is opened but never closed`,
            lineStart: lineNum,
            fix: `\\end{${env}}`
          })
        }
      })

      // Check for missing \end{document}
      if (latex.includes('\\begin{document}') && !latex.includes('\\end{document}')) {
        errors.push({
          id: Date.now() + Math.random(),
          severity: 'error',
          message: 'Document is missing \\end{document}',
          lineStart: lines.length,
          fix: '\\end{document}'
        })
      }

      // Check for undefined commands (simple heuristic)
      const knownCommands = [
        'documentclass', 'usepackage', 'begin', 'end', 'title', 'author', 'date',
        'maketitle', 'section', 'subsection', 'textbf', 'textit', 'item', 'cite',
        'ref', 'label', 'frac', 'sqrt', 'sum', 'int', 'equation', 'align',
        'figure', 'table', 'includegraphics', 'caption', 'centering', 'hfill',
        'vspace', 'hspace', 'newline', 'par', 'today', 'LaTeX', 'TeX', 'and',
        'affiliation', 'email', 'institution', 'city', 'country', 'keywords',
        'bibliography', 'bibliographystyle', 'IEEEauthorblockN', 'IEEEauthorblockA',
        'IEEEkeywords', 'abstract', 'column', 'block', 'usetheme', 'institute',
        'geometry', 'leftmargin', 'nosep', 'href', 'pm', 'times', 'bullet'
      ]

      const commandMatches = latex.match(/\\([a-zA-Z]+)/g) || []
      const usedCommands = [...new Set(commandMatches.map(m => m.slice(1)))]

      usedCommands.forEach(cmd => {
        if (!knownCommands.includes(cmd) && !cmd.match(/^[A-Z]/)) {
          // Skip capitalized (likely custom) and known commands
          const lineNum = lines.findIndex(l => l.includes(`\\${cmd}`)) + 1
          if (lineNum > 0 && !errors.some(e => e.lineStart === lineNum)) {
            errors.push({
              id: Date.now() + Math.random(),
              severity: 'warning',
              message: `Unknown command '\\${cmd}' - make sure it's defined or the right package is loaded`,
              lineStart: lineNum
            })
          }
        }
      })

      setGremlins(errors)
      setCompiling(false)

      if (errors.length === 0) {
        addToast({ type: 'success', message: 'Compiled successfully!' })
      } else {
        addToast({
          type: 'error',
          message: `Found ${errors.length} gremlin${errors.length > 1 ? 's' : ''}`
        })
      }
    }, 800)
  }

  const handleStructure = async () => {
    if (!apiKey) {
      addToast({ type: 'error', message: 'Please set your OpenRouter API key first' })
      return
    }

    setAiLoading(true)
    try {
      const structured = await suggestStructure(apiKey, latex)
      if (structured) {
        setLatex(structured)
        addToast({ type: 'success', message: 'Document structured!' })
      }
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Structure helper failed' })
    } finally {
      setAiLoading(false)
    }
  }

  const handleCheckCitations = async () => {
    if (!apiKey) {
      addToast({ type: 'error', message: 'Please set your OpenRouter API key first' })
      return
    }

    setAiLoading(true)
    try {
      const result = await checkCitations(apiKey, latex)
      const issues = []

      if (result.undefinedCites?.length > 0) {
        issues.push({
          id: Date.now() + Math.random(),
          severity: 'error',
          message: `Undefined citations: ${result.undefinedCites.join(', ')}`
        })
      }

      if (result.unusedEntries?.length > 0) {
        issues.push({
          id: Date.now() + Math.random(),
          severity: 'warning',
          message: `Unused bibliography entries: ${result.unusedEntries.join(', ')}`
        })
      }

      result.suggestedCitations?.forEach(s => {
        issues.push({
          id: Date.now() + Math.random(),
          severity: 'info',
          message: `Consider adding citation: "${s.text.substring(0, 50)}..." - ${s.reason}`,
          lineStart: s.line
        })
      })

      if (issues.length > 0) {
        setGremlins([...gremlins, ...issues])
        addToast({ type: 'info', message: `Found ${issues.length} citation issue${issues.length > 1 ? 's' : ''}` })
      } else {
        addToast({ type: 'success', message: 'Citations look good!' })
      }
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Citation check failed' })
    } finally {
      setAiLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([latex], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.tex'
    a.click()
    URL.revokeObjectURL(url)
    addToast({ type: 'success', message: 'Downloaded document.tex' })
  }

  const activeErrors = gremlins.filter(g => g.status !== 'fixed' && g.severity === 'error')

  return (
    <div className="toolbar">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/gremlin.svg" alt="GremlinTeX" className="w-8 h-8" />
          <span className="font-gremlin text-xl text-primary hidden sm:inline">
            GremlinTeX
          </span>
        </div>

        <div className="h-6 w-px bg-surface-elevated hidden sm:block"></div>

        <button onClick={() => setSkinsOpen(true)} className="btn btn-sm btn-ghost">
          <FileText size={14} />
          <span className="hidden sm:inline">Templates</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleStructure}
          disabled={aiLoading}
          className="btn btn-sm btn-ghost hidden md:flex"
        >
          {aiLoading ? <RefreshCw size={14} className="animate-spin" /> : <Layout size={14} />}
          Structure
        </button>

        <button
          onClick={() => setCitationOpen(true)}
          className="btn btn-sm btn-ghost hidden md:flex"
        >
          <Book size={14} />
          Cite
        </button>

        <button
          onClick={handleCheckCitations}
          disabled={aiLoading}
          className="btn btn-sm btn-ghost hidden lg:flex"
        >
          {aiLoading ? <RefreshCw size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
          Check Cites
        </button>

        <div className="h-6 w-px bg-surface-elevated"></div>

        <button onClick={handleDownload} className="btn btn-sm btn-ghost">
          <Download size={14} />
          <span className="hidden sm:inline">.tex</span>
        </button>

        <button
          onClick={handleCompile}
          disabled={compiling}
          className="btn btn-sm btn-primary"
        >
          {compiling ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Play size={14} />
          )}
          Compile
          {activeErrors.length > 0 && (
            <span className="bg-error text-white text-xs px-1.5 rounded-full ml-1">
              {activeErrors.length}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-surface-elevated"></div>

        <button onClick={() => setSettingsOpen(true)} className="btn btn-icon btn-ghost">
          <Settings size={16} />
        </button>

        <button onClick={toggleSidebar} className="btn btn-icon btn-ghost lg:hidden">
          <Menu size={16} />
        </button>
      </div>
    </div>
  )
}
