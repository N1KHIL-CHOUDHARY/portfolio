"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/sections/HeroSection'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import { GitHubResponse, GithubTheme } from '@/lib/github'
import type { ContributionGraphProps } from '@/components/features/ContributionGraph'

// ---------------------------------------------------------------------------
// Lightweight skeleton loaders – pure CSS, zero JS overhead
// ---------------------------------------------------------------------------

function SectionSkeleton({ height = 'h-40' }: { height?: string }) {
  return (
    <div className={`${height} w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 animate-pulse`} />
  )
}

function GraphSkeleton() {
  return (
    <div className="w-full space-y-3 py-2">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
      <div className="h-[120px] w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/50 animate-pulse" />
    </div>
  )
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-900/90 animate-pulse" />
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-7 space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800/60 animate-pulse" />
              <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800/60 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dynamic imports
// ---------------------------------------------------------------------------

const ContributionGraph = dynamic<ContributionGraphProps>(
  () => import('@/components/features/ContributionGraph'),
  {
    loading: () => <GraphSkeleton />,
    ssr: false,
  }
)

const OpenSourceSection = dynamic(() => import('@/components/sections/OpenSourceSection'), {
  loading: () => <TimelineSkeleton />,
  ssr: false,
})

const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'), {
  loading: () => <SectionSkeleton height="h-48" />,
  ssr: false,
})

const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection'), {
  loading: () => <SectionSkeleton height="h-28" />,
  ssr: false,
})

const EducationSection = dynamic(() => import('@/components/sections/EducationSection'), {
  loading: () => <TimelineSkeleton />,
  ssr: false,
})

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: false,
})

function SectionHeader({ title, tag }: { title?: string; tag?: string }) {
  if (!title && !tag) return null
  return (
    <div className="relative pt-1 pb-0.5">
      <div className="flex items-center justify-between py-1">
        <h2 className="text-[15px] sm:text-[16px] font-medium tracking-tight text-neutral-600 dark:text-neutral-500 leading-[1.2]">
          <span className="text-neutral-400 dark:text-neutral-500 mr-1 select-none">#</span>
          {title?.toLowerCase()}
        </h2>
        {tag && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 border border-neutral-300/60 dark:border-neutral-800/60">
            {tag}
          </span>
        )}
      </div>
    </div>
  )
}

interface PortfolioClientProps {
  heroData?: any
  projects?: any[]
  experiences?: any[]
  educations?: any[]
  certifications?: any[]
  development?: any[]
  skills?: any[]
  socialLinks?: any[]
  githubData?: GitHubResponse
  leetcodeData?: GitHubResponse
  githubTheme?: GithubTheme
  todayQuote?: any
  openSourceData?: any
  initialViews?: number
}

export default function PortfolioClient({
  heroData,
  projects,
  skills,
  socialLinks,
  githubData,
  leetcodeData,
  githubTheme,
  openSourceData,
  educations,
  initialViews,
}: PortfolioClientProps) {
  return (
    <BlueprintLayout showNavbar={true}>
      <div className="space-y-8 sm:space-y-10">
        {/* Hero Section */}
        <Header heroData={heroData} socialLinks={socialLinks} />

        {/* Contributions Graph Section */}
        <section id="contributions" className="space-y-3">
          <ContributionGraph
            githubData={githubData}
            leetcodeData={leetcodeData}
            theme={githubTheme}
          />
        </section>

        {/* Projects Section */}
        <section id="projects" className="space-y-3">
          <SectionHeader title="projects" />
          <ProjectsSection projects={projects} />
        </section>

        {/* Skills Section */}
        <section id="skills" className="space-y-3">
          <SectionHeader title="skills" />
          <SkillsSection skills={skills} />
        </section>

        {/* Open Source Section */}
        <section id="open-source" className="space-y-3">
          <SectionHeader title="open source" />
          <OpenSourceSection {...(openSourceData || {})} />
        </section>

        {/* Education Section */}
        <section id="education" className="space-y-3">
          <SectionHeader title="education" />
          <EducationSection educations={educations || undefined} />
        </section>

        {/* Footer */}
        <Footer initialViews={initialViews} />
      </div>
    </BlueprintLayout>
  )
}