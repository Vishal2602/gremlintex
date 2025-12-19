import { useEffect } from 'react'
import {
  Editor,
  PdfPreview,
  Sidebar,
  QuickSpells,
  Toolbar,
  PaperSkinsModal,
  SettingsModal,
  CitationModal,
  ToastContainer
} from './components'
import { useStore } from './store/useStore'

function App() {
  const { sidebarOpen, apiKey, setSettingsOpen } = useStore()

  // Show settings on first load if no API key
  useEffect(() => {
    if (!apiKey) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => {
        setSettingsOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="app-container">
      <Toolbar />

      <div className="editor-panel">
        <QuickSpells />
        <Editor />
      </div>

      <PdfPreview />

      {sidebarOpen && <Sidebar />}

      {/* Modals */}
      <PaperSkinsModal />
      <SettingsModal />
      <CitationModal />

      {/* Toasts */}
      <ToastContainer />
    </div>
  )
}

export default App
