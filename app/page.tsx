// app/page.tsx
import React from 'react'
import dynamic from 'next/dynamic'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import HeroSection from '@/components/sections/HeroSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import EducationSection from '@/components/sections/EducationSection'
import AchievementSection from '@/components/sections/achievement'
import Footer from '@/components/layout/Footer'
import {
  getPortfolioHero,
  getPortfolioProjects,
  getPortfolioEducations,
  getPortfolioSkills,
  getPortfolioSocialLinks,
  getPortfolioOpenSource,
} from '@/lib/db'
import { getGithubData } from '@/lib/github'
import { getLeetCodeData } from '@/lib/leetcode'
import { getProfilePageJsonLd } from '@/lib/seo'
import { getAnalyticsSummary } from '@/lib/analytics'
import type { ContributionGraphProps } from '@/components/features/ContributionGraph'


const ContributionGraph = dynamic<ContributionGraphProps>(
  () => import('@/components/features/ContributionGraph'),
  {
    loading: () => (
      <div className="w-full space-y-3 py-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
        <div className="h-[120px] w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/50 animate-pulse" />
      </div>
    ),
  }
)

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

export const revalidate = 3600

export default async function Page() {
  const [
    heroData,
    projects,
    educations,
    skills,
    socialLinks,
    githubData,
    leetcodeData,
    openSourceData,
    analyticsSummary,
  ] = await Promise.all([
    getPortfolioHero().catch(() => null),
    getPortfolioProjects().catch(() => []),
    getPortfolioEducations().catch(() => []),
    getPortfolioSkills().catch(() => []),
    getPortfolioSocialLinks().catch(() => []),
    getGithubData().catch(() => null),
    getLeetCodeData().catch(() => undefined),
    getPortfolioOpenSource().catch(() => null),
    getAnalyticsSummary().catch(() => null),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProfilePageJsonLd()),
        }}
      />
      <BlueprintLayout showNavbar={true}>
        <div className="space-y-8 sm:space-y-10">
          {/* Hero Section */}
          <HeroSection
            heroData={heroData || undefined}
            socialLinks={socialLinks || undefined}
          />

          {/* Contributions Graph Section */}
          <section id="contributions" className="space-y-3">
            <ContributionGraph
              githubData={githubData || undefined}
              leetcodeData={leetcodeData}
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
            <SectionHeader title="small wins" />
            <AchievementSection repos={openSourceData?.repos} />
          </section>

          {/* Education Section */}
          <section id="education" className="space-y-3">
            <SectionHeader title="education" />
            <EducationSection educations={educations} />
          </section>

          {/* Footer */}
          <Footer initialVisitors={analyticsSummary?.uniqueVisitors} initialViews={analyticsSummary?.uniqueVisitors} />
        </div>
      </BlueprintLayout>
    </>
  )
}
