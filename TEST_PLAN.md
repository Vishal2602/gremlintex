# GremlinTeX Test Plan

## Overview

This test plan covers functional testing, edge case exploration, and user experience validation for GremlinTeX - an AI-powered LaTeX editor with gremlin-themed error handling.

---

## 1. Core Editor Functionality

### 1.1 LaTeX Editor Panel

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Basic text input | Type LaTeX code in editor | Text appears with syntax highlighting | High |
| Line numbers display | Enter multiple lines | Line numbers update correctly | Medium |
| Cursor position | Click different lines | Cursor moves to clicked position | High |
| Large document handling | Paste 1000+ lines | Editor remains responsive | High |
| Special characters | Type `\`, `{`, `}`, `$` | Characters render correctly | High |
| Undo/redo | Make changes, Ctrl+Z/Ctrl+Y | Changes undo/redo properly | High |

### 1.2 PDF Preview Panel

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Compile button | Click compile with valid LaTeX | PDF renders on right panel | Critical |
| Zoom controls | Use zoom in/out buttons | PDF scales appropriately | Medium |
| Page navigation | Navigate multi-page PDF | Pages switch correctly | Medium |
| Preview refresh | Edit code and recompile | Preview updates | High |
| Error state | Compile with syntax errors | Preview shows error state, not crash | High |

---

## 2. Gremlin System

### 2.1 Gremlin Card Display

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Error gremlin | Introduce missing brace | Red gremlin card appears with error icon | Critical |
| Warning gremlin | Add inconsistent notation | Amber warning card appears | High |
| Info gremlin | Add improvable code | Blue info card appears | Medium |
| Fixed gremlin | Apply a fix | Card turns green with checkmark | High |
| Multiple gremlins | Add 5+ errors | All display in scrollable list | High |
| Line range display | Error spans lines 10-15 | Card shows "Lines 10-15" | Medium |

### 2.2 Gremlin Actions

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Apply Fix button | Click "Apply Fix" on gremlin | Code updates, gremlin marked fixed | Critical |
| Dismiss button | Click "Dismiss" on gremlin | Gremlin removed from list | High |
| Explain button | Click "Explain" | AI explanation appears | High |
| Diff view | View fix suggestion | Green/red diff lines show changes | High |
| Fix partial match | Fix when code has changed | Graceful handling, no data loss | Critical |

### 2.3 Gremlin Meter

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Meter initialization | Load page with errors | Meter shows correct count | High |
| Meter decrease | Fix a gremlin | Meter decreases by 1 | High |
| Zero gremlins | Fix all gremlins | Celebration animation plays | Medium |
| Meter max | Have 20+ errors | Meter handles gracefully | Medium |

---

## 3. AI Features (OpenRouter Integration)

### 3.1 API Key Management

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Valid API key | Enter correct key | Key saves, AI features work | Critical |
| Invalid API key | Enter garbage key | Error message, not crash | Critical |
| No API key | Use AI feature without key | Prompt to enter key | High |
| Key persistence | Refresh page | Key still saved (localStorage) | High |
| Key removal | Clear settings | Key removed from storage | Medium |

### 3.2 Error Analysis

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Missing brace analysis | `\begin{equation}` without end | AI explains missing `\end{equation}` | Critical |
| Undefined command | Use `\foobar` | AI identifies unknown command | High |
| Environment mismatch | `\begin{itemize}...\end{enumerate}` | AI catches mismatch | High |
| Empty input | Analyze empty document | Handles gracefully | Medium |
| Network failure | Disconnect and analyze | Shows error, doesn't freeze | Critical |
| Timeout | Slow API response | Shows loading, then timeout message | High |

### 3.3 Math Sanity Check

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Inconsistent notation | Mix `\mathbf` and `\textbf` | AI flags inconsistency | High |
| Missing units | Equation without units | Suggestion to add units | Medium |
| Complex simplification | Overly complex expression | Simpler form suggested | Medium |
| Valid math | Correct notation | No false positives | High |

### 3.4 Structure Helper

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Rough notes | Enter bullet points | Structured sections generated | High |
| Empty input | No content | Graceful handling | Medium |
| Partial structure | Some sections exist | Only missing sections added | Medium |

### 3.5 Citation Helper

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| DOI input | Enter valid DOI | BibTeX entry generated | High |
| Title search | Enter paper title | BibTeX entry generated | High |
| Invalid DOI | Enter garbage DOI | Error message, not crash | High |
| Insert citation | Add to document | `\cite{key}` inserted correctly | High |
| Missing bibliography | Cite without `\bibliography` | Warning shown | Medium |

---

## 4. One-Click Spells

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Fix Braces | Click with unbalanced `{}` | Braces balanced | High |
| Fix Environment | Click with unclosed env | Environment closed | High |
| Normalize Refs | `\ref {foo}` present | Normalized to `\ref{foo}` | Medium |
| Clean Table | Messy table formatting | Table cleaned up | Medium |
| Improve Clarity | Select verbose text | Clearer version suggested | Medium |
| No selection | Click spell with nothing selected | Uses entire document | Medium |
| Empty document | Click spell on empty doc | No crash, no changes | Medium |

---

## 5. Paper Skins

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| IEEE template | Select IEEE skin | IEEE format loads | High |
| ACM template | Select ACM skin | ACM format loads | High |
| Homework template | Select Homework | Homework format loads | Medium |
| Resume template | Select Resume | Resume format loads | Medium |
| Poster template | Select Poster | Poster format loads | Medium |
| Blank template | Select Blank | Minimal template loads | Medium |
| Preserve content | Switch skins with content | Prompt to confirm/merge | High |
| Template preview | Hover over skin | Thumbnail preview shown | Low |

---

## 6. Edge Cases & Security

### 6.1 Input Validation

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| XSS in LaTeX | `<script>alert(1)</script>` | Script not executed | Critical |
| Huge file paste | Paste 1MB text | Performance degrades gracefully | High |
| Binary paste | Paste binary data | Handled safely | Medium |
| Unicode characters | Use emoji, Chinese, etc. | Displays correctly | Medium |
| Null bytes | Include `\x00` in input | No crash | High |

### 6.2 API Security

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| API key in requests | Check network tab | Key sent only to OpenRouter | Critical |
| Key exposure | View page source | Key not in HTML | Critical |
| Rate limiting | Spam AI requests | Client-side throttling works | High |

### 6.3 State Management

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Refresh during compile | F5 while compiling | State recovers correctly | High |
| Multiple tabs | Open in 2 tabs | No conflicts | Medium |
| LocalStorage full | Fill localStorage | Graceful error handling | Low |
| Browser back/forward | Navigate history | State preserved or reset cleanly | Medium |

---

## 7. Responsive Design

| Test Case | Viewport | Expected Result | Priority |
|-----------|----------|-----------------|----------|
| Desktop layout | 1920x1080 | Side-by-side panels | High |
| Tablet layout | 768x1024 | Tabbed view works | Medium |
| Mobile layout | 375x667 | Single panel with tabs | Medium |
| Panel resize | Drag divider | Smooth resizing | Medium |
| Very narrow | 320px width | No horizontal overflow | Medium |
| Very wide | 3840px width | Layout remains usable | Low |

---

## 8. Accessibility

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| Keyboard navigation | Tab through UI | All elements reachable | High |
| Screen reader | Use with NVDA/VoiceOver | Labels read correctly | High |
| Focus indicators | Tab through buttons | Visible focus rings | High |
| Color contrast | Check with contrast tool | WCAG AA compliant | High |
| Reduced motion | Enable prefers-reduced-motion | Animations disabled | Medium |
| Zoom 200% | Browser zoom to 200% | Layout remains usable | Medium |

---

## 9. Performance

| Test Case | Metric | Target | Priority |
|-----------|--------|--------|----------|
| Initial load | Time to interactive | < 3s | High |
| Typing latency | Keypress to render | < 50ms | Critical |
| Compile time | Click to PDF | < 10s (network dependent) | High |
| AI response | Request to display | < 5s (API dependent) | High |
| Memory usage | With 1000 line doc | < 200MB | Medium |
| Scroll performance | Scroll long doc | 60fps | Medium |

---

## 10. Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | Must work |
| Firefox | Latest | Must work |
| Safari | Latest | Must work |
| Edge | Latest | Must work |
| Chrome Mobile | Latest | Should work |
| Safari iOS | Latest | Should work |

---

## Bug Severity Definitions

- **Critical**: App crashes, data loss, security issue
- **High**: Feature broken, significant UX problem
- **Medium**: Feature partially works, workaround exists
- **Low**: Cosmetic issue, minor inconvenience

---

## Test Environment

- Node.js version: Check package.json engines
- Browser: Latest Chrome (primary), Firefox, Safari
- Screen sizes: 1920x1080, 1366x768, 768x1024, 375x667
- API: OpenRouter with test key (rate limited)

---

## Notes for Testers

1. **Gremlin naming is fun!** When logging bugs, feel free to call them "Angry Gremlin" for errors, "Mischief Gremlin" for warnings, etc.

2. **Test the flow, not just features**: Try writing a real homework assignment or paper - does the experience feel smooth?

3. **Break things creatively**: What happens if you paste a PDF into the editor? What if you type faster than the AI can respond?

4. **Watch the meter**: The gremlin meter should be your constant companion. Does it feel satisfying when it goes down?

5. **API keys are sensitive**: Never commit real API keys. Use a test key with rate limits for testing.
