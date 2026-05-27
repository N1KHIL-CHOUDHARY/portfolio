'use client'

import { motion } from 'motion/react'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'

const PROJECTS = [
  {
    id: 1,
    title: 'Aptus Notebook',
    description: 'A Notion-like notebook for developers. Write, organize and share knowledge with markdown, code blocks and more.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70',
    live: 'https://aptus.vercel.app',
    github: 'https://github.com/N1KHIL-CHOUDHARY',
    status: 'live',
  },
  {
    id: 2,
    title: 'GitHub Review Extension',
    description: 'Simplify your GitHub code reviews. This extension helps you navigate, filter and take actions faster.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Chrome API'],
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=70',
    live: 'https://chromewebstore.google.com',
    github: 'https://github.com/N1KHIL-CHOUDHARY',
    status: 'live',
  },
  {
    id: 3,
    title: 'Vue Tabs Component',
    description: 'A lightweight and highly customizable tabs component for Vue 3. Built with accessibility and developer experience in mind.',
    tech: ['Vue 3', 'TypeScript', 'SCSS', 'Vite'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=70',
    live: 'https://vue-tabs.vercel.app',
    github: 'https://github.com/N1KHIL-CHOUDHARY',
    status: 'live',
  },
  {
    id: 4,
    title: 'React Advanced Chat',
    description: 'A real-time chat component with typing indicators, read receipts, and beautiful UI. Work in progress.',
    tech: ['React', 'TypeScript', 'Socket.io', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=70',
    live: null,
    github: 'https://github.com/N1KHIL-CHOUDHARY',
    status: 'coming-soon',
  },
]

const TECH_TAG_COLORS: Record<string, string> = {
  'Next.js': 'bg-neutral-100 dark:bg-white/6 text-neutral-600 dark:text-neutral-300',
  TypeScript: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'Tailwind CSS': 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  MongoDB: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  React: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400',
  'Chrome API': 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500',
  'Vue 3': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  SCSS: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Vite: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'Socket.io': 'bg-neutral-100 dark:bg-white/6 text-neutral-600 dark:text-neutral-300',
}

export default function OpenSourceProjectsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-12 gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/5">
            <Github size={20} className="text-neutral-600 dark:text-neutral-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Open Source Projects
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Projects I&apos;ve built and shipped to solve real world problems.
            </p>
          </div>
        </div>
        <a
          href="https://github.com/N1KHIL-CHOUDHARY"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 shrink-0"
        >
          View All Projects
          <ArrowUpRight size={14} />
        </a>
      </motion.div>

      <div className="space-y-4">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group flex flex-col sm:flex-row gap-5 p-5 rounded-2xl
              border border-neutral-200/70 dark:border-white/[0.06]
              bg-[#FAFAF9] dark:bg-[#151515]
              hover:border-neutral-300 dark:hover:border-white/10
              hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]
              transition-all duration-300"
          >
            <div className="shrink-0 w-full sm:w-44 h-28 sm:h-32 rounded-xl overflow-hidden bg-neutral-100 dark:bg-white/5">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {project.title}
                </h3>
              </div>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span
                    key={t}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${TECH_TAG_COLORS[t] ?? 'bg-neutral-100 dark:bg-white/6 text-neutral-500'}`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-auto pt-1">
                {project.status === 'live' && project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors duration-200"
                  >
                    Live Demo
                    <ArrowUpRight size={11} />
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-white/5 text-neutral-400 cursor-default">
                    Coming Soon
                  </span>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-white/8 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/15 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/4 transition-all duration-200"
                >
                  <Github size={11} />
                  Source Code
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
