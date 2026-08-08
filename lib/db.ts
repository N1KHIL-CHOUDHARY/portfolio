import { prisma } from '@/lib/prisma'
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

export async function getPortfolioProjects(): Promise<ProjectData[]> {
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

export async function getPortfolioProjectBySlug(slug: string): Promise<ProjectData | undefined> {
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
    }
  } catch (error) {
    console.error('[getPortfolioProjectBySlug Error]:', error)
    return undefined
  }
}

export async function getPortfolioDevelopment(): Promise<DevelopmentData[]> {
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

export async function getPortfolioDevelopmentBySlug(slug: string): Promise<DevelopmentData | undefined> {
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
    }
  } catch (error) {
    console.error('[getPortfolioDevelopmentBySlug Error]:', error)
    return undefined
  }
}

export async function getPortfolioGears(): Promise<GearItem[]> {
  try {
    const gearModel = prisma.gear || (prisma as any).gear
    const items = await gearModel.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (items && items.length > 0) {
      return items.map((g: any) => ({
        id: g.id,
        title: g.title,
        subtitle: g.subtitle || '',
        category: g.category,
        link: g.link,
        tags: safeJson<string[]>(g.tags, []),
        specs: safeJson<any[]>(g.specs, []),
        description: g.description || undefined,
      }))
    }
    return []
  } catch (error) {
    return []
  }
}

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

export async function getPortfolioHero() {
  try {
    const hero = await prisma.heroSetting.findFirst()
    return hero
  } catch (error) {
    console.error('[getPortfolioHero Error]:', error)
    return null
  }
}

export async function getPortfolioAbout() {
  try {
    const about = await prisma.aboutSetting.findFirst()
    return about
  } catch (error) {
    console.error('[getPortfolioAbout Error]:', error)
    return null
  }
}

export async function getPortfolioExperiences() {
  try {
    const exps = await prisma.experience.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (!exps || exps.length === 0) return null
    return exps.map((e: any) => ({
      company: e.company,
      role: e.role,
      dates: e.endDate ? `${e.startDate} – ${e.endDate}` : e.currentJob ? `${e.startDate} – Present` : e.startDate,
      location: e.location || '',
      employmentType: e.employmentType,
      isCurrent: e.currentJob,
      description: e.description,
      responsibilities: safeJson<string[]>(e.responsibilities, []),
      technologies: safeJson<string[]>(e.technologies, []),
      companyLogo: e.companyLogo || undefined,
    }))
  } catch (error) {
    console.error('[getPortfolioExperiences Error]:', error)
    return null
  }
}

export async function getPortfolioCertifications() {
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

export async function getPortfolioSkills() {
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

export async function getPortfolioSocialLinks() {
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

export async function getGithubTheme(): Promise<GithubTheme> {
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
