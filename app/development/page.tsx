import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Terminal,
  Code2,
  Cpu,
  FileCode,
  Laptop,
  FolderTree,
  Database,
  Send,
  Zap,
} from 'lucide-react'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { getPortfolioDevelopment } from '@/lib/db'
import { DevelopmentData } from '@/lib/data'

export const metadata = {
  title: 'Development Setup — Nikhil',
  description: 'IDE configuration, terminal environment, editor themes, and developer workflow tools.',
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'Code Editor': Code2,
  'Terminal': Terminal,
  'Operating System': Laptop,
  'Editor Fonts': Cpu,
  'Shell & Prompt': Zap,
  'Productivity': FolderTree,
  'DevOps & Containers': Cpu,
  'Database GUI': Database,
  'API Client': Send,
}

export default async function DevelopmentPage() {
  const tools: DevelopmentData[] = await getPortfolioDevelopment()

  return (
    <BlueprintLayout>
      {/* Top Navigation & Header Structure */}
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-mono text-sm">
        <Link
          href="/"
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <h1 className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
          <span className="link--elara">Development</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-6 font-mono">
        IDE configuration, GPU-accelerated terminal, Unix environment, editor fonts, and daily engineering tools.
      </p>

      {/* DASHED DIVIDER */}
      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />

      {/* List of all development tools & setup items */}
      {tools.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 space-y-2">
          <Terminal className="w-6 h-6 mx-auto text-neutral-400 dark:text-neutral-600" />
          <h2 className="text-sm font-semibold font-mono text-neutral-900 dark:text-neutral-100">
            No development setups published yet
          </h2>
          <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Tools and configurations will appear here once added in the management dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-4 my-6">
          {tools.map((item) => {
            const Icon = CATEGORY_ICON_MAP[item.category] || Terminal

            return (
              <Link
                key={item.slug || item.title}
                href={item.link || `/development/${item.slug}`}
                className="block group relative p-4 sm:p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Category badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300/60 dark:border-neutral-700/60">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-mono group-hover:underline underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description / Markdown */}
                  {item.description && (
                    <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans pt-0.5">
                      <MarkdownRenderer content={item.description} />
                    </div>
                  )}

                  {/* Specs Breakdown */}
                  {item.specs && item.specs.length > 0 && (
                    <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-950/40 overflow-hidden text-xs">
                      {item.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 gap-1 font-mono"
                        >
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {spec.label}
                          </span>
                          <span className="text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Config Snippet */}
                  {item.configSnippet && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{item.configSnippet.filename}</span>
                        </div>
                      </div>
                      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 p-3 font-mono text-[11px] sm:text-xs overflow-x-auto">
                        <pre className="whitespace-pre">{item.configSnippet.code}</pre>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300/70 dark:border-neutral-700 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </BlueprintLayout>
  )
}
