'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight, Github as LucideGithub } from 'lucide-react'
import {
  React as ReactIcon,
  Nextjs,
  TailwindCSS,
  Motion,
  Nodejs,
  Expressjs,
  MongoDB,
  Supabase,
  Postman,
  Git,
  GitHub,
  Cloudinary,
  Vercel,
  Render, TypeScript, Python, LangChain, OpenAI
} from './icons'

const iconMap: Record<string, React.ElementType> = {
  'React': ReactIcon,
  'Next.js': Nextjs,
  'Tailwind CSS': TailwindCSS,
  'Framer Motion': Motion,
  'Node.js': Nodejs,
  'Express': Expressjs,
  'MongoDB': MongoDB,
  'Supabase': Supabase,
  'REST APIs': Postman,
  'Git': Git,
  'GitHub': GitHub,
  'Cloudinary': Cloudinary,
  'Vercel': Vercel,
  'Render': Render,
  'TypeScript': TypeScript,
  'Python': Python,
  'LangChain': LangChain,
  'OpenAI': OpenAI,
}

const PROJECTS = [
  {
    id: '01',
    title: 'Pawn Management System',
    description: 'A comprehensive full-stack architecture for inventory and ledger management.',
    tech: ['React', 'Express', 'MongoDB'],
    year: '2025',
    live: 'https://pawnmanager.vercel.app/',
    github: 'https://github.com/N1KHIL-CHOUDHARY/pawn_manager',
  },
  {
    id: '02',
    title: 'OceanSide',
    description: 'Project-based deployment focused on high-performance financial tooling.',
    tech: ['React', 'Node.js', 'Express'],
    year: '2026',
    live: 'https://ocean-side-sigma.vercel.app/',
    github: 'https://github.com/N1KHIL-CHOUDHARY/oceanside',
  },
  {
    id: '03',
    title: 'Gen AI Legal Demystifier',
    description: 'Hackathon-winning application parsing complex legal documents into plain language.',
    tech: ['Python', 'LangChain', 'OpenAI'],
    year: '2026',
    github: 'https://github.com',
    status: 'Coming Soon',
  },
]

export default function ProjectsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-48">
      <div className="mb-20 md:mb-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6"
        >
          Selected Work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-neutral-900 dark:text-white leading-[1.1]"
        >
          Proof of concept.
        </motion.p>
      </div>

      <div className="border-t border-neutral-200 dark:border-white/[0.1] flex flex-col">
        {PROJECTS.map((project, index) => {
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null
          const isComingSoon = project.status === 'Coming Soon'

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-12 md:py-16 border-b border-neutral-200 dark:border-white/[0.1] transition-opacity duration-500 overflow-hidden ${
                isAnyHovered && !isHovered ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <AnimatePresence>
                {isComingSoon && isHovered && (
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/60"
                  >
                    <motion.span
                      initial={{ y: 10, scale: 0.95 }}
                      animate={{ y: 0, scale: 1 }}
                      exit={{ y: 10, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="text-4xl md:text-6xl font-bold tracking-tighter text-white"
                    >
                      Coming Soon
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-start md:items-center gap-6 md:gap-12 w-full lg:w-1/2 relative z-10">
                <span className="text-sm font-mono text-neutral-400 mt-1 md:mt-0">
                  {project.id}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-2">
                    <motion.h3 
                      animate={{ x: isHovered && !isComingSoon ? 10 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-3xl md:text-5xl font-semibold text-neutral-900 dark:text-white tracking-tight"
                    >
                      {project.title}
                    </motion.h3>
                   
                  </div>
                  <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 max-w-md">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row lg:items-center justify-between w-full lg:w-1/2 pl-12 md:pl-20 lg:pl-0 gap-6 lg:gap-12 relative z-10">
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((t) => {
                    const Icon = iconMap[t]
                    
                    return (
                      <span 
                        key={t} 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-neutral-200 dark:border-white/[0.1] rounded-full text-neutral-600 dark:text-neutral-300 group-hover:border-neutral-400 dark:group-hover:border-white/[0.3] bg-white dark:bg-[#151515] transition-colors duration-300"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 object-contain" />}
                        {t}
                      </span>
                    )
                  })}
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm font-mono text-neutral-400 hidden md:block">
                    {project.year}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-neutral-100 dark:bg-[#151515] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:scale-110 transition-all duration-300"
                      >
                        <LucideGithub size={18} strokeWidth={1.5} />
                      </a>
                    )}
                    {project.live && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-110 transition-all duration-300 flex items-center justify-center"
                      >
                        <ArrowUpRight size={18} strokeWidth={2} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}