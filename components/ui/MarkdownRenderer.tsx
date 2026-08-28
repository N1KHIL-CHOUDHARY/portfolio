'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { ExternalLink, Copy, Check } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = React.useState(false)
  const codeString = String(children).replace(/\n$/, '')

  const onCopy = () => {
    navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isInline = !className && typeof children === 'string' && !children.includes('\n')

  if (isInline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px] border border-zinc-200 dark:border-zinc-700/80" {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="relative group my-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
        <span>code</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 sm:p-4 text-xs font-mono overflow-x-auto leading-relaxed text-zinc-200">
        <code {...props}>{children}</code>
      </pre>
    </div>
  )
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null

  return (
    <div className={`markdown-body space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight pt-4 pb-1 border-b border-zinc-200 dark:border-zinc-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight pt-3 pb-0.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold font-mono text-zinc-900 dark:text-zinc-100 pt-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="leading-relaxed py-0.5">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 pl-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 pl-2">{children}</ol>,
          li: ({ children }) => <li className="text-zinc-700 dark:text-zinc-300">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="p-3 my-2 border-l-2 border-emerald-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-r-lg italic text-zinc-600 dark:text-zinc-400">
              {children}
            </blockquote>
          ),
          code: CodeBlock,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                <span>{children}</span>
                {isExternal && <ExternalLink className="w-3 h-3 shrink-0" />}
              </a>
            )
          },
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-zinc-100 dark:bg-zinc-900">{children}</thead>,
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800/60 font-sans">
              {children}
            </td>
          ),
          hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
