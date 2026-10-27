export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://nikhil-dev.in'

export const SITE_NAME = 'Nikhil H'

export const DEFAULT_TITLE = 'Nikhil H - Portfolio'

export const TITLE_TEMPLATE = '%s | Nikhil H'

export const DEFAULT_DESCRIPTION =
  'AI Engineer & Full Stack Developer building scalable web applications, intelligent systems, and developer tools with React, Next.js, TypeScript, Node.js, and modern cloud architecture.'

export const DEFAULT_KEYWORDS = [
  'Nikhil H',
  'Nikhil',
  'AI Engineer',
  'Full Stack Developer',
  'Software Engineer',
  'Next.js Developer',
  'React Developer',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'MongoDB',
  'Supabase',
  'Open Source Developer',
  'Portfolio',
  'Web Development',
]

export const AUTHOR = {
  name: 'Nikhil H',
  url: SITE_URL,
  email: 'nikhil2k7h@gmail.com',
  github: 'https://github.com/n1khil-choudhary',
  linkedin: 'https://www.linkedin.com/in/nikhil-h-184560338/',
  jobTitle: 'AI Engineer & Full Stack Developer',
}

export function getCanonicalUrl(path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return path === '' || path === '/' ? SITE_URL : `${SITE_URL}${cleanPath}`
}

export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    url: SITE_URL,
    image: `${SITE_URL}/icon.png`,
    jobTitle: AUTHOR.jobTitle,
    email: `mailto:${AUTHOR.email}`,
    sameAs: [AUTHOR.github, AUTHOR.linkedin],
    knowsAbout: [
      'Artificial Intelligence',
      'Full Stack Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'MongoDB',
      'Supabase',
      'REST APIs',
      'Docker',
      'Git',
    ],
  }
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
    },
    inLanguage: 'en-US',
  }
}

export function getProfilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    mainEntity: getPersonJsonLd(),
  }
}

export function getProjectJsonLd(project: {
  title: string
  description: string
  slug: string
  imageUrl?: string | null
  liveUrl?: string | null
  githubUrl?: string | null
  technologies?: string[]
  updatedAt?: Date | string
  createdAt?: Date | string
}) {
  const projectUrl = getCanonicalUrl(`/projects/${project.slug}`)
  const sameAs: string[] = []
  if (project.liveUrl && project.liveUrl !== '#') sameAs.push(project.liveUrl)
  if (project.githubUrl && project.githubUrl !== '#') sameAs.push(project.githubUrl)

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: projectUrl,
    image: project.imageUrl?.startsWith('http')
      ? project.imageUrl
      : project.imageUrl
      ? `${SITE_URL}${project.imageUrl}`
      : `${SITE_URL}/icon.png`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: SITE_URL,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function getDevelopmentJsonLd(item: {
  title: string
  subtitle?: string | null
  category: string
  slug: string
  whyIUseIt?: string | null
  tags?: string[]
}) {
  const itemUrl = getCanonicalUrl(`/development/${item.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${item.title} — ${item.category}`,
    description: item.subtitle || item.whyIUseIt || `${item.title} configuration and setup in Nikhil's workflow.`,
    url: itemUrl,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: SITE_URL,
    },
    articleSection: item.category,
    keywords: (item.tags || []).join(', '),
    inLanguage: 'en-US',
  }
}
