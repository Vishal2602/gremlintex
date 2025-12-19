# GremlinTeX Design System

## Design Philosophy

GremlinTeX balances whimsy with productivity. The interface should feel like a cozy workshop where you and your AI assistant wrangle mischievous gremlins together. Dark, focused, with pops of personality that never distract from the real work: writing.

## Theme Selection

**DaisyUI Theme: `halloween`** (customized)

The halloween theme provides a perfect dark base with orange/amber accents that naturally evoke our gremlin aesthetic. We'll customize it to add more green tones for success states and softer backgrounds for long writing sessions.

## Color Palette

### Core Colors

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Midnight | `#1a1a2e` | Main editor background |
| Surface | Dark Purple | `#16213e` | Panels, cards, sidebars |
| Surface Elevated | Plum | `#1f2940` | Modals, dropdowns, hover states |
| Primary | Amber | `#f59e0b` | Primary actions, gremlin meter |
| Secondary | Violet | `#8b5cf6` | AI assistant elements |
| Accent | Emerald | `#10b981` | Success, fixed gremlins |

### Gremlin Severity Colors

| Severity | Color | Hex | Gremlin Type |
|----------|-------|-----|--------------|
| Error | Coral Red | `#ef4444` | Angry gremlins (compile blockers) |
| Warning | Amber | `#f59e0b` | Mischief gremlins (potential issues) |
| Info | Sky Blue | `#0ea5e9` | Helper gremlins (suggestions) |
| Fixed | Emerald | `#10b981` | Tamed gremlins (resolved) |

### Text Colors

| Role | Hex | Usage |
|------|-----|-------|
| Primary Text | `#f8fafc` | Main content, headings |
| Secondary Text | `#94a3b8` | Descriptions, labels |
| Muted Text | `#64748b` | Placeholders, disabled |
| Code Text | `#e2e8f0` | Editor text, code blocks |

## Typography

### Font Stack

- **Editor**: `'JetBrains Mono', 'Fira Code', 'Monaco', monospace` - For LaTeX editing
- **UI**: `'Inter', 'SF Pro Display', system-ui, sans-serif` - For interface elements
- **Gremlin Names**: `'Fredoka One', 'Comic Neue', cursive` - For playful gremlin labels

### Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 24px | 700 | 1.2 |
| H2 | 20px | 600 | 1.3 |
| H3 | 16px | 600 | 1.4 |
| Body | 14px | 400 | 1.6 |
| Small | 12px | 400 | 1.5 |
| Code | 13px | 400 | 1.7 |

## Component Design

### Editor Panel (Left Side)

- Full-height panel with subtle border-right
- Line numbers in muted text
- Syntax highlighting optimized for LaTeX
- Error lines get a subtle red left-border glow
- Current line highlighted with surface-elevated color

### PDF Preview Panel (Right Side)

- Clean white background (it's a PDF, after all)
- Subtle paper shadow for depth
- Zoom controls in floating pill
- Page navigation at bottom

### Gremlin Cards

```
+-------------------------------------+
| [SEVERITY BADGE]       Lines 42-45 |
|                                     |
| Missing closing brace in equation   |
| environment on line 43.             |
|                                     |
| +----------------------------------+|
| | - \begin{equation}               ||
| | + \begin{equation}               ||
| |     E = mc^2                     ||
| | + }                              ||
| +----------------------------------+|
|                                     |
| [Apply Fix]  [Ignore]  [Explain]   |
+-------------------------------------+
```

- Rounded corners (12px)
- Left border accent matches severity
- Diff view uses green/red highlights
- Buttons are pill-shaped, primary action emphasized

### Gremlin Meter

```
Gremlin Meter
[========--------] 3 gremlins remaining

[x] [x] [x] [v] [v] [v] [v]
```

- Horizontal progress bar
- Animated fill that bounces slightly
- Small gremlin icons show individual issues
- Celebrate animation when reaching 0

### One-Click Spells (Quick Actions)

- Horizontal scrollable row of pill buttons
- Each has an icon + short label
- Subtle glow on hover
- Icons for: Fix braces, Fix environment, Normalize refs, Clean table, Improve clarity

### Paper Skins Selector

- Grid of template cards (2x3)
- Each shows mini preview thumbnail
- Selected state has primary border
- Labels: IEEE, ACM, Homework, Resume, Poster, Blank

## Spacing System

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps, icon padding |
| sm | 8px | Component internal spacing |
| md | 16px | Standard gaps |
| lg | 24px | Section spacing |
| xl | 32px | Major section breaks |
| 2xl | 48px | Page-level spacing |

## Iconography

Using **Lucide Icons** for consistency:

- `AlertTriangle` - Warnings
- `XCircle` - Errors
- `Info` - Info messages
- `CheckCircle` - Success/fixed
- `Wand2` - AI actions/spells
- `FileText` - Document actions
- `Book` - Citations
- `Layout` - Structure
- `Sparkles` - Magic/AI features

## Motion & Animation

### Principles

- Quick and snappy (150-200ms)
- Ease-out for entrances
- Ease-in for exits
- Playful bounce for gremlin appearances

### Key Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Gremlin card appear | Slide up + fade | 200ms |
| Gremlin fixed | Pop + confetti | 300ms |
| Button hover | Scale 1.02 | 100ms |
| Panel resize | Smooth drag | real-time |
| Meter fill | Elastic ease | 400ms |

## Responsive Behavior

### Desktop (1200px+)

- Side-by-side editor and preview
- Gremlin panel as right sidebar
- Full toolbar visible

### Tablet (768px - 1199px)

- Tabbed view: Editor | Preview | Gremlins
- Collapsible toolbar
- Floating gremlin counter

### Mobile (< 768px)

- Single panel with tab switching
- Bottom sheet for gremlin cards
- Simplified toolbar in header

## Accessibility

- All colors meet WCAG AA contrast (4.5:1 minimum)
- Focus rings on all interactive elements
- Keyboard navigation for all actions
- Screen reader labels for gremlin states
- Reduced motion option respects prefers-reduced-motion

## Dark Mode Notes

This is a dark-first design. If we add light mode later:
- Invert backgrounds to soft whites/grays
- Keep gremlin colors consistent for recognition
- Adjust shadows to be more prominent
