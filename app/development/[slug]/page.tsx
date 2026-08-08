import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Wrench, Terminal, Cpu, CheckCircle2, FileCode, BookOpen } from 'lucide-react'
import { getPortfolioDevelopment, getPortfolioDevelopmentBySlug } from '@/lib/db'
import PageShell from '@/components/PageShell'
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
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <div>
          <Link
            href="/development"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to development setups</span>
          </Link>
        </div>

        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            /development/{item.slug}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
            {item.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed pt-0.5">
            {item.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-200/60 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium">
              {item.category}
            </span>
          </div>
        </div>

        {/* Markdown Guide / Documentation if available */}
        {(item as any).content && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
                Guide & Documentation (.md)
              </h2>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-xs">
              <MarkdownRenderer content={(item as any).content} />
            </div>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              Why I Use It & Rationale
            </h2>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
            <MarkdownRenderer content={item.whyIUseIt} />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              Specification Breakdown
            </h2>
          </div>

          <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 overflow-hidden">
            {item.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-1"
              >
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium">
                  {spec.label}
                </span>
                <span className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {item.configSnippet && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-zinc-500" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                  Configuration Details
                </h2>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                {item.configSnippet.filename}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 sm:p-5 font-mono text-xs overflow-x-auto shadow-md">
              <pre className="whitespace-pre">{item.configSnippet.code}</pre>
            </div>
          </section>
        )}

        {item.links && item.links.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              Relevant Resources & Links
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {item.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Associated Tags
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
