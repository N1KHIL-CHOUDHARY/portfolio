import HomeView from '@/components/views/HomeView'
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
  getPortfolioOpenSource,
} from '@/lib/db'
import { getGithubData } from '@/lib/github'
import { getLeetCodeData } from '@/lib/leetcode'
import { getProfilePageJsonLd } from '@/lib/seo'
import { getAnalyticsSummary } from '@/lib/analytics'

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
    leetcodeData,
    githubTheme,
    todayQuote,
    openSourceData,
    analyticsSummary,
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
    getLeetCodeData().catch(() => undefined),
    getGithubTheme(),
    getTodayQuote(),
    getPortfolioOpenSource(),
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
      <HomeView
        heroData={heroData}
        projects={projects}
        experiences={experiences || undefined}
        educations={educations || undefined}
        certifications={certifications || undefined}
        development={development}
        skills={skills || undefined}
        socialLinks={socialLinks || undefined}
        githubData={githubData}
        leetcodeData={leetcodeData}
        githubTheme={githubTheme}
        todayQuote={todayQuote}
        openSourceData={openSourceData || undefined}
        initialViews={analyticsSummary?.totalViews}
      />
    </>
  )
}

