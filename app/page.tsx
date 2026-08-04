import PortfolioClient from '@/components/PortfolioClient'
import {
  getPortfolioHero,
  getPortfolioProjects,
  getPortfolioExperiences,
  getPortfolioCertifications,
  getPortfolioDevelopment,
  getPortfolioSkills,
  getPortfolioSocialLinks,
} from '@/lib/db'

export default async function Page() {
  const [
    heroData,
    projects,
    experiences,
    certifications,
    development,
    skills,
    socialLinks,
  ] = await Promise.all([
    getPortfolioHero(),
    getPortfolioProjects(),
    getPortfolioExperiences(),
    getPortfolioCertifications(),
    getPortfolioDevelopment(),
    getPortfolioSkills(),
    getPortfolioSocialLinks(),
  ])

  return (
    <PortfolioClient
      heroData={heroData}
      projects={projects}
      experiences={experiences || undefined}
      certifications={certifications || undefined}
      development={development}
      skills={skills || undefined}
      socialLinks={socialLinks || undefined}
    />
  )
}
