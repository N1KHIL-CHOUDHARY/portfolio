'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Star, GitPullRequest } from 'lucide-react'

const CONTRIBUTIONS = [
  {
    id: '01',
    name: 'Universal App Opener',
    description: 'A web app which converts web URLs into deep links for Android and iOS apps. It supports more than 40+ apps and is growing.',
    stars: '256',
    repo: 'mdsaban/universal-app-opener',
    url: 'https://github.com/mdsaban/universal-app-opener/pull/17',
  }
]

export default function ContributionsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 md:py-48">
      <div className="mb-20 md:mb-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6"
        >
          Open Source
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-neutral-900 dark:text-white leading-[1.1]"
        >
Contributions.        </motion.p>
      </div>

      <div className="border-t border-neutral-200 dark:border-white/[0.1] flex flex-col">
        {CONTRIBUTIONS.map((item, index) => {
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null

          return (
            <motion.a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-12 md:py-16 border-b border-neutral-200 dark:border-white/[0.1] transition-opacity duration-500 cursor-pointer ${
                isAnyHovered && !isHovered ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <div className="flex items-start md:items-center gap-6 md:gap-12 w-full lg:w-1/2 relative z-10">
                <span className="text-sm font-mono text-neutral-400 mt-1 md:mt-0">
                  {item.id}
                </span>
                <div className="flex flex-col">
                  <motion.h3 
                    animate={{ x: isHovered ? 10 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-2"
                  >
                    {item.name}
                  </motion.h3>
                  <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 max-w-md">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row lg:items-center justify-between w-full lg:w-1/2 pl-12 md:pl-20 lg:pl-0 gap-6 lg:gap-12 relative z-10">
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-neutral-200 dark:border-white/[0.1] rounded-full text-neutral-600 dark:text-neutral-300 group-hover:border-neutral-400 dark:group-hover:border-white/[0.3] bg-white dark:bg-[#151515] transition-colors duration-300">
                    {item.repo}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-neutral-200 dark:border-white/[0.1] rounded-full text-neutral-600 dark:text-neutral-300 group-hover:border-neutral-400 dark:group-hover:border-white/[0.3] bg-white dark:bg-[#151515] transition-colors duration-300">
                    <Star size={13} className="text-yellow-500" />
                    {item.stars}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-neutral-200 dark:border-white/[0.1] rounded-full text-neutral-600 dark:text-neutral-300 group-hover:border-neutral-400 dark:group-hover:border-white/[0.3] bg-white dark:bg-[#151515] transition-colors duration-300">
                    <GitPullRequest size={13} className="text-green-500" />
                    Merged
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="p-3 rounded-full bg-neutral-100 dark:bg-[#151515] text-neutral-900 dark:text-white group-hover:bg-neutral-900 group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-neutral-900 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                    <ArrowUpRight size={18} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}