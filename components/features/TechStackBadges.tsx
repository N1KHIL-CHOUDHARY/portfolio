  'use client'

  import React from 'react'
  import { cn } from '@/lib/utils'
  import { useHoverSound } from '@/hooks/useHoverSound'
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
    Prisma,
  } from '@/components/icons'

  export interface TechItem {
    name: string
    icon: React.ReactNode
    href?: string
  }

  const DEFAULT_STACK: TechItem[] = [
    { name: 'Next.js', icon: <Nextjs className="size-4" /> },
    { name: 'React', icon: <ReactIcon className="size-4 text-sky-500 dark:text-[#58C4DC]" /> },
    { name: 'TypeScript', icon: <TypeScript className="size-4" /> },
    { name: 'Tailwind CSS', icon: <TailwindCSS className="size-4" /> },
    { name: 'Node.js', icon: <Nodejs className="size-4" /> },
    {
      name: 'Express.js',
      icon: (
        <Expressjs className="size-4 text-amber-500 dark:text-[#F7DF1E] fill-amber-500 dark:fill-[#F7DF1E] [&_path]:fill-amber-500 dark:[&_path]:fill-[#F7DF1E] [&_text]:fill-amber-500 dark:[&_text]:fill-[#F7DF1E]" />
      ),
    },
    { name: 'Python', icon: <Python className="size-4" /> },
    { name: 'Git', icon: <Git className="size-4" /> },
    {
      name: 'GitHub',
      icon: (
        <GitHub className="size-4 text-[#8957e5] dark:text-[#a371f7] fill-[#8957e5] dark:fill-[#a371f7] [&_path]:fill-[#8957e5] dark:[&_path]:fill-[#a371f7] [&_text]:fill-[#8957e5] dark:[&_text]:fill-[#a371f7]" />
      ),
    },
  ]

  interface TechStackBadgesProps {
    items?: TechItem[]
    skills?: Array<{ name: string; icon?: string | null; color?: string | null }> | null
    className?: string
  }

  interface BrandStyle {
    badgeHover: string
    textHover: string
    iconWrapper: string
  }

  const BRAND_STYLES: Record<string, BrandStyle> = {
    github: {
      badgeHover:
        'hover:border-[#8957e5]/50 dark:hover:border-[#a371f7]/50 hover:bg-[#8957e5]/5 dark:hover:bg-[#a371f7]/10 focus-visible:border-[#8957e5] dark:focus-visible:border-[#a371f7] focus-visible:ring-[#8957e5] dark:focus-visible:ring-[#a371f7]',
      textHover: 'group-hover/badge:text-[#8957e5] dark:group-hover/badge:text-[#a371f7]',
      iconWrapper:
        'text-[#8957e5] dark:text-[#a371f7] fill-[#8957e5] dark:fill-[#a371f7] [&_path]:fill-[#8957e5] dark:[&_path]:fill-[#a371f7] [&_text]:fill-[#8957e5] dark:[&_text]:fill-[#a371f7]',
    },
    'git hub': {
      badgeHover:
        'hover:border-[#8957e5]/50 dark:hover:border-[#a371f7]/50 hover:bg-[#8957e5]/5 dark:hover:bg-[#a371f7]/10 focus-visible:border-[#8957e5] dark:focus-visible:border-[#a371f7] focus-visible:ring-[#8957e5] dark:focus-visible:ring-[#a371f7]',
      textHover: 'group-hover/badge:text-[#8957e5] dark:group-hover/badge:text-[#a371f7]',
      iconWrapper:
        'text-[#8957e5] dark:text-[#a371f7] fill-[#8957e5] dark:fill-[#a371f7] [&_path]:fill-[#8957e5] dark:[&_path]:fill-[#a371f7] [&_text]:fill-[#8957e5] dark:[&_text]:fill-[#a371f7]',
    },
    express: {
      badgeHover:
        'hover:border-amber-500/50 dark:hover:border-[#F7DF1E]/40 hover:bg-amber-500/5 dark:hover:bg-[#F7DF1E]/10 focus-visible:border-amber-500 dark:focus-visible:border-[#F7DF1E] focus-visible:ring-amber-500 dark:focus-visible:ring-[#F7DF1E]',
      textHover: 'group-hover/badge:text-amber-600 dark:group-hover/badge:text-[#F7DF1E]',
      iconWrapper:
        'text-amber-500 dark:text-[#F7DF1E] fill-amber-500 dark:fill-[#F7DF1E] [&_path]:fill-amber-500 dark:[&_path]:fill-[#F7DF1E] [&_text]:fill-amber-500 dark:[&_text]:fill-[#F7DF1E]',
    },
    'express.js': {
      badgeHover:
        'hover:border-amber-500/50 dark:hover:border-[#F7DF1E]/40 hover:bg-amber-500/5 dark:hover:bg-[#F7DF1E]/10 focus-visible:border-amber-500 dark:focus-visible:border-[#F7DF1E] focus-visible:ring-amber-500 dark:focus-visible:ring-[#F7DF1E]',
      textHover: 'group-hover/badge:text-amber-600 dark:group-hover/badge:text-[#F7DF1E]',
      iconWrapper:
        'text-amber-500 dark:text-[#F7DF1E] fill-amber-500 dark:fill-[#F7DF1E] [&_path]:fill-amber-500 dark:[&_path]:fill-[#F7DF1E] [&_text]:fill-amber-500 dark:[&_text]:fill-[#F7DF1E]',
    },
    expressjs: {
      badgeHover:
        'hover:border-amber-500/50 dark:hover:border-[#F7DF1E]/40 hover:bg-amber-500/5 dark:hover:bg-[#F7DF1E]/10 focus-visible:border-amber-500 dark:focus-visible:border-[#F7DF1E] focus-visible:ring-amber-500 dark:focus-visible:ring-[#F7DF1E]',
      textHover: 'group-hover/badge:text-amber-600 dark:group-hover/badge:text-[#F7DF1E]',
      iconWrapper:
        'text-amber-500 dark:text-[#F7DF1E] fill-amber-500 dark:fill-[#F7DF1E] [&_path]:fill-amber-500 dark:[&_path]:fill-[#F7DF1E] [&_text]:fill-amber-500 dark:[&_text]:fill-[#F7DF1E]',
    },
    prisma: {
      badgeHover:
        'hover:border-teal-500/50 dark:hover:border-teal-400/50 hover:bg-teal-500/5 dark:hover:bg-teal-400/10 focus-visible:border-teal-500 dark:focus-visible:border-teal-400 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400',
      textHover: 'group-hover/badge:text-teal-600 dark:group-hover/badge:text-teal-400',
      iconWrapper:
        'text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400 [&_path]:fill-teal-600 dark:[&_path]:fill-teal-400',
    },
  }

  const ICON_LOOKUP: Record<string, React.ReactNode> = {
    'next.js': <Nextjs className="size-4" />,
    'nextjs': <Nextjs className="size-4" />,
    'react': <ReactIcon className="size-4 text-sky-500 dark:text-[#58C4DC]" />,
    'react.js': <ReactIcon className="size-4 text-sky-500 dark:text-[#58C4DC]" />,
    'typescript': <TypeScript className="size-4" />,
    'ts': <TypeScript className="size-4" />,
    'javascript': <TypeScript className="size-4 text-amber-500 dark:text-[#F7DF1E]" />,
    'js': <TypeScript className="size-4 text-amber-500 dark:text-[#F7DF1E]" />,
    'tailwind css': <TailwindCSS className="size-4" />,
    'tailwind': <TailwindCSS className="size-4" />,
    'node.js': <Nodejs className="size-4" />,
    'nodejs': <Nodejs className="size-4" />,
    'express.js': (
      <Expressjs className="size-4 text-amber-500 dark:text-[#F7DF1E] fill-amber-500 dark:fill-[#F7DF1E] [&_path]:fill-amber-500 dark:[&_path]:fill-[#F7DF1E] [&_text]:fill-amber-500 dark:[&_text]:fill-[#F7DF1E]" />
    ),
    'express': (
      <Expressjs className="size-4 text-amber-500 dark:text-[#F7DF1E] fill-amber-500 dark:fill-[#F7DF1E] [&_path]:fill-amber-500 dark:[&_path]:fill-[#F7DF1E] [&_text]:fill-amber-500 dark:[&_text]:fill-[#F7DF1E]" />
    ),
    'expressjs': (
      <Expressjs className="size-4 text-amber-500 dark:text-[#F7DF1E] fill-amber-500 dark:fill-[#F7DF1E] [&_path]:fill-amber-500 dark:[&_path]:fill-[#F7DF1E] [&_text]:fill-amber-500 dark:[&_text]:fill-[#F7DF1E]" />
    ),
    'python': <Python className="size-4" />,
    'git': <Git className="size-4" />,
    'github': (
      <GitHub className="size-4 text-[#8957e5] dark:text-[#a371f7] fill-[#8957e5] dark:fill-[#a371f7] [&_path]:fill-[#8957e5] dark:[&_path]:fill-[#a371f7] [&_text]:fill-[#8957e5] dark:[&_text]:fill-[#a371f7]" />
    ),
    'git hub': (
      <GitHub className="size-4 text-[#8957e5] dark:text-[#a371f7] fill-[#8957e5] dark:fill-[#a371f7] [&_path]:fill-[#8957e5] dark:[&_path]:fill-[#a371f7] [&_text]:fill-[#8957e5] dark:[&_text]:fill-[#a371f7]" />
    ),
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
    'prisma': (
      <Prisma className="size-4 text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400 [&_path]:fill-teal-600 dark:[&_path]:fill-teal-400" />
    ),
  }

  export default function TechStackBadges({
    items: directItems,
    skills,
    className = '',
  }: TechStackBadgesProps) {
    const playHoverSound = useHoverSound()
    const items: TechItem[] = skills !== undefined && skills !== null
      ? skills.map((s) => ({
          name: s.name,
          icon: ICON_LOOKUP[s.name.toLowerCase().trim()] || <span className="text-[10px] font-bold">{s.name[0]}</span>,
        }))
      : directItems || DEFAULT_STACK

    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {items.map((item, idx) => {
          const brandKey = item.name.toLowerCase().trim()
          const brand = BRAND_STYLES[brandKey]

          const Content = (
            <div
              tabIndex={0}
              role={item.href ? 'link' : 'button'}
              aria-label={item.name}
              onMouseEnter={() => playHoverSound(idx)}
              className={cn(
                "group/badge relative inline-flex items-center px-2 py-1.5 rounded-[6px] border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 transition-all duration-200 ease-out cursor-pointer select-none shadow-2xs",
                brand
                  ? brand.badgeHover
                  : "hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-500 focus-visible:bg-neutral-100 dark:focus-visible:bg-neutral-800/80 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-100"
              )}
            >
              <div
                className={cn(
                  "size-4 shrink-0 flex items-center justify-center",
                  brand ? brand.iconWrapper : "text-zinc-800 dark:text-zinc-200"
                )}
              >
                {item.icon}
              </div>

              <span
                className={cn(
                  "max-w-32 opacity-100 ml-1.5 sm:max-w-0 sm:opacity-0 sm:ml-0 overflow-hidden whitespace-nowrap sm:group-hover/badge:max-w-32 sm:group-hover/badge:opacity-100 sm:group-hover/badge:ml-1.5 sm:group-focus-visible/badge:max-w-32 sm:group-focus-visible/badge:opacity-100 sm:group-focus-visible/badge:ml-1.5 transition-all duration-200 ease-out text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200",
                  brand?.textHover
                )}
              >
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