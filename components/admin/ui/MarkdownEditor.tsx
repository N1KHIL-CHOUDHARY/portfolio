'use client'

import React, { useState } from 'react'
import { Bold, Italic, Code, Heading, List, ListOrdered, Link as LinkIcon, Eye, Edit3 } from 'lucide-react'

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write Markdown content here...',
  rows = 12,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
}) {
  const [activeMode, setActiveMode] = useState<'edit' | 'preview' | 'split'>('split')

  const insertSymbol = (before: string, after: string = '') => {
    onChange(`${value}${before}${after}`)
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden font-sans space-y-0 shadow-lg">
      {/* Toolbar */}
      <div className="p-2 border-b border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertSymbol('**', '**')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('*', '*')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('`', '`')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-zinc-800 mx-1" />
          <button
            type="button"
            onClick={() => insertSymbol('\n### ')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Heading 3"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('\n- ')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Unordered List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('\n1. ')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Ordered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('[Link Title](', ')')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Hyperlink"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveMode('edit')}
            className={`px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeMode === 'edit'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('preview')}
            className={`px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeMode === 'preview'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-0 min-h-[220px]">
        {activeMode === 'edit' || activeMode === 'split' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-4 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 font-mono text-xs focus:outline-none resize-y leading-relaxed border-none"
          />
        ) : null}

        {activeMode === 'preview' && (
          <div className="p-5 font-sans text-xs text-zinc-300 leading-relaxed space-y-3 min-h-[220px]">
            {value ? (
              <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap font-mono bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                {value}
              </div>
            ) : (
              <div className="text-zinc-600 font-mono italic">Nothing to preview yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
