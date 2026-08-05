import { prisma } from '@/lib/prisma'
import {
  PROJECTS_DATA,
  DEVELOPMENT_DATA,
  ProjectData,
  DevelopmentData,
} from '@/lib/data'
import { ProjectStatus } from '@prisma/client'
import { settingRepository, DEFAULT_GITHUB_THEME, GithubTheme } from '@/repositories/setting.repository'

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
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags as string[]) || [],
      githubUrl: p.githubUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      stars: p.stars || undefined,
      forks: p.forks || undefined,
      architecture:
        typeof p.architecture === 'string'
          ? JSON.parse(p.architecture)
          : (p.architecture as string[]) || [],
      coreProblem: p.coreProblem || undefined,
      highlights:
        typeof p.highlights === 'string'
          ? JSON.parse(p.highlights)
          : (p.highlights as string[]) || [],
      codeSnippet: p.codeSnippetCode
        ? {
            filename: p.codeSnippetFilename || 'codeSnippet.ts',
            code: p.codeSnippetCode,
          }
        : undefined,
    }))
  } catch (error) {
    return PROJECTS_DATA
  }
}

export async function getPortfolioProjectBySlug(slug: string): Promise<ProjectData | undefined> {
  try {
    let p = await prisma.project.findFirst({
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
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags as string[]) || [],
      githubUrl: p.githubUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      stars: p.stars || undefined,
      forks: p.forks || undefined,
      architecture:
        typeof p.architecture === 'string'
          ? JSON.parse(p.architecture)
          : (p.architecture as string[]) || [],
      coreProblem: p.coreProblem || undefined,
      highlights:
        typeof p.highlights === 'string'
          ? JSON.parse(p.highlights)
          : (p.highlights as string[]) || [],
      codeSnippet: p.codeSnippetCode
        ? {
            filename: p.codeSnippetFilename || 'codeSnippet.ts',
            code: p.codeSnippetCode,
          }
        : undefined,
    }
  } catch (error) {
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
      tags: typeof d.tags === 'string' ? JSON.parse(d.tags) : (d.tags as string[]) || [],
      specs: typeof d.specs === 'string' ? JSON.parse(d.specs) : (d.specs as any[]) || [],
      configSnippet: d.configSnippetCode
        ? {
            filename: d.configSnippetFilename || 'config.json',
            code: d.configSnippetCode,
          }
        : undefined,
      links: typeof d.links === 'string' ? JSON.parse(d.links) : (d.links as any[]) || undefined,
    }))
  } catch (error) {
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
      tags: typeof d.tags === 'string' ? JSON.parse(d.tags) : (d.tags as string[]) || [],
      specs: typeof d.specs === 'string' ? JSON.parse(d.specs) : (d.specs as any[]) || [],
      configSnippet: d.configSnippetCode
        ? {
            filename: d.configSnippetFilename || 'config.json',
            code: d.configSnippetCode,
          }
        : undefined,
      links: typeof d.links === 'string' ? JSON.parse(d.links) : (d.links as any[]) || undefined,
    }
  } catch (error) {
    return DEVELOPMENT_DATA.find((item) => item.slug === slug)
  }
}

export async function getPortfolioHero() {
  try {
    const hero = await prisma.heroSetting.findFirst()
    return hero
  } catch {
    return null
  }
}

export async function getPortfolioAbout() {
  try {
    const about = await prisma.aboutSetting.findFirst()
    return about
  } catch {
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
      responsibilities: typeof e.responsibilities === 'string' ? JSON.parse(e.responsibilities) : (e.responsibilities as string[]) || [],
      technologies: typeof e.technologies === 'string' ? JSON.parse(e.technologies) : (e.technologies as string[]) || [],
      companyLogo: e.companyLogo || undefined,
    }))
  } catch {
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
      skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : (c.skills as string[]) || [],
    }))
  } catch {
    return null
  }
}

export async function getPortfolioSkills() {
  try {
    const skills = await prisma.skill.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (!skills || skills.length === 0) return null
    return skills
  } catch {
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
  } catch {
    return null
  }
}

export async function getGithubTheme(): Promise<GithubTheme> {
  try {
    const theme = await settingRepository.getGithubTheme()
    return theme
  } catch {
    return DEFAULT_GITHUB_THEME
  }
}
