const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function callAI(apiKey, messages, options = {}) {
  if (!apiKey) {
    throw new Error('OpenRouter API key is required')
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'GremlinTeX'
    },
    body: JSON.stringify({
      model: options.model || 'anthropic/claude-3.5-sonnet',
      messages,
      max_tokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.3,
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export async function explainError(apiKey, error, latexContext) {
  const messages = [
    {
      role: 'system',
      content: `You are a friendly LaTeX expert helping users fix errors. Explain the error in plain English (like explaining to a friend who knows some LaTeX but isn't an expert). Be concise but helpful. Always suggest a specific fix.

Format your response as JSON:
{
  "explanation": "What went wrong in plain English",
  "fix": "The corrected LaTeX code snippet",
  "lineStart": number,
  "lineEnd": number
}`
    },
    {
      role: 'user',
      content: `LaTeX Error: ${error.message}
Line ${error.line}: ${error.lineContent || 'N/A'}

Context around the error:
\`\`\`latex
${latexContext}
\`\`\`

Explain this error and provide a fix.`
    }
  ]

  const response = await callAI(apiKey, messages)
  try {
    return JSON.parse(response)
  } catch {
    return { explanation: response, fix: null }
  }
}

export async function checkMathSanity(apiKey, latex) {
  const messages = [
    {
      role: 'system',
      content: `You are a math notation expert. Review the LaTeX document for:
1. Inconsistent notation (e.g., using both x and X for the same variable)
2. Missing assumptions or definitions
3. Unit mistakes in physics/engineering contexts
4. Opportunities for cleaner equations

Return JSON array of suggestions:
[{
  "type": "notation" | "assumption" | "units" | "clarity",
  "severity": "info" | "warning",
  "message": "What's the issue",
  "suggestion": "How to improve it",
  "lineStart": number,
  "lineEnd": number
}]

Return empty array [] if no issues found.`
    },
    {
      role: 'user',
      content: `Review this LaTeX document:\n\n${latex}`
    }
  ]

  const response = await callAI(apiKey, messages)
  try {
    return JSON.parse(response)
  } catch {
    return []
  }
}

export async function suggestStructure(apiKey, notes) {
  const messages = [
    {
      role: 'system',
      content: `You are a technical writing expert. Convert rough notes into a well-structured LaTeX document with proper sections. Use these standard sections where appropriate:
- Abstract
- Introduction
- Background/Related Work
- Methodology/Approach
- Results/Evaluation
- Discussion
- Conclusion

Return the complete LaTeX document ready to compile.`
    },
    {
      role: 'user',
      content: `Convert these rough notes into a structured LaTeX document:\n\n${notes}`
    }
  ]

  return await callAI(apiKey, messages, { maxTokens: 4096 })
}

export async function generateBibTeX(apiKey, reference) {
  const messages = [
    {
      role: 'system',
      content: `You are a citation expert. Given a DOI, paper title, or URL, generate a proper BibTeX entry.

Return JSON:
{
  "bibtex": "The complete BibTeX entry",
  "citeKey": "The citation key to use (e.g., author2023title)",
  "citeCommand": "\\cite{citeKey}"
}

If you can't find the reference, return:
{
  "error": "Could not find reference information"
}`
    },
    {
      role: 'user',
      content: `Generate a BibTeX entry for: ${reference}`
    }
  ]

  const response = await callAI(apiKey, messages)
  try {
    return JSON.parse(response)
  } catch {
    return { error: 'Failed to parse response' }
  }
}

export async function applyQuickSpell(apiKey, latex, spellType) {
  const spellPrompts = {
    'fix-braces': 'Fix any mismatched or missing braces in this LaTeX. Return ONLY the corrected LaTeX code, nothing else.',
    'fix-environment': 'Fix any mismatched or unclosed environments (\\begin/\\end pairs). Return ONLY the corrected LaTeX code, nothing else.',
    'normalize-refs': 'Normalize all references to use consistent formatting (\\ref, \\eqref, \\cite). Return ONLY the corrected LaTeX code, nothing else.',
    'clean-table': 'Clean up and properly format any tables in this LaTeX. Fix alignment, spacing, and structure. Return ONLY the corrected LaTeX code, nothing else.',
    'improve-clarity': 'Improve the clarity of the text content while preserving all LaTeX structure and math. Fix awkward phrasing, improve flow. Return ONLY the corrected LaTeX code, nothing else.',
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a LaTeX expert. Apply the requested fix and return ONLY the corrected LaTeX code. No explanations, no markdown code blocks, just the raw LaTeX.'
    },
    {
      role: 'user',
      content: `${spellPrompts[spellType]}\n\n${latex}`
    }
  ]

  return await callAI(apiKey, messages, { maxTokens: 8192 })
}

export async function checkCitations(apiKey, latex) {
  const messages = [
    {
      role: 'system',
      content: `Analyze this LaTeX document for citation issues:
1. \\cite{} commands that reference undefined bibliography entries
2. Bibliography entries that are never cited
3. Potential missing citations (statements that should have citations)

Return JSON:
{
  "undefinedCites": ["list of cite keys used but not defined"],
  "unusedEntries": ["list of bib entries never cited"],
  "suggestedCitations": [{"text": "quoted text", "reason": "why it needs citation", "line": number}]
}`
    },
    {
      role: 'user',
      content: latex
    }
  ]

  const response = await callAI(apiKey, messages)
  try {
    return JSON.parse(response)
  } catch {
    return { undefinedCites: [], unusedEntries: [], suggestedCitations: [] }
  }
}
