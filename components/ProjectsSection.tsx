'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Star } from 'lucide-react'
import { ProjectData } from '@/lib/data'

import TechStackBadges from './TechStackBadges'

export default function ProjectsSection({ projects }: { projects?: ProjectData[] }) {
  const displayProjects = projects || []

  return (
    <section id="projects" className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
          Projects & Work
        </h2>
        <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
          Featured ({displayProjects.length})
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {displayProjects.map((project, idx) => (
          <motion.div
            key={project.slug || project.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group block relative p-4 sm:p-5 rounded-xl border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 ease-out shadow-2xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-white transition-colors font-mono">
                      {project.title}
                    </h3>
                    
                    {project.stars && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
                        <Star className="w-3 h-3 text-zinc-500 fill-zinc-200 dark:fill-zinc-700" />
                        {project.stars}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-tight font-sans">
                    {project.description}
                  </p>
                </div>

                <div className="shrink-0 pt-0.5">
                  <div className="p-1.5 rounded-lg text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 group-hover:bg-zinc-200/80 dark:group-hover:bg-zinc-700/60 transition-all duration-200 inline-flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-zinc-200 dark:border-zinc-800" onClick={(e) => e.stopPropagation()}>
                <TechStackBadges skills={project.tags.map((t) => ({ name: t }))} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
