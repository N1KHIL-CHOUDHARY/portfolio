'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Github, ExternalLink, FileText, Link2 } from 'lucide-react'

const TECH_ICONS: Record<string, string> = {
  React: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765433904/React_a3rw47.png',
  'Node.js': 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432670/Node.js_tbuz56.png',
  Tailwind: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432673/Tailwind-CSS_wgo3yx.png',
  MongoDB: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/MongoDB_vzwooc.png',
  Git: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/Git_i7ulab.png',
  Express: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/Express_rbyn2d.png',
}

function ActionLink({ href, icon: Icon, label, text }: { href: string; icon: React.ElementType; label: string; text?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-white/8 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-white/15 hover:bg-neutral-50 dark:hover:bg-white/4 transition-all duration-200"
    >
      <Icon size={12} />
      {text && <span>{text}</span>}
    </a>
  )
}

function TechBadge({ item }: { item: string }) {
  const icon = TECH_ICONS[item]
  return icon ? (
    <img src={icon} alt={item} title={item} loading="lazy" className="w-6 h-6 object-contain" />
  ) : (
    <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-md bg-neutral-100 dark:bg-white/6 text-neutral-500 dark:text-neutral-400">
      {item}
    </span>
  )
}

interface ProjectCardProps {
  title: string
  description: string
  tech?: string[]
  image?: string
  github?: string
  live?: string
  docs?: string
}

export default function ProjectCard({ title, description, tech = [], image, github, live, docs }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - left) / width - 0.5)
    mouseY.set((e.clientY - top) / height - 0.5)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }, [mouseX, mouseY])

  const hostname = useMemo(() => {
    if (!live) return null
    try { return new URL(live).hostname.replace('www.', '') } catch { return null }
  }, [live])

  return (
    <motion.article
      ref={ref as React.RefObject<HTMLElement>}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="relative flex flex-col w-full rounded-2xl p-6 lg:p-8 border border-neutral-200/70 dark:border-white/[0.06] bg-[#FAFAF9] dark:bg-[#151515] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_rgba(255,255,255,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-shadow duration-300"
    >
      {hovered && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_60%)]" />
        </div>
      )}

      {image && (
        <div className="mb-5 w-full h-48 rounded-xl overflow-hidden bg-neutral-100 dark:bg-white/5">
          <img src={image} alt={title} className="w-full h-full object-cover object-top" />
        </div>
      )}

      <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 mb-6">{description}</p>

      {tech.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {tech.map((item, i) => <TechBadge key={`${item}-${i}`} item={item} />)}
        </div>
      )}

      <div className="mt-auto pt-5 border-t border-neutral-100 dark:border-white/[0.05]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {hostname && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Link2 size={12} />
              <span>{hostname}</span>
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {github && <ActionLink href={github} icon={Github} label="Source code" />}
            {docs && <ActionLink href={docs} icon={FileText} label="Documentation" text="Docs" />}
            {live && <ActionLink href={live} icon={ExternalLink} label="Live demo" text="Live" />}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
