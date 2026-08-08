import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Cpu, CheckCircle2, FileCode } from 'lucide-react'
import { getPortfolioDevelopment, getPortfolioDevelopmentBySlug } from '@/lib/db'
import PageShell from '@/components/PageShell'

export async function generateStaticParams() {
  const items = await getPortfolioDevelopment()
  return items.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getPortfolioDevelopmentBySlug(slug)
  if (!item) return { title: 'Item Not Found' }
  return {
    title: `${item.title} — Personal`,
    description: item.subtitle,
  }
}

export default async function PersonalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>
        </div>

        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-bold">
            /personal/{item.slug}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-100 tracking-tight">
            {item.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed pt-0.5">
            {item.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300/70 dark:border-zinc-700 font-medium">
              {item.category}
            </span>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
              Why I Use It & Rationale
            </h2>
          </div>
          <div className="p-4 sm:p-5 rounded-xl border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans shadow-2xs">
            {item.whyIUseIt}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
              Specification Breakdown
            </h2>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-xl border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden shadow-2xs">
            {item.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-1"
              >
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-bold">
                  {spec.label}
                </span>
                <span className="text-xs sm:text-sm text-zinc-950 dark:text-zinc-100 font-medium">
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
                <FileCode className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
                  Configuration Details
                </h2>
              </div>
              <span className="text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                {item.configSnippet.filename}
              </span>
            </div>

            <div className="rounded-xl border border-zinc-300/80 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 sm:p-5 font-mono text-xs overflow-x-auto shadow-md">
              <pre className="whitespace-pre">{item.configSnippet.code}</pre>
            </div>
          </section>
        )}

        {item.links && item.links.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
              Relevant Resources & Links
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {item.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs font-medium"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
            Associated Tags
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/70 dark:border-zinc-700"
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
