'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
  Motion as MotionIcon,
} from '@/components/icons'
import {
  IconBrandPrisma,
  IconBrandGraphql,
  IconBrandVercel,
  IconBrandSupabase,
  IconBrandHtml5,
  IconBrandCss3,
  IconBrandJavascript,
  IconBrandRedux,
  IconCode,
} from '@tabler/icons-react'

export interface SkillItem {
  id?: string
  name: string
  category?: string | null
  icon?: string | null
  color?: string | null
}

interface SkillsSectionProps {
  skills?: SkillItem[] | null
}

const DEFAULT_SKILLS: SkillItem[] = [
  // Languages & Core
  { name: 'TypeScript', category: 'Languages' },
  { name: 'JavaScript', category: 'Languages' },
  { name: 'Python', category: 'Languages' },
  { name: 'HTML5', category: 'Languages' },
  { name: 'CSS3', category: 'Languages' },

  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Framer Motion', category: 'Frontend' },
  { name: 'Redux', category: 'Frontend' },

  // Backend & Runtime
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'GraphQL', category: 'Backend' },

  // Database & Cloud
  { name: 'PostgreSQL', category: 'Database & Cloud' },
  { name: 'MongoDB', category: 'Database & Cloud' },
  { name: 'Supabase', category: 'Database & Cloud' },
  { name: 'Prisma', category: 'Database & Cloud' },
  { name: 'Redis', category: 'Database & Cloud' },
  { name: 'Upstash', category: 'Database & Cloud' },

  // DevOps & Tools
  { name: 'Docker', category: 'DevOps & Tools' },
  { name: 'AWS', category: 'DevOps & Tools' },
  { name: 'Git', category: 'DevOps & Tools' },
  { name: 'GitHub', category: 'DevOps & Tools' },
  { name: 'Vercel', category: 'DevOps & Tools' },
]

function getSkillIcon(name: string): React.ReactNode {
  const n = name.toLowerCase().trim()
  if (n === 'react' || n === 'react.js' || n === 'reactjs') {
    return <ReactIcon className="w-4 h-4 text-sky-500 dark:text-[#58C4DC]" />
  }
  if (n === 'next.js' || n === 'nextjs') {
    return <Nextjs className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
  }
  if (n === 'typescript' || n === 'ts') {
    return <TypeScript className="w-4 h-4 text-blue-500 dark:text-[#3178C6]" />
  }
  if (n === 'javascript' || n === 'js') {
    return <IconBrandJavascript className="w-4 h-4 text-yellow-500" />
  }
  if (n === 'python') {
    return <Python className="w-4 h-4 text-blue-400" />
  }
  if (n === 'html5' || n === 'html') {
    return <IconBrandHtml5 className="w-4 h-4 text-orange-500" />
  }
  if (n === 'css3' || n === 'css') {
    return <IconBrandCss3 className="w-4 h-4 text-blue-500" />
  }
  if (n === 'tailwind css' || n === 'tailwind') {
    return <TailwindCSS className="w-4 h-4 text-teal-400" />
  }
  if (n === 'node.js' || n === 'nodejs' || n === 'node') {
    return <Nodejs className="w-4 h-4 text-emerald-500" />
  }
  if (n === 'express.js' || n === 'express' || n === 'expressjs') {
    return <Expressjs className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
  }
  if (n === 'postgresql' || n === 'postgres') {
    return <PostgreSQL className="w-4 h-4 text-sky-600" />
  }
  if (n === 'mongodb' || n === 'mongo') {
    return <MongoDB className="w-4 h-4 text-emerald-600" />
  }
  if (n === 'supabase') {
    return <IconBrandSupabase className="w-4 h-4 text-emerald-500" />
  }
  if (n === 'prisma') {
    return <IconBrandPrisma className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
  }
  if (n === 'redis') {
    return <Redis className="w-4 h-4 text-red-500" />
  }
  if (n === 'upstash') {
    return <Upstash className="w-4 h-4 text-emerald-500" />
  }
  if (n === 'docker') {
    return <Docker className="w-4 h-4 text-blue-500" />
  }
  if (n === 'aws' || n === 'amazon web services') {
    return <AmazonWebServices className="w-4 h-4 text-amber-500" />
  }
  if (n === 'git') {
    return <Git className="w-4 h-4 text-orange-500" />
  }
  if (n === 'github') {
    return <GitHub className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
  }
  if (n === 'framer motion' || n === 'motion') {
    return <MotionIcon className="w-4 h-4 text-yellow-400" />
  }
  if (n === 'redux') {
    return <IconBrandRedux className="w-4 h-4 text-purple-500" />
  }
  if (n === 'graphql') {
    return <IconBrandGraphql className="w-4 h-4 text-pink-500" />
  }
  if (n === 'vercel') {
    return <IconBrandVercel className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
  }
  return <IconCode className="w-4 h-4 text-neutral-500" />
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const displaySkills = skills && skills.length > 0 ? skills : DEFAULT_SKILLS

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 pb-0">
      {displaySkills.map((skill, idx) => (
        <motion.div
          key={skill.name + idx}
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.4) }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-200/90 dark:border-neutral-800/90 bg-neutral-50/60 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 select-none shadow-2xs group cursor-default"
        >
          <span className="shrink-0 group-hover:scale-110 transition-transform duration-200">
            {getSkillIcon(skill.name)}
          </span>
          <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
            {skill.name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
