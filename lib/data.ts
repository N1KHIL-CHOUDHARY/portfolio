// lib/data.ts

export interface HeroData {
  name: string
  roles: string[]
  bio: string
  avatarUrl?: string
  status?: string
}

export interface SocialLinkItem {
  id: string
  label: string      
  platform: string
  url: string
  icon?: string
}

export interface OpenSourceData {
  title?: string
  description?: string
  repos?: Array<{
    name: string
    url: string
    description: string
    stars?: number
    forks?: number
  }>
}

export interface ProjectItem {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  content?: string
  thumbnail?: string
  videoUrl?: string | null
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  highlights: string[]
  codeSnippetFilename?: string
  codeSnippetCode?: string
  featured: boolean
}

export interface GearItem {
  id: string
  title: string
  category: 'Laptop' | 'Keyboard' | 'Mouse' | 'Display' | 'Devices & Accessories'
  link: string
  specs?: { label: string; value: string }[]
}

export interface SkillItem {
  name: string
  icon: string
  category: 'FRONTEND' | 'BACKEND' | 'DATABASES' | 'TOOLS' | 'DEVOPS' | 'LANGUAGES'
  proficiency: number
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  location: string
  startDate: string
  endDate: string
  currentStudy: boolean
  description: string
  bullets: string[]
  logoUrl?: string
}

// ─────────────────────────────────────────────────────────────
// HERO & PROFILE DATA
// ─────────────────────────────────────────────────────────────
export const HERO_DATA: HeroData = {
  name: 'Nikhil',
  roles: ['Full Stack Engineer', 'Software Engineer'],
  bio: 'Building high-performance web systems, developer tooling, and modern UI interfaces.',
  avatarUrl: '/images/hero.png',
  status: 'Open to opportunities',
}

// ─────────────────────────────────────────────────────────────
// SOCIAL CHANNELS
// ─────────────────────────────────────────────────────────────
export interface SocialLinkItem {
  id: string
  label: string      // <-- changed/added for HeroSection
  platform: string
  url: string
  icon?: string
}

// lib/data.ts -> SOCIAL_LINKS_DATA

export const SOCIAL_LINKS_DATA: SocialLinkItem[] = [
  {
    id: 'github',
    label: 'GitHub',
    platform: 'GitHub',
    url: 'https://github.com/N1KHIL-CHOUDHARY',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/n1khil-choudhary',
  },
  {
    id: 'leetcode',
    label: 'LeetCode',
    platform: 'LeetCode',
    url: 'https://leetcode.com/u/nikhil-h-dev', // <-- replace with your handle
  },
 
]

