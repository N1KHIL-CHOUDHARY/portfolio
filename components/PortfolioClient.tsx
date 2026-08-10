'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Hero'
import PageShell from '@/components/PageShell'
import { GitHubResponse, GithubTheme } from '@/lib/github'

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
// Dynamic imports – each below-the-fold section becomes its own chunk
// ssr: false prevents server-rendering of sections the user hasn't scrolled to
// ---------------------------------------------------------------------------

const GithubGraph = dynamic(() => import('@/components/GithubGraph'), {
  loading: () => <GraphSkeleton />,
  ssr: false,
})

const ExperienceSection = dynamic(() => import('@/components/ExperienceSection'), {
  loading: () => <TimelineSkeleton />,
  ssr: false,
})

const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'), {
  loading: () => <SectionSkeleton height="h-48" />,
  ssr: false,
})

const CertificationsSection = dynamic(() => import('@/components/CertificationsSection'), {
  loading: () => <SectionSkeleton height="h-32" />,
  ssr: false,
})

const PersonalSection = dynamic(() => import('@/components/PersonalSection'), {
  loading: () => <SectionSkeleton height="h-28" />,
  ssr: false,
})

const QuoteBanner = dynamic(() => import('@/components/QuoteBanner'), {
  loading: () => <SectionSkeleton height="h-20" />,
  ssr: false,
})

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
})

// ---------------------------------------------------------------------------
// Divider (kept inline — negligible cost)
// ---------------------------------------------------------------------------

function SectionDivider() {
  return <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800/60 my-4" />
}

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

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
  githubTheme?: GithubTheme
}

export default function PortfolioClient({
  heroData,
  projects,
  experiences,
  educations,
  certifications,
  development,
  skills,
  socialLinks,
  githubData,
  githubTheme,
}: PortfolioClientProps) {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* Hero is statically imported — it's the LCP element */}
        <Header heroData={heroData} socialLinks={socialLinks} skills={skills} />

        <GithubGraph initialData={githubData} theme={githubTheme} />

        <SectionDivider />

        <ExperienceSection
          experiences={experiences || undefined}
          educationExperiences={educations || undefined}
        />

        <SectionDivider />

        <ProjectsSection projects={projects} />

        <SectionDivider />

        <PersonalSection />

        <SectionDivider />

        <QuoteBanner />

        <Footer onNavigate={(sectionId) => {
          if (sectionId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else {
            const element = document.getElementById(sectionId)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }
        }} />
      </main>
    </PageShell>
  )
}