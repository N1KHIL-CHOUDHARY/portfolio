import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import {
  ProjectData,
  DevelopmentData,
  GearItem,
  DevToolItem,
} from '@/lib/data'
import { ProjectStatus } from '@prisma/client'
import { GithubTheme, ModeTheme, DEFAULT_GITHUB_THEME } from '@/lib/github'

export { DEFAULT_GITHUB_THEME }
export type { GithubTheme, ModeTheme }

// ---------------------------------------------------------------------------
// Shared revalidation period (1 hour)
// ---------------------------------------------------------------------------
const CACHE_TTL = 3600

function safeJson<T>(val: unknown, fallback: T): T {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T
    } catch {
      return fallback
    }
  }
  return val as T
}

// ---------------------------------------------------------------------------
// getPortfolioProjects
// ---------------------------------------------------------------------------
async function _getPortfolioProjects(): Promise<ProjectData[]> {
  try {
    let projects = await prisma.project.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
        deletedAt: null,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    if (!projects || projects.length === 0) {
      projects = await prisma.project.findMany({
        where: { deletedAt: null },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      })
    }

    if (!projects || projects.length === 0) {
      return []
    }

    return projects.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle || '',
      role: p.role || 'Creator',
      timeline: p.timeline || '',
      description: p.description,
      tags: safeJson<string[]>(p.tags, []),
      githubUrl: p.githubUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      stars: p.stars || undefined,
      forks: p.forks || undefined,
      architecture: safeJson<string[]>(p.architecture, []),
      coreProblem: p.coreProblem || undefined,
      highlights: safeJson<string[]>(p.highlights, []),
      codeSnippet: p.codeSnippetCode
        ? {
            filename: p.codeSnippetFilename || 'codeSnippet.ts',
            code: p.codeSnippetCode,
          }
        : undefined,
    }))
  } catch (error) {
    console.error('[getPortfolioProjects Error]:', error)
    return []
  }
}

