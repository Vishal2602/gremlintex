/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a2e',
        surface: '#16213e',
        'surface-elevated': '#1f2940',
        primary: '#f59e0b',
        secondary: '#8b5cf6',
        accent: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9',
        success: '#10b981',
      },
      fontFamily: {
        ui: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        editor: ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
        gremlin: ['Fredoka One', 'Comic Neue', 'cursive'],
      },
    },
  },
  plugins: [],
}
