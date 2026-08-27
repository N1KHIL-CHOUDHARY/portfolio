import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Star, GitFork, Cpu, AlertCircle, Sparkles, Code2 } from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import { getPortfolioProjectBySlug, getPortfolioProjects } from '@/lib/db'
import BlueprintLayout from '@/components/BlueprintLayout'
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
    <BlueprintLayout>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-mono text-sm">
        <Link className="hover:underline flex items-center gap-1" href="/projects">
          <span>&larr;</span>
        </Link>
        <h1 className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
          <span className="link--elara">{project.title}</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-4 font-mono">
        {project.subtitle || project.description}
      </p>

      {/* Action Links & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          {project.role && (
            <div>
              <span className="text-neutral-400 dark:text-neutral-500">Role:</span> {project.role}
            </div>
          )}
          {project.timeline && (
            <div>
              <span className="text-neutral-400 dark:text-neutral-500">Timeline:</span> {project.timeline}
            </div>
          )}
          {project.stars && (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{project.stars} stars</span>
            </div>
          )}
          {project.forks && (
            <div className="flex items-center gap-1 text-neutral-500">
              <GitFork className="w-3.5 h-3.5" />
              <span>{project.forks} forks</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              <span>Live App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* DASHED DIVIDER */}
      <div className="w-full h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-4" />

      {/* Core Problem */}
      {project.coreProblem && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-neutral-500" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Core Problem Solved
              </h2>
            </div>
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
              {project.coreProblem}
            </div>
          </section>
          <div className="w-full h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Architecture */}
      {project.architecture && project.architecture.length > 0 && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neutral-500" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Technical Architecture Breakdown
              </h2>
            </div>
            <div className="space-y-2.5">
              {project.architecture.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30"
                >
                  <span className="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500 shrink-0">
                    0{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <div className="w-full h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-500" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                System Highlights &amp; Key Features
              </h2>
            </div>
            <ul className="space-y-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
              {project.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1.5 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
          <div className="w-full h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Code Snippet */}
      {project.codeSnippet && project.codeSnippet.code && (
        <>
          <section className="space-y-3 my-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-neutral-500" />
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Code &amp; Implementation Highlight
                </h2>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                {project.codeSnippet.filename}
              </span>
            </div>

            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 p-4 font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre">{project.codeSnippet.code}</pre>
            </div>
          </section>
          <div className="w-full h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
        </>
      )}

      {/* Technologies */}
      {project.tags && project.tags.length > 0 && (
        <section className="space-y-3 my-6">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Technologies &amp; Frameworks
          </h2>
          <TechStackBadges skills={project.tags.map((t) => ({ name: t }))} />
        </section>
      )}
    </BlueprintLayout>
  )
}