export const getPortfolioProjects = unstable_cache(
  _getPortfolioProjects,
  ['portfolio-projects'],
  { tags: ['projects'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioProjectBySlug  (per-slug cache — not wrapped globally)
// ---------------------------------------------------------------------------
export async function getPortfolioProjectBySlug(slug: string): Promise<ProjectData | undefined> {
  return unstable_cache(
    async () => {
      try {
        const p = await prisma.project.findFirst({
          where: {
            slug,
            deletedAt: null,
          },
        })

        if (!p) {
          return undefined
        }

        return {
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle || '',
          role: p.role || 'Creator',
          timeline: p.timeline || '',
          description: p.description,
          tags: safeJson<string[]>(p.tags, []),
          githubUrl: p.githubUrl || undefined,
          liveUrl: p.liveUrl || undefined,
          stars: p.stars || undefined,
          forks: p.forks || undefined,
          architecture: safeJson<string[]>(p.architecture, []),
          coreProblem: p.coreProblem || undefined,
          highlights: safeJson<string[]>(p.highlights, []),
          codeSnippet: p.codeSnippetCode
            ? {
                filename: p.codeSnippetFilename || 'codeSnippet.ts',
                code: p.codeSnippetCode,
              }
            : undefined,
        } as ProjectData
      } catch (error) {
        console.error('[getPortfolioProjectBySlug Error]:', error)
        return undefined
      }
    },
    [`portfolio-project-${slug}`],
    { tags: ['projects', `project-${slug}`], revalidate: CACHE_TTL },
  )()
}

// ---------------------------------------------------------------------------
// getPortfolioDevelopment
// ---------------------------------------------------------------------------
async function _getPortfolioDevelopment(): Promise<DevelopmentData[]> {
  try {
    const items = await prisma.developmentSetup.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    if (!items || items.length === 0) {
      return []
    }

    return items.map((d: any) => ({
      slug: d.slug,
      title: d.title,
      subtitle: d.subtitle || '',
      category: d.category,
      whyIUseIt: d.whyIUseIt,
      content: d.content || undefined,
      description: d.whyIUseIt,
      link: `/development/${d.slug}`,
      tags: safeJson<string[]>(d.tags, []),
      specs: safeJson<any[]>(d.specs, []),
      configSnippet: d.configSnippetCode
        ? {
            filename: d.configSnippetFilename || 'config.json',
            code: d.configSnippetCode,
          }
        : undefined,
      links: safeJson<any[]>(d.links, []),
    }))
  } catch (error) {
    console.error('[getPortfolioDevelopment Error]:', error)
    return []
  }
}

export const getPortfolioDevelopment = unstable_cache(
  _getPortfolioDevelopment,
  ['portfolio-development'],
  { tags: ['development'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioDevelopmentBySlug
// ---------------------------------------------------------------------------
export async function getPortfolioDevelopmentBySlug(slug: string): Promise<DevelopmentData | undefined> {
  return unstable_cache(
    async () => {
      try {
        const d = await prisma.developmentSetup.findFirst({
          where: { slug, deletedAt: null },
        })

        if (!d) {
          return undefined
        }

        return {
          slug: d.slug,
          title: d.title,
          subtitle: d.subtitle || '',
          category: d.category,
          whyIUseIt: d.whyIUseIt,
          content: d.content || undefined,
          description: d.whyIUseIt,
          link: `/development/${d.slug}`,
          tags: safeJson<string[]>(d.tags, []),
          specs: safeJson<any[]>(d.specs, []),
          configSnippet: d.configSnippetCode
            ? {
                filename: d.configSnippetFilename || 'config.json',
                code: d.configSnippetCode,
              }
            : undefined,
          links: safeJson<any[]>(d.links, []),
        } as DevelopmentData
      } catch (error) {
        console.error('[getPortfolioDevelopmentBySlug Error]:', error)
        return undefined
      }
    },
    [`portfolio-development-${slug}`],
    { tags: ['development', `development-${slug}`], revalidate: CACHE_TTL },
  )()
}

// ---------------------------------------------------------------------------
// getPortfolioGears
// ---------------------------------------------------------------------------
async function _getPortfolioGears(): Promise<GearItem[]> {
  try {
    const gearModel = prisma.gear || (prisma as any).gear
    if (!gearModel) return []
    const items = await gearModel.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (!items || items.length === 0) return []
    return items.map((g: any) => ({
      id: g.id,
      title: g.title,
      link: g.link || '#',
      subtitle: g.subtitle || '',
      category: g.category || 'Devices & Accessories',
      order: g.order || 0,
    }))
  } catch (error) {
    console.error('[getPortfolioGears Error]:', error)
    return []
  }
}

export const getPortfolioGears = unstable_cache(
  _getPortfolioGears,
  ['portfolio-gears'],
  { tags: ['gears'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioDevTools  (derives from cached getPortfolioDevelopment)
// ---------------------------------------------------------------------------
export async function getPortfolioDevTools(): Promise<DevToolItem[]> {
  const items = await getPortfolioDevelopment()
  return items.map((item) => ({
    id: item.slug,
    title: item.title,
    subtitle: item.subtitle || '',
    category: item.category,
    link: item.link || `/development/${item.slug}`,
    tags: item.tags,
    specs: item.specs,
    description: item.whyIUseIt,
    configSnippet: item.configSnippet,
  }))
}

// ---------------------------------------------------------------------------
// getPortfolioHero
// ---------------------------------------------------------------------------
async function _getPortfolioHero() {
  try {
    const hero = await prisma.heroSetting.findFirst()
    return hero
  } catch (error) {
    console.error('[getPortfolioHero Error]:', error)
    return null
  }
}

export const getPortfolioHero = unstable_cache(
  _getPortfolioHero,
  ['portfolio-hero'],
  { tags: ['hero'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioAbout
// ---------------------------------------------------------------------------
async function _getPortfolioAbout() {
  try {
    const about = await prisma.aboutSetting.findFirst()
    return about
  } catch (error) {
    console.error('[getPortfolioAbout Error]:', error)
    return null
  }
}

export const getPortfolioAbout = unstable_cache(
  _getPortfolioAbout,
  ['portfolio-about'],
  { tags: ['about'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioExperiences
// ---------------------------------------------------------------------------
async function _getPortfolioExperiences() {
  try {
    const exps = await prisma.experience.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    if (!exps || exps.length === 0) return []

    return exps.map((e: any) => ({
      id: e.id,
      title: e.company,
      company: e.company,
      subtitle: e.role,
      role: e.role,
      date: e.endDate ? `${e.startDate} - ${e.endDate}` : e.currentJob ? `${e.startDate} - Present` : e.startDate,
      dates: e.endDate ? `${e.startDate} – ${e.endDate}` : e.currentJob ? `${e.startDate} – Present` : e.startDate,
      location: e.location || '',
      employmentType: e.employmentType,
      isCurrent: e.currentJob,
      description: e.description,
      bullets: safeJson<string[]>(e.responsibilities, []),
      responsibilities: safeJson<string[]>(e.responsibilities, []),
      subRoles: safeJson<any[]>(e.subRoles, []),
      projects: safeJson<any[]>(e.projects, []),
      technologies: safeJson<string[]>(e.technologies, []),
      logoType: e.logoType || 'custom',
      logoUrl: e.companyLogo
        ? e.companyLogo.includes('fiverr')
          ? '/images/fiverr-new3326.jpg'
          : e.companyLogo
        : undefined,
      companyLogo: e.companyLogo
        ? e.companyLogo.includes('fiverr')
          ? '/images/fiverr-new3326.jpg'
          : e.companyLogo
        : undefined,
      order: e.order || 0,
    }))
  } catch (error) {
    console.error('[getPortfolioExperiences Error]:', error)
    return []
  }
}

export const getPortfolioExperiences = unstable_cache(
  _getPortfolioExperiences,
  ['portfolio-experiences'],
  { tags: ['experiences'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioEducations
// ---------------------------------------------------------------------------
async function _getPortfolioEducations() {
  try {
    const educationModel = (prisma as any).education
    if (!educationModel) return []

    const edus = await educationModel.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    if (!edus || edus.length === 0) return []

    return edus.map((e: any) => ({
      id: e.id,
      title: e.institution,
      institution: e.institution,
      subtitle: e.degree,
      degree: e.degree,
      date: e.endDate ? `${e.startDate} - ${e.endDate}` : e.currentStudy ? `${e.startDate} - Present` : e.startDate,
      dates: e.endDate ? `${e.startDate} – ${e.endDate}` : e.currentStudy ? `${e.startDate} – Present` : e.startDate,
      location: e.location || '',
      currentStudy: e.currentStudy,
      description: e.description,
      bullets: safeJson<string[]>(e.bullets, []),
      projects: safeJson<any[]>(e.projects, []),
      logoType: e.logoType || 'custom',
      logoUrl: e.logoUrl || undefined,
      order: e.order || 0,
    }))
  } catch (error) {
    console.error('[getPortfolioEducations Error]:', error)
    return []
  }
}

export const getPortfolioEducations = unstable_cache(
  _getPortfolioEducations,
  ['portfolio-educations'],
  { tags: ['educations'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioCertifications
// ---------------------------------------------------------------------------
async function _getPortfolioCertifications() {
  try {
    const certs = await prisma.certification.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (!certs || certs.length === 0) return null
    return certs.map((c: any) => ({
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialId: c.credentialId || undefined,
      verifyUrl: c.credentialUrl || undefined,
      skills: safeJson<string[]>(c.skills, []),
    }))
  } catch (error) {
    console.error('[getPortfolioCertifications Error]:', error)
    return null
  }
}

export const getPortfolioCertifications = unstable_cache(
  _getPortfolioCertifications,
  ['portfolio-certifications'],
  { tags: ['certifications'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioSkills
// ---------------------------------------------------------------------------
async function _getPortfolioSkills() {
  try {
    const skills = await prisma.skill.findMany({
      where: { deletedAt: null },
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })
    if (!skills || skills.length === 0) return null
    return skills
  } catch (error) {
    console.error('[getPortfolioSkills Error]:', error)
    return null
  }
}

export const getPortfolioSkills = unstable_cache(
  _getPortfolioSkills,
  ['portfolio-skills'],
  { tags: ['skills'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getPortfolioSocialLinks
// ---------------------------------------------------------------------------
async function _getPortfolioSocialLinks() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { deletedAt: null, enabled: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (!links || links.length === 0) return null
    return links
  } catch (error) {
    console.error('[getPortfolioSocialLinks Error]:', error)
    return null
  }
}

export const getPortfolioSocialLinks = unstable_cache(
  _getPortfolioSocialLinks,
  ['portfolio-social-links'],
  { tags: ['social-links'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// getGithubTheme
// ---------------------------------------------------------------------------
async function _getGithubTheme(): Promise<GithubTheme> {
  try {
    const about = await prisma.aboutSetting.findFirst()
    if (about && about.customCards) {
      const cards = typeof about.customCards === 'string' ? JSON.parse(about.customCards) : about.customCards
      if (cards && typeof cards === 'object' && 'githubTheme' in cards) {
        const stored = cards.githubTheme
        if (stored.light && stored.dark) {
          return stored as GithubTheme
        }
        if (stored.level0) {
          return {
            light: DEFAULT_GITHUB_THEME.light,
            dark: stored as ModeTheme,
          }
        }
      }
    }
    return DEFAULT_GITHUB_THEME
  } catch (error) {
    console.error('[getGithubTheme Error]:', error)
    return DEFAULT_GITHUB_THEME
  }
}

export const getGithubTheme = unstable_cache(
  _getGithubTheme,
  ['portfolio-github-theme'],
  { tags: ['github-theme', 'about'], revalidate: CACHE_TTL },
)

// ---------------------------------------------------------------------------
// QuoteData + getTodayQuote
// ---------------------------------------------------------------------------
export interface QuoteData {
  id?: string
  text: string
  author: string
  category?: string | null
  order?: number
}

export const DEFAULT_QUOTE: QuoteData = {
  text: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions.",
  author: "Bhagavad Gita",
  category: "Wisdom",
  order: 0,
}

async function _getTodayQuote(): Promise<QuoteData> {
  try {
    const quotes = await prisma.quote.findMany({
      where: { deletedAt: null, active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    if (!quotes || quotes.length === 0) {
      return DEFAULT_QUOTE
    }

    // Deterministic daily rotation by day number (UTC midnight epoch day)
    const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    const index = Math.abs(dayNumber) % quotes.length
    const q = quotes[index]

    return {
      id: q.id,
      text: q.text,
      author: q.author,
      category: q.category || null,
      order: q.order,
    }
  } catch (error) {
    console.error('[getTodayQuote Error]:', error)
    return DEFAULT_QUOTE
  }
}

/**
 * Cached deterministic daily quote. For the random variant (admin preview),
 * call _getTodayQuoteRandom directly — it bypasses the cache intentionally.
 */
export const getTodayQuote = unstable_cache(
  _getTodayQuote,
  ['portfolio-today-quote'],
  { tags: ['quotes'], revalidate: CACHE_TTL },
)

/**
 * Non-cached random quote picker — used only in server actions / admin preview.
 */
export async function getTodayQuoteRandom(): Promise<QuoteData> {
  try {
    const quotes = await prisma.quote.findMany({
      where: { deletedAt: null, active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    if (!quotes || quotes.length === 0) {
      return DEFAULT_QUOTE
    }

    const randomIndex = Math.floor(Math.random() * quotes.length)
    const q = quotes[randomIndex]
    return {
      id: q.id,
      text: q.text,
      author: q.author,
      category: q.category || null,
      order: q.order,
    }
  } catch (error) {
    console.error('[getTodayQuoteRandom Error]:', error)
    return DEFAULT_QUOTE
  }
}

// ---------------------------------------------------------------------------
// getAllQuotes  (admin-only read — not wrapped in cache)
// ---------------------------------------------------------------------------
export async function getAllQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })
    return quotes
  } catch (error) {
    console.error('[getAllQuotes Error]:', error)
    return []
  }
}
