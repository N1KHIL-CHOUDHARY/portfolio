'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

const WORKS = [
  {
    id: '01',
    title: 'Record Generator',
    description: 'A Web App that generates quick PDF and DOCX for student records with automated formatting.',
    tech: ['React', 'Tailwind', 'LiveKit'],
    year: '2025',
    url: 'https://recordgenerator.vercel.app/',
    span: 'md:col-span-2 lg:col-span-2',
    status: 'Ready',
  },
  //have satus coming sonn to have that feature
]

export default function ProjectsWorksSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> | null }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="mb-16 md:mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6"
        >
          Archive
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
        >
          More experiments &amp; <br className="hidden md:block" />
          technical explorations.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORKS.map((work, i) => {
          const isHovered = hoveredIndex === i
          const isComingSoon = work.status === 'Coming Soon'

          return (
            <motion.a
              key={work.id}
              href={work.url}
              target={isComingSoon ? undefined : "_blank"}
              rel={isComingSoon ? undefined : "noopener noreferrer"}
              onClick={(e) => isComingSoon && e.preventDefault()}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative flex flex-col justify-between p-8 md:p-10 rounded-3xl border border-neutral-200/60 dark:border-white/[0.08] bg-white dark:bg-[#121212] overflow-hidden transition-transform duration-500 min-h-[320px] ${work.span} ${isComingSoon ? 'cursor-default' : 'hover:-translate-y-1'}`}
                          >
                <AnimatePresence>
                {isComingSoon && isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-[2px]"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 10 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="px-6 py-3 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#151515] text-xs font-mono uppercase tracking-widest text-neutral-900 dark:text-white shadow-xl"
                    >
                      {work.status}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between mb-12">
                <span className="text-sm font-mono text-neutral-400">
                  {work.id}
                </span>
                <div className={`p-2.5 rounded-full border border-neutral-200 dark:border-white/[0.1] text-neutral-400 transition-all duration-300 shadow-sm ${isComingSoon ? 'opacity-50' : 'group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-900'}`}>
                  <ArrowUpRight size={16} strokeWidth={2} />
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {work.title}
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8 max-w-sm">
                  {work.description}
                </p>
                
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-neutral-100 dark:border-white/[0.05]">
                  <div className="flex flex-wrap gap-2">
                    {work.tech.map((t) => (
                      <span 
                        key={t} 
                        className="text-[11px] px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/5 font-mono text-neutral-500 dark:text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {work.year}
                  </span>
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}