'use client'

import { motion } from 'motion/react'
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
  Render
} from './icons'

const DOMAINS = [
  {
    id: '01',
    title: 'Frontend & UI',
    description: 'Building fluid, interactive, and accessible user interfaces.',
    tools: [
      { name: 'React', Icon: ReactIcon },
      { name: 'Next.js', Icon: Nextjs },
      { name: 'Tailwind CSS', Icon: TailwindCSS },
      { name: 'Framer Motion', Icon: Motion },
    ],
  },
  {
    id: '02',
    title: 'Backend & APIs',
    description: 'Architecting robust, secure, and scalable server-side logic.',
    tools: [
      { name: 'Node.js', Icon: Nodejs },
      { name: 'Express', Icon: Expressjs },
      { name: 'REST APIs', Icon: Postman },
    ],
  },
  {
    id: '03',
    title: 'Database & Data',
    description: 'Designing efficient schemas and managing application state.',
    tools: [
      { name: 'MongoDB', Icon: MongoDB },
      { name: 'Supabase', Icon: Supabase },
    ],
  },
  {
    id: '04',
    title: 'Workflow & Architecture',
    description: 'Maintaining clean codebases and seamless collaborative pipelines.',
    tools: [
      { name: 'Git', Icon: Git },
      { name: 'GitHub', Icon: GitHub },
      { name: 'Cloudinary', Icon: Cloudinary },
      { name: 'Vercel', Icon: Vercel },
      {name: 'Render', Icon: Render},
    ],
  },
]

export default function SkillsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 text-xs font-mono uppercase tracking-[0.28em] text-neutral-400"
            >
              Capabilities
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-sm text-3xl font-medium tracking-tight leading-[1.15] text-neutral-900 md:text-4xl dark:text-white"
            >
              The tools I use to bring ideas to life.
            </motion.h2>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="border-t border-neutral-200 dark:border-white/[0.08]" />

          {DOMAINS.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-8 border-b border-neutral-200 py-10 md:py-14 lg:grid-cols-[220px,1fr] dark:border-white/[0.08]"
            >
              <div>
                <span className="mb-3 block text-sm font-mono text-neutral-400">
                  {domain.id}
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {domain.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                  {domain.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {domain.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="group flex h-12 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/[0.16]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                      <tool.Icon className="h-5 w-5 object-contain transition-transform duration-300 group-hover:scale-110" />
                    </span>

                    <span className="truncate text-sm font-medium leading-none text-neutral-700 transition-colors duration-200 group-hover:text-neutral-950 dark:text-neutral-300 dark:group-hover:text-white">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}