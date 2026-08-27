"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Hero'
import BlueprintLayout from '@/components/BlueprintLayout'
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
// ---------------------------------------------------------------------------

const GithubGraph = dynamic(() => import('@/components/GithubGraph'), {
  loading: () => <GraphSkeleton />,
  ssr: false,
})

const OpenSourceSection = dynamic(() => import('@/components/OpenSourceSection'), {
  loading: () => <TimelineSkeleton />,
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
// Blueprint Section Header & Divider Components
// ---------------------------------------------------------------------------

function SectionHeader({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {title}
          </h2>
        </div>
        {tag && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 border border-neutral-300/60 dark:border-neutral-800/60">
            {tag}
          </span>
        )}
      </div>
      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800" />
    </div>
  )
}

function SectionDivider() {
  return <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />
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
  todayQuote?: any
  openSourceData?: any
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
  todayQuote,
  openSourceData,
}: PortfolioClientProps) {
  return (
    <BlueprintLayout>
      <main className="space-y-10 sm:space-y-12">
        {/* Hero Section */}
        <Header heroData={heroData} socialLinks={socialLinks} skills={skills} />

        {/* GitHub Contributions Section */}
        <section id="contributions" className="space-y-4">
          <SectionHeader title="Contributions" tag="GitHub Activity" />
          <GithubGraph initialData={githubData} theme={githubTheme} />
        </section>

        {/* Open Source Section */}
        

        {/* Projects Section */}
        <section id="projects" className="space-y-4">
          <SectionHeader title="Projects" tag="Open Source & Work" />
          <ProjectsSection projects={projects} />
        </section>

        <section id="open-source" className="space-y-4">
          <SectionHeader title="Open Source" tag="PRs & Activity" />
          <OpenSourceSection {...(openSourceData || {})} />
        </section>

        {/* Experience & Education Section */}
        <section id="experience" className="space-y-4">
          <SectionHeader title="Experience" tag="Career & Education" />
          <ExperienceSection
            experiences={experiences || undefined}
            educationExperiences={educations || undefined}
          />
        </section>

        {/* Personal / About Section */}
        <section id="personal" className="space-y-4">
          <SectionHeader title="Personal" tag="Interests & Writing" />
          <PersonalSection />
        </section>

        {/* Daily Quote Section */}
        <section id="quote" className="space-y-4">
          <SectionHeader title="Daily Thought" tag="Quote" />
          <QuoteBanner initialQuote={todayQuote} />
        </section>

        {/* Footer */}
        <Footer
          onNavigate={(sectionId) => {
            if (sectionId === 'top') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              const element = document.getElementById(sectionId)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }
          }}
        />
      </main>
    </BlueprintLayout>
  )
}