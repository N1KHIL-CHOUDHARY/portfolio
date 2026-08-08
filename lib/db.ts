import {
  PROJECTS_DATA,
  DEVELOPMENT_DATA,
  GEARS_ITEMS,
  DEV_SETUP_ITEMS,
  ProjectData,
  DevelopmentData,
  GearItem,
  DevToolItem,
} from '@/lib/data'
import { ProjectStatus } from '@prisma/client'
import { settingRepository, DEFAULT_GITHUB_THEME, GithubTheme } from '@/repositories/setting.repository'

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
      return PROJECTS_DATA
    }

    return projects.map((p) => ({
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
    return PROJECTS_DATA
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
      return PROJECTS_DATA.find((item) => item.slug === slug)
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
    return PROJECTS_DATA.find((item) => item.slug === slug)
  }
}

export async function getPortfolioDevelopment(): Promise<DevelopmentData[]> {
  try {
    const items = await prisma.developmentSetup.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    if (!items || items.length === 0) {
      return DEVELOPMENT_DATA
    }

    return items.map((d) => ({
      slug: d.slug,
      title: d.title,
      subtitle: d.subtitle || '',
      category: d.category,
      whyIUseIt: d.whyIUseIt,
      tags: safeJson<string[]>(d.tags, []),
      specs: safeJson<any[]>(d.specs, []),
      configSnippet: d.configSnippetCode
        ? {
            filename: d.configSnippetFilename || 'config.json',
            code: d.configSnippetCode,
          }
        : undefined,
      links: safeJson<any[]>(d.links, undefined as any),
    }))
  } catch (error) {
    console.error('[getPortfolioDevelopment Error]:', error)
    return DEVELOPMENT_DATA
  }
}

export async function getPortfolioDevelopmentBySlug(slug: string): Promise<DevelopmentData | undefined> {
  try {
    const d = await prisma.developmentSetup.findFirst({
      where: { slug, deletedAt: null },
    })

    if (!d) {
      return DEVELOPMENT_DATA.find((item) => item.slug === slug)
    }

    return {
      slug: d.slug,
      title: d.title,
      subtitle: d.subtitle || '',
      category: d.category,
      whyIUseIt: d.whyIUseIt,
      tags: safeJson<string[]>(d.tags, []),
      specs: safeJson<any[]>(d.specs, []),
      configSnippet: d.configSnippetCode
        ? {
            filename: d.configSnippetFilename || 'config.json',
            code: d.configSnippetCode,
          }
        : undefined,
      links: safeJson<any[]>(d.links, undefined as any),
    }
  } catch (error) {
    console.error('[getPortfolioDevelopmentBySlug Error]:', error)
    return DEVELOPMENT_DATA.find((item) => item.slug === slug)
  }
}

export async function getPortfolioGears(): Promise<GearItem[]> {
  try {
    const items = await prisma.developmentSetup.findMany({
      where: { deletedAt: null, slug: { contains: 'gear' } },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (items && items.length > 0) {
      // Map if records exist or return enriched GEARS_ITEMS
      return GEARS_ITEMS
    }
    return GEARS_ITEMS
  } catch (error) {
    return GEARS_ITEMS
  }
}

export async function getPortfolioDevTools(): Promise<DevToolItem[]> {
  return DEV_SETUP_ITEMS
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
    return exps.map((e) => ({
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
    const theme = await settingRepository.getGithubTheme()
    return theme
  } catch (error) {
    console.error('[getGithubTheme Error]:', error)
    return DEFAULT_GITHUB_THEME
  }
}
