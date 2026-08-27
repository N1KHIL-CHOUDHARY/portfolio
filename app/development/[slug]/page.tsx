import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Cpu, CheckCircle2, FileCode, BookOpen } from 'lucide-react'
import { getPortfolioDevelopment, getPortfolioDevelopmentBySlug } from '@/lib/db'
import BlueprintLayout from '@/components/BlueprintLayout'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export async function generateStaticParams() {
  const items = await getPortfolioDevelopment()
  return items.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getPortfolioDevelopmentBySlug(slug)
  if (!item) return { title: 'Setup Item Not Found' }
  return {
    title: `${item.title} — Development & Setup`,
    description: item.subtitle,
  }
}

export default async function DevelopmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getPortfolioDevelopmentBySlug(slug)

  if (!item) {
    notFound()
  }

  return (
    <BlueprintLayout>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-mono text-sm">
        <Link className="hover:underline flex items-center gap-1" href="/development">
          <span>&larr;</span>
        </Link>
        <h1 className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
          <span className="link--elara">{item.title}</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-4 font-mono">
        {item.subtitle}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/60 dark:border-neutral-700/60 font-medium">
          {item.category}
        </span>
      </div>

      {/* DASHED DIVIDER */}
      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />

      {/* Markdown Guide / Documentation if available */}
      {(item as any).content && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Guide &amp; Documentation (.md)
              </h2>
            </div>
            <div className="p-4 sm:p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
              <MarkdownRenderer content={(item as any).content} />
            </div>
          </section>
          <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Why I Use It */}
      {item.whyIUseIt && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-500" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Why I Use It &amp; Rationale
              </h2>
            </div>
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
              <MarkdownRenderer content={item.whyIUseIt} />
            </div>
          </section>
          <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Specifications */}
      {item.specs && item.specs.length > 0 && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neutral-500" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Specification Breakdown
              </h2>
            </div>

            <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-hidden font-mono">
              {item.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 gap-1"
                >
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {spec.label}
                  </span>
                  <span className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Configuration Code */}
      {item.configSnippet && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-neutral-500" />
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Configuration Details
                </h2>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                {item.configSnippet.filename}
              </span>
            </div>

            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 p-4 font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre">{item.configSnippet.code}</pre>
            </div>
          </section>
          <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Links */}
      {item.links && item.links.length > 0 && (
        <>
          <section className="space-y-3 my-6">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Relevant Resources &amp; Links
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {item.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </a>
              ))}
            </div>
          </section>
          <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Associated Tags */}
      {item.tags && item.tags.length > 0 && (
        <section className="space-y-3 my-6">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Associated Tags
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300/70 dark:border-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </BlueprintLayout>
  )
}
