'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Star } from 'lucide-react'

import TechStackBadges from './TechStackBadges'

interface Project {
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  stars?: number
}

const FEATURED_PROJECTS: Project[] = [
  {
    title: 'Universal App Opener',
    description: 'Converts web URLs into deep links for 40+ mobile apps across iOS and Android with automatic fallback routing.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Mobile DeepLinks'],
    githubUrl: 'https://github.com/mdsaban/universal-app-opener',
    liveUrl: 'https://universalappopener.com',
    stars: 256,
  },
  {
    title: 'Cursor Code Indexer',
    description: 'High-performance vector search indexer designed to index repository AST structures for AI pair programmers.',
    tags: ['TypeScript', 'Node.js', 'Tree-Sitter', 'Vector Index'],
    githubUrl: 'https://github.com',
    stars: 184,
  },
]

export default function ProjectsPreview() {
  return (
    <section id="projects" className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Projects & Work
        </h2>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <span>View all projects</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {FEATURED_PROJECTS.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group relative p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition-all duration-300 ease-out"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    {project.title}
                  </h3>

                  {project.stars && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 dark:text-zinc-500">
                      <Star className="w-3 h-3 text-zinc-400" />
                      {project.stars}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed tracking-tight line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="shrink-0 pt-0.5">
                <a
                  href={project.liveUrl || project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title}`}
                  className="p-1 rounded-lg text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:bg-zinc-200/60 dark:group-hover:bg-zinc-700/60 transition-all duration-200 inline-flex items-center justify-center"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-200/40 dark:border-zinc-800/40">
              <TechStackBadges skills={project.tags.map((t) => ({ name: t }))} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