// ─────────────────────────────────────────────────────────────
// OPEN SOURCE CONTRIBUTIONS
// ─────────────────────────────────────────────────────────────
export const OPEN_SOURCE_DATA: OpenSourceData = {
  title: 'Open Source',
  description: 'Contributions and maintained public repositories.',
  repos: [
    {
      name: 'universal-app-opener',
      url: 'https://github.com/mdsaban/universal-app-opener',
      description: 'Added Spotify deep linking handler for cross-platform app redirection.',
    },
    {
      name: 'lab-record-generator',
      url: 'https://github.com/N1KHIL-CHOUDHARY/lab-record-generator',
      description: 'In-browser zero-server PDF & DOCX record generation engine.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// ACTIVE PROJECTS
// ─────────────────────────────────────────────────────────────
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: '0ecddd4b-7cfa-47a6-bcba-d4bf9bb8f9af',
    slug: 'girvi',
    title: 'Girvi',
    subtitle: 'Enterprise Pawn Shop Platform',
    description:
      'Streamlined enterprise pawn shop platform with dynamic policy calculations and request-scoped isolation.',
    content: `PawnManager is a multi-tenant retail and finance platform that modernizes legacy pawn shop operations. It replaces static physical ledgers with a dynamic interest engine, treating loan lifecycles as programmable policies rather than flat records.

Data isolation without scaling penalties is the primary architectural constraint. Isolation is enforced through a custom request-scoped context propagation system using Node.js AsyncLocalStorage and Express middleware. The persistence layer combines a type-safe PostgreSQL schema via Prisma with aggressive Redis and TanStack Query caching.`,
    thumbnail:
      'https://res.cloudinary.com/ddgdcca86/image/upload/v1788028461/images/project%20section/idk_461248.png',
    videoUrl: '/uploads/girvi-preview.mp4',
    githubUrl: 'https://github.com/N1KHIL-CHOUDHARY/Pawn_manager',
    liveUrl: 'https://Girvii.vercel.app',
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'Docker',
      'Redis',
      'Git',
      'Upstash',
      'Framer Motion',
    ],
    highlights: [
      'Increased API throughput by 3x and secured system endpoints by implementing JWT/RBAC security, rate-limiting middleware, and automated payload sanitization.',
      'Sustained >90% regression-free deployment confidence by authoring automated Vitest unit and integration suites covering auth, pawn ticket lifecycles, and payment workflows.',
      'Accelerated monthly financial auditing by 50% by building an automated payment ledger and report generation system with encrypted sensitive field storage.',
    ],
    codeSnippetFilename: 'tenant.middleware.ts',
    codeSnippetCode: `import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

interface TenantStore {
  tenantId: string;
  userId: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantStore>();

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = (req.headers['x-tenant-id'] as string) || req.user?.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant context missing' });
  }

  const store: TenantStore = {
    tenantId,
    userId: req.user?.id || '',
  };

  tenantStorage.run(store, () => {
    next();
  });
};`,
    featured: true,
  },
  {
    id: 'f10a5c62-0b9c-4f7f-9898-0cce10cd011b',
    slug: 'labora',
    title: 'Labora',
    subtitle: '300+ users',
    description:
      'Student Record Automation generating standardized records with verified QR links.',
    content: `This document generation engine transforms raw experiment submissions and repository links into formatted PDF and DOCX student lab records. By decoupling submission data from the visual presentation layer, the tool eliminates repetitive manual table drawing.

Client-Side Link-to-QR Generation converts URLs directly in the browser without server calls, running completely client-side in memory with zero backend dependencies.`,
    thumbnail:
      'https://res.cloudinary.com/ddgdcca86/image/upload/v1788062388/images/project%20section/labora_388359.png',
    videoUrl: '/uploads/labora-preview.mp4',
    githubUrl: 'https://github.com/N1KHIL-CHOUDHARY/lab-record-generator',
    liveUrl: 'https://recordgenerator.vercel.app',
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'Git',
      'GitHub',
      'Framer Motion',
    ],
    highlights: [
      'Dynamic export pipeline delivering both pixel-perfect PDF previews and editable DOCX formats.',
      'Interactive workspace UI with real-time preview updating during structured data input.',
      'Integrated verification system using auto-generated QR codes pointing to persistent record links.',
    ],
    featured: true,
  },
]

// ─────────────────────────────────────────────────────────────
// ACTIVE GEARS & HARDWARE SETUP
// ─────────────────────────────────────────────────────────────
export const GEARS_DATA: GearItem[] = [
  {
    id: 'thinkpad-e16',
    title: 'ThinkPad E16',
    category: 'Laptop',
    link: 'https://www.lenovo.com/in/en/p/laptops/thinkpad/thinkpade/lenovo-thinkpad-e16-gen-3-16-inch-intel/21sss1hs00',
    specs: [
      { label: 'Processor', value: 'Intel Core i5 (13th Generation)' },
      { label: 'Memory (RAM)', value: '16 GB DDR5' },
      { label: 'Storage (SSD)', value: '512 GB SSD' },
    ],
  },
  {
    id: 'evofox-ronin',
    title: 'EvoFox Ronin (wireless)',
    category: 'Keyboard',
    link: 'https://www.amazon.in/EvoFox-Wireless-Mechanical-Controller-Black/dp/B0F66JWD47',
  },
  {
    id: 'razer-deathadder',
    title: 'Razer DeathAdder (wireless)',
    category: 'Mouse',
    link: 'https://www.amazon.in/Razer-DeathAdder-Hyperspeed-Award-Winning-RZ01-04130100-R3A1/dp/B09KH6NFXG',
  },
  {
    id: 'monitor-msi-mag',
    title: 'Monitor MSI MAG',
    category: 'Display',
    link: 'https://www.amazon.in/MSI-MAG-255F-E20-Frame-Less/dp/B0DQP36N7T',
  },
  {
    id: 'motorola-edge-70',
    title: 'Motorola Edge 70 Pro Plus',
    category: 'Devices & Accessories',
    link: 'https://www.motorola.in/smartphones-motorola-edge-70-pro-plus/p?skuId=677',
  },
]

