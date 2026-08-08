'use client'

import React from 'react'
import Header from '@/components/Hero'
import ExperienceSection from '@/components/ExperienceSection'
import ProjectsSection from '@/components/ProjectsSection'
import CertificationsSection from '@/components/CertificationsSection'
import PersonalSection from '@/components/PersonalSection'
import QuoteBanner from '@/components/QuoteBanner'
import Footer from '@/components/Footer'
import PageShell from '@/components/PageShell'
import GithubGraph from '@/components/GithubGraph'
import { GitHubResponse } from '@/lib/github'
import { GithubTheme } from '@/repositories/setting.repository'

function SectionDivider() {
  return <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800/60 my-4" />
}

interface PortfolioClientProps {
  heroData?: any
  projects?: any[]
  experiences?: any[]
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
        <Header heroData={heroData} socialLinks={socialLinks} skills={skills} />

        <GithubGraph initialData={githubData} theme={githubTheme} />

        <SectionDivider />

        <ExperienceSection experiences={experiences || undefined} />

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