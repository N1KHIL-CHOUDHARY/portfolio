'use client'

import { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ContributionsSection from '@/components/ContributionsSection'
import ProjectsWorksSection from '@/components/ProjectsWorksSection'
import SkillsSection from '@/components/SkillsSection'
import AboutSection from '@/components/AboutSection'
import ProjectCard from '@/components/ProjectCard'
import FooterRevealLayout from '@/components/FooterRevealLayout'

const NAV_HEIGHT = 72

function useTheme() {
  const [isDark, setIsDark] = useState(false)

  useLayoutEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved === 'dark' || (saved === null && prefersDark)
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      const root = document.documentElement
      root.classList.add('theme-switching')
      setTimeout(() => root.classList.remove('theme-switching'), 280)
      return next
    })
  }, [])

  return { isDark, toggleTheme }
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  return progress
}

function Divider() {
  return <div className="w-full h-px bg-neutral-100 dark:bg-white/[0.04] max-w-6xl mx-auto" />
}

export default function Portfolio() {
  const { isDark, toggleTheme } = useTheme()
  const scrollProgress = useScrollProgress()

  const workRef = useRef<HTMLElement>(null)
  const openSourceRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const worksRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      const y = ref.current.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const scrollToWork = useCallback(() => scrollToSection(workRef), [scrollToSection])
  const scrollToOpenSource = useCallback(() => scrollToSection(openSourceRef), [scrollToSection])
  const scrollToAbout = useCallback(() => scrollToSection(aboutRef), [scrollToSection])

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#151515] transition-colors duration-300">
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        scrollToWork={scrollToWork}
        scrollToOpenSource={scrollToOpenSource}
        scrollToAbout={scrollToAbout}
        scrollProgress={scrollProgress}
      />

      <FooterRevealLayout>
        <HeroSection scrollToWork={scrollToWork} />

        <Divider />

        <section ref={openSourceRef as React.RefObject<HTMLElement>}>
          <ContributionsSection />
        </section>

        <Divider />

        <section ref={workRef as React.RefObject<HTMLElement>} className="max-w-6xl mx-auto px-6 py-24 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Full End to End Web App
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              A comprehensive full-stack project built from scratch.
            </p>
          </div>
          <ProjectCard
            title="Pawnshop Management System"
            description="A comprehensive full-stack application designed to streamline pawnshop operations. Handles ticket creation, customer management, secure payments, and detailed financial reporting."
            tech={['React', 'Node.js', 'MongoDB', 'Tailwind', 'Express']}
            image="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=70"
            github="https://github.com/N1KHIL-CHOUDHARY/pawn_manager"
            live="https://pawn-manager.vercel.app/"
          />
        </section>

        <Divider />

        <ProjectsWorksSection sectionRef={worksRef as React.RefObject<HTMLElement>} />

        <Divider />

        <SkillsSection />

        <Divider />

        <AboutSection sectionRef={aboutRef as React.RefObject<HTMLElement>} />
      </FooterRevealLayout>
    </div>
  )
}