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
} from '@/lib/db'
import { getGithubData } from '@/lib/github'

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
    />
  )
}

