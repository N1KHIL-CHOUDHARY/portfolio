'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
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
        <a href="/projects" className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400 hover:underline">
          View All
        </a>
      </div>

      <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
        {displayProjects.map((project, idx) => (
          <motion.div
            key={project.slug || project.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group block relative py-4 sm:py-5 px-1 hover:bg-zinc-100/40 dark:hover:bg-zinc-900/30 rounded-lg transition-all duration-200"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors duration-200 tracking-tight font-mono">
                    {project.title}
                  </h3>
                  
                  {project.stars && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-400 dark:group-hover:text-zinc-500 transition-colors">
                      <Star className="w-3 h-3 text-zinc-500 fill-zinc-200 dark:fill-zinc-700" />
                      {project.stars}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-500 leading-relaxed tracking-tight font-sans transition-colors duration-200">
                  {project.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

