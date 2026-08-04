import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Star, GitFork, Cpu, AlertCircle, Sparkles, Code2 } from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import { getPortfolioProjectBySlug, getPortfolioProjects } from '@/lib/db'
import PageShell from '@/components/PageShell'
import TechStackBadges from '@/components/TechStackBadges'

export async function generateStaticParams() {
  const projects = await getPortfolioProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
  }
}

export default async function ProjectCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>
        </div>

        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            /projects/{project.slug}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
              {project.title}
            </h1>

            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <IconBrandGithub className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
                >
                  <span>Live App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed pt-1">
            {project.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-2">
            <div>
              <span className="text-zinc-400 dark:text-zinc-500">Role:</span> {project.role}
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500">Timeline:</span> {project.timeline}
            </div>
            {project.stars && (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{project.stars} stars</span>
              </div>
            )}
            {project.forks && (
              <div className="flex items-center gap-1 text-zinc-500">
                <GitFork className="w-3.5 h-3.5" />
                <span>{project.forks} forks</span>
              </div>
            )}
          </div>
        </div>

        {project.coreProblem && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                Core Problem Solved
              </h2>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {project.coreProblem}
            </div>
          </section>
        )}

        {project.architecture && project.architecture.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-zinc-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                Technical Architecture Breakdown
              </h2>
            </div>
            <div className="space-y-2.5">
              {project.architecture.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40"
                >
                  <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 shrink-0">
                    0{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.highlights && project.highlights.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                System Highlights & Key Features
              </h2>
            </div>
            <ul className="space-y-2">
              {project.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-2 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.codeSnippet && project.codeSnippet.code && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-zinc-500" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                  Code & Implementation Highlight
                </h2>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                {project.codeSnippet.filename}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 sm:p-5 font-mono text-xs overflow-x-auto shadow-md">
              <pre className="whitespace-pre">{project.codeSnippet.code}</pre>
            </div>
          </section>
        )}

        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Technologies & Frameworks
          </h2>
          <TechStackBadges skills={project.tags.map((t) => ({ name: t }))} />
        </section>
      </main>
    </PageShell>
  )
}
