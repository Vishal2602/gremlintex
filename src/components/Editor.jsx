import { useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { useStore } from '../store/useStore'

// Simple LaTeX highlighting extension
const latexHighlight = {
  extension: [],
}

export function Editor() {
  const { latex, setLatex, gremlins } = useStore()

  const onChange = useCallback((value) => {
    setLatex(value)
  }, [setLatex])

  // Find error lines
  const errorLines = gremlins
    .filter(g => g.status !== 'fixed' && g.lineStart)
    .map(g => g.lineStart)

  return (
    <div className="editor-container">
      <CodeMirror
        value={latex}
        height="100%"
        theme={oneDark}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
        }}
        style={{
          height: '100%',
          fontSize: '13px',
          fontFamily: 'var(--font-editor)',
        }}
      />
    </div>
  )
}
