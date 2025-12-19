# Code Review - GremlinTeX

**Reviewer:** Taylor
**Date:** 2025-12-19
**Project:** GremlinTeX - AI LaTeX Editor

---

## REVIEW_STATUS: FAIL

---

## Critical Issues

### 1. App Component Missing - Build Fails
The project cannot compile. Both `main.tsx` and `main.jsx` import `./App` but no App component exists anywhere in the codebase. This is a showstopper.

```
src/main.tsx(3,17): error TS2307: Cannot find module './App'
```

### 2. Duplicate Entry Points
There are two entry files (`main.tsx` and `main.jsx`) which creates confusion. Pick one and stick with it.

### 3. Duplicate Templates
Templates are defined twice - once in `src/store/useStore.js` (lines 3-177) and again in `src/utils/templates.ts` (lines 3-266). They're slightly different versions too, which will cause bugs when they diverge.

### 4. Missing Zustand Package
The store imports `create` from `zustand`, but zustand isn't in package.json dependencies. The app will crash at runtime.

### 5. Missing CodeMirror React Wrapper
`Editor.jsx` imports from `@uiw/react-codemirror` but the package.json only has the core CodeMirror packages, not the React wrapper.

---

## Secondary Issues

### 6. Unused Parameter Warning
`src/services/openrouter.ts:285` - The `apiKey` parameter in `fixEnvironments` is declared but never used (the function does local regex work).

### 7. Type Inconsistencies
- `GremlinCard.jsx` expects `gremlin.status` and `gremlin.fix` properties
- `useStore.js` uses `status: 'fixed'` but the types in `index.ts` use `isFixed: boolean`
- Store's `fixGremlin` sets `status: 'fixed'` but types expect `isFixed: boolean`

### 8. XSS Vulnerability
`PdfPreview.jsx:103-106` uses `dangerouslySetInnerHTML` with minimally sanitized content. While it's internal content, the regex-based sanitization is weak and could allow script injection if malicious LaTeX is loaded.

### 9. AI Service Duplication
Two AI service files exist (`aiService.js` and `openrouter.ts`) with overlapping functionality. Pick one approach.

### 10. Missing Error Boundaries
No React error boundaries anywhere. AI failures or parse errors will crash the whole app.

---

## What's Good

- The design system in DESIGN.md is thorough and well thought out
- CSS component architecture is solid with good dark mode support
- AI integration code in `openrouter.ts` has decent error handling
- Gremlin meter and card components have the right UX patterns
- Template system covers the main academic use cases
- Accessibility considerations (reduced motion, focus states) are present in CSS

---

## Required Fixes Before Pass

1. Create the App.tsx component that ties everything together
2. Remove one of the duplicate entry points (recommend keeping .jsx for consistency)
3. Add zustand and @uiw/react-codemirror to dependencies
4. Consolidate templates to a single source of truth
5. Fix the type inconsistencies between store and TypeScript definitions
6. Remove the unused apiKey parameter or actually use it

---

The foundation here is actually pretty solid - good AI service architecture, nice design system, thoughtful component styling. But you can't ship an app that doesn't build. Get the App component in place, fix the dependencies, and clean up the type mismatches, then we can talk.
