'use client'

import React from 'react'
import {
  React as ReactIcon,
  Nextjs,
  TypeScript,
  Nodejs,
  TailwindCSS,
  GitHub,
  Git,
  Python,
  Expressjs,
  MongoDB,
  AmazonWebServices,
  PostgreSQL,
  Docker,
  Redis,
  Upstash,
  Motion,
} from './icons'

export interface TechItem {
  name: string
  icon: React.ReactNode
  href?: string
}

const DEFAULT_STACK: TechItem[] = [
  { name: 'Next.js', icon: <Nextjs className="size-4" /> },
  { name: 'React', icon: <ReactIcon className="size-4 text-[#58C4DC]" /> },
  { name: 'TypeScript', icon: <TypeScript className="size-4" /> },
  { name: 'Tailwind CSS', icon: <TailwindCSS className="size-4" /> },
  { name: 'Node.js', icon: <Nodejs className="size-4" /> },
  { name: 'Python', icon: <Python className="size-4" /> },
  { name: 'Git', icon: <Git className="size-4" /> },
]

interface TechStackBadgesProps {
  items?: TechItem[]
  skills?: Array<{ name: string; icon?: string | null; color?: string | null }> | null
  className?: string
}

const ICON_LOOKUP: Record<string, React.ReactNode> = {
  'next.js': <Nextjs className="size-4" />,
  'nextjs': <Nextjs className="size-4" />,
  'react': <ReactIcon className="size-4 text-[#58C4DC]" />,
  'react.js': <ReactIcon className="size-4 text-[#58C4DC]" />,
  'typescript': <TypeScript className="size-4" />,
  'ts': <TypeScript className="size-4" />,
  'javascript': <TypeScript className="size-4 text-[#F7DF1E]" />,
  'js': <TypeScript className="size-4 text-[#F7DF1E]" />,
  'tailwind css': <TailwindCSS className="size-4" />,
  'tailwind': <TailwindCSS className="size-4" />,
  'node.js': <Nodejs className="size-4" />,
  'nodejs': <Nodejs className="size-4" />,
  'express.js': <Expressjs className="size-4" />,
  'express': <Expressjs className="size-4" />,
  'python': <Python className="size-4" />,
  'git': <Git className="size-4" />,
  'github': <GitHub className="size-4" />,
  'mongodb': <MongoDB className="size-4" />,
  'mongo': <MongoDB className="size-4" />,
  'postgresql': <PostgreSQL className="size-4" />,
  'postgres': <PostgreSQL className="size-4" />,
  'aws': <AmazonWebServices className="size-4" />,
  'amazon web services': <AmazonWebServices className="size-4" />,
  'docker': <Docker className="size-4" />,
  'redis': <Redis className="size-4" />,
  'upstash': <Upstash className="size-4" />,
  'upstash redis': <Upstash className="size-4" />,
  'motion': <Motion className="size-4" />,
  'framer motion': <Motion className="size-4" />,
}

export default function TechStackBadges({
  items: directItems,
  skills,
  className = '',
}: TechStackBadgesProps) {
  const items: TechItem[] = skills && skills.length > 0
    ? skills.map((s) => ({
        name: s.name,
        icon: ICON_LOOKUP[s.name.toLowerCase()] || <span className="text-[10px] font-bold">{s.name[0]}</span>,
      }))
    : directItems || DEFAULT_STACK

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((item) => {
        const Content = (
          <div
            tabIndex={0}
            role={item.href ? 'link' : 'button'}
            aria-label={item.name}
            className="group/badge relative inline-flex items-center px-2 py-1.5 rounded-[6px] border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:border-zinc-400 dark:focus-visible:border-zinc-500 focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white transition-all duration-300 ease-out cursor-pointer select-none shadow-2xs"
          >
            <div className="size-4 shrink-0 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
              {item.icon}
            </div>

            <span className="max-w-32 opacity-100 ml-1.5 sm:max-w-0 sm:opacity-0 sm:ml-0 overflow-hidden whitespace-nowrap sm:group-hover/badge:max-w-32 sm:group-hover/badge:opacity-100 sm:group-hover/badge:ml-1.5 sm:group-focus-visible/badge:max-w-32 sm:group-focus-visible/badge:opacity-100 sm:group-focus-visible/badge:ml-1.5 transition-all duration-300 ease-out text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200">
              {item.name}
            </span>
          </div>
        )

        if (item.href) {
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block outline-none"
            >
              {Content}
            </a>
          )
        }

        return <React.Fragment key={item.name}>{Content}</React.Fragment>
      })}
    </div>
  )
}