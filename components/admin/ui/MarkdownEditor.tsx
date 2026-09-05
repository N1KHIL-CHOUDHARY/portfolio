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
  const [activeMode, setActiveMode] = useState<'edit' | 'preview'>('edit')

  const insertSymbol = (before: string, after: string = '') => {
    onChange(`${value}${before}${after}`)
  }

  return (
    <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden font-mono text-xs">
      {/* Toolbar */}
      <div className="p-2 border-b border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertSymbol('**', '**')}
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('*', '*')}
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('`', '`')}
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-800 mx-1" />
          <button
            type="button"
            onClick={() => insertSymbol('\n### ')}
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Heading 3"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('\n- ')}
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Unordered List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('\n1. ')}
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Ordered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSymbol('[Link Title](', ')')}
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Hyperlink"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveMode('edit')}
            className={`px-2 py-1 rounded transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
              activeMode === 'edit'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('preview')}
            className={`px-2 py-1 rounded transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
              activeMode === 'preview'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="min-h-[220px]">
        {activeMode === 'edit' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-4 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 font-mono text-xs focus:outline-none resize-y leading-relaxed border-none"
          />
        ) : (
          <div className="p-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed min-h-[220px]">
            {value ? (
              <div className="prose dark:prose-invert prose-xs max-w-none whitespace-pre-wrap font-mono bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800">
                {value}
              </div>
            ) : (
              <div className="text-neutral-400 dark:text-neutral-600 italic">Nothing to preview yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
