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
    let exps = await prisma.experience.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    if (!exps || exps.length === 0) {
      const initialWork = [
        {
          company: 'DBS Bank',
          role: 'Associate',
          location: 'Singapore',
          employmentType: 'FULL_TIME' as any,
          startDate: 'Jul 2025',
          endDate: 'Present',
          currentJob: true,
          description: 'Building Java, Spring Boot, and Activiti services for current and savings account servicing business processes.',
          responsibilities: JSON.stringify([
            'Building Java, Spring Boot, and Activiti services for current and savings account servicing business processes; raised JUnit coverage above 80% and led a team knowledge base project.',
          ]),
          subRoles: JSON.stringify([
            {
              role: 'Graduate Associate (SEED Programme)',
              date: 'Jul 2023 - Jun 2025',
              bullets: [
                'Built a Python and SQL automation tool to migrate and configure over 1,000 configuration variants of a process-tracking workflow from a vendor platform into an in-house Spring Boot and Activiti application (MariaDB), reducing per-configuration setup from 1-2 hours to under 5 minutes.',
                'Developed backend services in Java, Spring Boot, and Activiti and collaborated across teams on end-to-end delivery.',
              ],
            },
          ]),
          technologies: JSON.stringify(['Java', 'Spring Boot', 'Activiti', 'Python', 'MariaDB']),
          logoType: 'dbs',
          order: 1,
        },
        {
          company: 'Singapore Institute of Technology',
          role: 'Software Developer (Contract)',
          location: 'Singapore',
          employmentType: 'CONTRACT' as any,
          startDate: 'Apr 2023',
          endDate: 'Jun 2023',
          currentJob: false,
          description: 'Built NFTVue NFT gallery website and DemoConstruct 3D reconstruction web app.',
          responsibilities: JSON.stringify([
            'Built NFTVue, a NFT gallery website that allows students to connect their crypto wallets to view and verify their school event-issued NFTs',
            'Worked on DemoConstruct, a full-stack web application (React + Python) that uses Meshroom to reconstruct 3D models from captured images',
          ]),
          projects: JSON.stringify([{ name: 'NFTVue' }]),
          technologies: JSON.stringify(['React', 'Python', 'Meshroom', 'NFT']),
          logoType: 'sit',
          order: 2,
        },
        {
          company: 'DBS Bank',
          role: 'Software Developer (Intern)',
          location: 'Singapore',
          employmentType: 'INTERNSHIP' as any,
          startDate: 'May 2022',
          endDate: 'Dec 2022',
          currentJob: false,
          description: 'Worked on digital exchange backend and DBS Metaverse admin dashboard.',
          responsibilities: JSON.stringify([
            'Worked on the backend for the digital exchange and asset custody application using Spring Boot and Java',
            'Built an admin dashboard web application for a DBS Metaverse event using Spring Security and Angular',
          ]),
          technologies: JSON.stringify(['Spring Boot', 'Java', 'Angular', 'Spring Security']),
          logoType: 'dbs',
          order: 3,
        },
        {
          company: 'Activate Interactive Pte Ltd',
          role: 'Software Developer (Intern)',
          location: 'Singapore',
          employmentType: 'INTERNSHIP' as any,
          startDate: 'May 2019',
          endDate: 'Aug 2019',
          currentJob: false,
          description: 'Developed RP Connect cross-platform mobile app.',
          responsibilities: JSON.stringify([
            'Developed RP Connect, the iOS and Android mobile app for Republic Polytechnic using React Native',
          ]),
          technologies: JSON.stringify(['React Native', 'JavaScript', 'iOS', 'Android']),
          logoType: 'activate',
          order: 4,
        },
      ]

      for (const item of initialWork) {
        await prisma.experience.create({ data: item })
      }

      exps = await prisma.experience.findMany({
        where: { deletedAt: null },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      })
    }

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
      logoUrl: e.companyLogo || undefined,
      companyLogo: e.companyLogo || undefined,
      order: e.order || 0,
    }))
  } catch (error) {
    console.error('[getPortfolioExperiences Error]:', error)
    return []
  }
}

export async function getPortfolioEducations() {
  try {
    const educationModel = (prisma as any).education
    if (!educationModel) return []

    let edus = await educationModel.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    if (!edus || edus.length === 0) {
      const initialEdu = [
        {
          institution: 'Digipen Institute of Technology Singapore',
          degree: 'BS in Computer Science in Real-Time Interactive Simulation',
          location: 'Singapore',
          startDate: 'Sep 2019',
          endDate: 'Apr 2023',
          currentStudy: false,
          description: 'Graduated with a Minor in Mathematics and President of Digipen Student Management Committee.',
          bullets: JSON.stringify([
            'Graduated with a Minor in Mathematics',
            'President of Digipen Student Management Committee for freshman year',
            '3-time recipient of the Dean\'s Honor List',
          ]),
          projects: JSON.stringify([
            { name: 'Final Year Project' },
            { name: '2nd Year Project' },
          ]),
          logoType: 'digipen',
          order: 1,
        },
        {
          institution: 'Singapore Polytechnic',
          degree: 'Diploma in Games Design and Development',
          location: 'Singapore',
          startDate: 'Apr 2014',
          endDate: 'May 2017',
          currentStudy: false,
          description: 'Diploma in Games Design and Development.',
          bullets: JSON.stringify([]),
          projects: JSON.stringify([
            { name: 'Final Year Project' },
          ]),
          logoType: 'sp',
          order: 2,
        },
      ]

      for (const item of initialEdu) {
        await educationModel.create({ data: item })
      }

      edus = await educationModel.findMany({
        where: { deletedAt: null },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      })
    }

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
