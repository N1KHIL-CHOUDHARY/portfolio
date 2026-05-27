'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

const WORKS = [
  {
    id: 1,
    title: 'Wise App',
    description: 'E-learning platform for online teaching, live doubts, tests and student progress tracking.',
    tech: ['Next.js', 'Tailwind CSS', 'LiveKit'],
    image: '',
    bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20',
    color: 'text-blue-600 dark:text-blue-400',
    url: 'https://github.com/N1KHIL-CHOUDHARY',
  },

]

export default function ProjectsWorksSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) {
  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1">
          Projects &amp; Works
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          A selection of projects I&apos;ve worked on.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WORKS.map((work, i) => (
          <motion.a
            key={work.id}
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`group relative flex flex-col rounded-2xl overflow-hidden bg-gradient-to-br ${work.bg}
              border border-neutral-200/60 dark:border-white/[0.06]
              hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              hover:border-neutral-300/70 dark:hover:border-white/10
              transition-all duration-300`}
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-bold ${work.color}`}>
                  {work.title}
                </h3>
                <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {work.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {work.tech.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/60 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border border-white/80 dark:border-white/[0.06]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