// ─────────────────────────────────────────────────────────────
// CORE TECH STACK & SKILLS
// ─────────────────────────────────────────────────────────────
export const SKILLS_DATA: SkillItem[] = [
  { name: 'Next.js', icon: 'Nextjs', category: 'FRONTEND', proficiency: 90 },
  { name: 'React', icon: 'ReactIcon', category: 'FRONTEND', proficiency: 90 },
  { name: 'TypeScript', icon: 'TypeScript', category: 'LANGUAGES', proficiency: 90 },
  { name: 'Tailwind CSS', icon: 'TailwindCSS', category: 'FRONTEND', proficiency: 90 },
  { name: 'Node.js', icon: 'Nodejs', category: 'BACKEND', proficiency: 90 },
  { name: 'Express.js', icon: 'Expressjs', category: 'BACKEND', proficiency: 90 },
  { name: 'PostgreSQL', icon: 'PostgreSQL', category: 'DATABASES', proficiency: 90 },
  { name: 'MongoDB', icon: 'MongoDB', category: 'DATABASES', proficiency: 90 },
  { name: 'Redis', icon: 'Redis', category: 'DATABASES', proficiency: 90 },
  { name: 'Upstash', icon: 'Upstash', category: 'DATABASES', proficiency: 90 },
  { name: 'Git', icon: 'Git', category: 'TOOLS', proficiency: 90 },
  { name: 'GitHub', icon: 'GitHub', category: 'TOOLS', proficiency: 90 },
  { name: 'Motion', icon: 'Motion', category: 'FRONTEND', proficiency: 90 },
]

// ─────────────────────────────────────────────────────────────
// ACADEMIC EDUCATION
// ─────────────────────────────────────────────────────────────
export const EDUCATIONS_DATA: EducationItem[] = [
  {
    id: 'sec-saveetha',
    institution: 'Saveetha Engineering College',
    degree: 'BE in Computer Science And Engineering',
    location: 'Chennai',
    startDate: 'Aug 2024',
    endDate: 'Present',
    currentStudy: true,
    description: 'Undergraduate student in CSE.',
    bullets: [
      'Attended multiple coding hackathons to build software projects under tight deadlines.',
      'Met and networked with new peers across different college events.',
      'Enhanced practical coding skills through hands-on programming challenges and team projects.',
    ],
    logoUrl:
      'https://res.cloudinary.com/ddgdcca86/image/upload/v1786250866/portfolio_assets/sec_logo_small_866540.png',
  },
  {
    id: 'mgr-adarsh',
    institution: 'MGR Adarsh School',
    degree: 'Schooling (Science Stream)',
    location: 'Chennai',
    startDate: 'June 2010',
    endDate: 'May 2024',
    currentStudy: false,
    description: 'Completed 14 years of primary and secondary education.',
    bullets: [
      'Fourteen-year journey: completed 14 years at the same school.',
      'Driven by passion: deep interest in computing led directly into the science stream.',
    ],
    logoUrl:
      'https://res.cloudinary.com/ddgdcca86/image/upload/v1786250857/portfolio_assets/MGR_ADARSH_LOGO_1_857304.avif',
  },
]