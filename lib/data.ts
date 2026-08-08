export interface ProjectData {
  slug: string
  title: string
  subtitle: string
  role: string
  timeline: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  stars?: number
  forks?: number
  architecture?: string[]
  coreProblem?: string
  highlights?: string[]
  codeSnippet?: {
    filename: string
    code: string
  }
}

export interface DevelopmentData {
  slug: string
  title: string
  subtitle: string
  category: string
  whyIUseIt: string
  content?: string
  link?: string
  description?: string
  tags: string[]
  specs: { label: string; value: string }[]
  configSnippet?: {
    filename: string
    code: string
  }
  links?: { label: string; url: string }[]
}

export interface GearItem {
  id?: string
  title: string
  link: string
  subtitle?: string
  category?: string
  order?: number
}

export interface DevToolItem {
  id?: string
  title: string
  subtitle: string
  category: string
  link: string
  tags: string[]
  specs?: { label: string; value: string }[]
  description?: string
  configSnippet?: {
    filename: string
    code: string
  }
}

export const PROJECTS_DATA: ProjectData[] = []
export const DEVELOPMENT_DATA: DevelopmentData[] = []
export const GEARS_ITEMS: GearItem[] = []
export const DEV_SETUP_ITEMS: DevToolItem[] = []

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return undefined
}

export function getDevelopmentBySlug(slug: string): DevelopmentData | undefined {
  return undefined
}
