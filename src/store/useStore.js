import { create } from 'zustand'

const PAPER_TEMPLATES = {
  ieee: `\\documentclass[conference]{IEEEtran}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}
\\usepackage{cite}

\\begin{document}

\\title{Your Paper Title}
\\author{\\IEEEauthorblockN{Author Name}
\\IEEEauthorblockA{\\textit{Department} \\\\
\\textit{University}\\\\
City, Country \\\\
email@example.com}}

\\maketitle

\\begin{abstract}
Your abstract goes here.
\\end{abstract}

\\begin{IEEEkeywords}
keyword1, keyword2, keyword3
\\end{IEEEkeywords}

\\section{Introduction}
Start writing here...

\\section{Related Work}

\\section{Methodology}

\\section{Results}

\\section{Conclusion}

\\bibliographystyle{IEEEtran}
\\bibliography{references}

\\end{document}`,
  acm: `\\documentclass[sigconf]{acmart}

\\begin{document}

\\title{Your Paper Title}
\\author{Author Name}
\\affiliation{%
  \\institution{University Name}
  \\city{City}
  \\country{Country}}
\\email{email@example.com}

\\begin{abstract}
Your abstract goes here.
\\end{abstract}

\\keywords{keyword1, keyword2, keyword3}

\\maketitle

\\section{Introduction}
Start writing here...

\\section{Background}

\\section{Approach}

\\section{Evaluation}

\\section{Conclusion}

\\bibliographystyle{ACM-Reference-Format}
\\bibliography{references}

\\end{document}`,
  homework: `\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb}
\\usepackage{enumitem}

\\title{Homework Assignment}
\\author{Your Name}
\\date{\\today}

\\begin{document}
\\maketitle

\\section*{Problem 1}
\\begin{enumerate}[label=(\\alph*)]
  \\item First part of the problem...
  \\item Second part...
\\end{enumerate}

\\section*{Problem 2}
Solution goes here...

\\end{document}`,
  resume: `\\documentclass[11pt,letterpaper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
{\\LARGE \\textbf{Your Name}}\\\\[4pt]
email@example.com $\\bullet$ (555) 123-4567 $\\bullet$ City, State\\\\
\\href{https://linkedin.com/in/yourprofile}{LinkedIn} $\\bullet$ \\href{https://github.com/yourusername}{GitHub}
\\end{center}

\\section*{Education}
\\textbf{University Name} \\hfill Expected Graduation: Month Year\\\\
\\textit{Degree, Major} \\hfill GPA: X.XX

\\section*{Experience}
\\textbf{Company Name} \\hfill City, State\\\\
\\textit{Position Title} \\hfill Month Year -- Present
\\begin{itemize}[leftmargin=*, nosep]
  \\item Achievement or responsibility
  \\item Another achievement
\\end{itemize}

\\section*{Skills}
\\textbf{Programming:} Language1, Language2, Language3\\\\
\\textbf{Tools:} Tool1, Tool2, Tool3

\\end{document}`,
  poster: `\\documentclass[a0paper,portrait]{tikzposter}
\\usepackage{amsmath}

\\title{Your Poster Title}
\\author{Author Names}
\\institute{Institution}

\\usetheme{Default}

\\begin{document}
\\maketitle

\\begin{columns}
\\column{0.5}
\\block{Introduction}{
  Your introduction text goes here.
}
\\block{Methods}{
  Describe your methodology.
}

\\column{0.5}
\\block{Results}{
  Present your results.
}
\\block{Conclusion}{
  Summarize your findings.
}
\\end{columns}

\\end{document}`,
  blank: `\\documentclass[12pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb}

\\title{Document Title}
\\author{Your Name}
\\date{\\today}

\\begin{document}
\\maketitle

Start writing here...

\\end{document}`
}

const DEFAULT_LATEX = `\\documentclass[12pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}

\\title{My First GremlinTeX Document}
\\author{Happy Writer}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introduction}
Welcome to GremlinTeX! This is your AI-powered LaTeX editor where errors become friendly gremlins that you can tame.

\\section{Math Example}
Here's the famous equation:
\\begin{equation}
  E = mc^2
\\end{equation}

And the quadratic formula:
\\begin{equation}
  x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\\end{equation}

\\section{A List}
\\begin{itemize}
  \\item Write LaTeX on the left
  \\item See your PDF on the right
  \\item Fix gremlins with one click!
\\end{itemize}

\\section{Conclusion}
Happy writing! May your gremlins be few and easily tamed.

\\end{document}`

export const useStore = create((set, get) => ({
  // Editor state
  latex: DEFAULT_LATEX,
  setLatex: (latex) => set({ latex }),

  // API Key
  apiKey: localStorage.getItem('openrouter_api_key') || '',
  setApiKey: (key) => {
    localStorage.setItem('openrouter_api_key', key)
    set({ apiKey: key })
  },

  // Gremlins (errors/warnings)
  gremlins: [],
  addGremlin: (gremlin) => set((state) => ({
    gremlins: [...state.gremlins, { ...gremlin, id: Date.now() + Math.random() }]
  })),
  removeGremlin: (id) => set((state) => ({
    gremlins: state.gremlins.filter(g => g.id !== id)
  })),
  fixGremlin: (id) => set((state) => ({
    gremlins: state.gremlins.map(g =>
      g.id === id ? { ...g, status: 'fixed' } : g
    )
  })),
  clearGremlins: () => set({ gremlins: [] }),
  setGremlins: (gremlins) => set({ gremlins }),

  // Paper skin
  currentSkin: 'blank',
  setSkin: (skin) => {
    const template = PAPER_TEMPLATES[skin]
    if (template) {
      set({ currentSkin: skin, latex: template })
    }
  },

  // UI State
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  settingsOpen: false,
  setSettingsOpen: (open) => set({ settingsOpen: open }),

  skinsOpen: false,
  setSkinsOpen: (open) => set({ skinsOpen: open }),

  citationOpen: false,
  setCitationOpen: (open) => set({ citationOpen: open }),

  // Loading states
  compiling: false,
  setCompiling: (compiling) => set({ compiling }),

  aiLoading: false,
  setAiLoading: (loading) => set({ aiLoading: loading }),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = Date.now()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  // Templates
  templates: PAPER_TEMPLATES,
}))
