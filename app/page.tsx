import PortfolioClient from '@/components/PortfolioClient'
import {
  getPortfolioHero,
  getPortfolioProjects,
  getPortfolioExperiences,
  getPortfolioEducations,
  getPortfolioCertifications,
  getPortfolioDevelopment,
  getPortfolioSkills,
  getPortfolioSocialLinks,
  getGithubTheme,
  getTodayQuote,
} from '@/lib/db'
import { getGithubData } from '@/lib/github'

// ISR fallback: regenerate at most every hour even if no tag invalidation fires
export const revalidate = 3600

export default async function Page() {
  const [
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
  ] = await Promise.all([
    getPortfolioHero(),
    getPortfolioProjects(),
    getPortfolioExperiences(),
    getPortfolioEducations(),
    getPortfolioCertifications(),
    getPortfolioDevelopment(),
    getPortfolioSkills(),
    getPortfolioSocialLinks(),
    getGithubData(),
    getGithubTheme(),
    getTodayQuote(),
  ])

  return (
    <PortfolioClient
      heroData={heroData}
      projects={projects}
      experiences={experiences || undefined}
      educations={educations || undefined}
      certifications={certifications || undefined}
      development={development}
      skills={skills || undefined}
      socialLinks={socialLinks || undefined}
      githubData={githubData}
      githubTheme={githubTheme}
      todayQuote={todayQuote}
    />
  )
}

