import { z } from 'zod'
import { ProjectStatus, EmploymentType, SkillCategory } from '@prisma/client'

// Helper for optional URL fields that allow empty strings, relative paths, or full URLs
const optionalUrl = z.string().trim().optional().nullable().or(z.literal(''))

// Helper for optional string fields
const optionalString = z.string().trim().optional().nullable().or(z.literal(''))

// Helper for date fields that allow "Present", dates, empty string, or null
const flexDateString = z.string().trim().optional().nullable().or(z.literal('Present')).or(z.literal(''))

// --- Auth Schemas ---
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const updatePasswordSchema = z
  .object({
    adminName: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  })

// --- Project Schemas ---
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: optionalString,
  subtitle: optionalString,
  role: optionalString,
  timeline: optionalString,
  description: z.string().min(1, 'Description is required'),
  content: optionalString,
  thumbnail: optionalString,
  gallery: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  architecture: z.array(z.string()).optional().default([]),
  coreProblem: optionalString,
  highlights: z.array(z.string()).optional().default([]),
  codeSnippetFilename: optionalString,
  codeSnippetCode: optionalString,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  stars: z.number().int().min(0).optional().default(0),
  forks: z.number().int().min(0).optional().default(0),
  status: z.nativeEnum(ProjectStatus).optional().default(ProjectStatus.DRAFT),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
  seoTitle: optionalString,
  seoDescription: optionalString,
})

export const projectUpdateSchema = projectSchema.partial()

// --- Experience Schemas ---
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: optionalString,
  employmentType: z.nativeEnum(EmploymentType).optional().default(EmploymentType.FULL_TIME),
  startDate: optionalString,
  endDate: flexDateString,
  currentJob: z.boolean().optional().default(false),
  description: optionalString,
  responsibilities: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  subRoles: z.any().optional().default([]),
  projects: z.any().optional().default([]),
  logoType: optionalString.default('custom'),
  companyLogo: optionalString,
  logoUrl: optionalString,
  order: z.number().int().optional().default(0),
})

export const experienceUpdateSchema = experienceSchema.partial()

// --- Education Schemas ---
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  location: optionalString,
  startDate: optionalString,
  endDate: flexDateString,
  currentStudy: z.boolean().optional().default(false),
  description: optionalString,
  bullets: z.array(z.string()).optional().default([]),
  projects: z.any().optional().default([]),
  logoType: optionalString.default('custom'),
  logoUrl: optionalString,
  order: z.number().int().optional().default(0),
})

export const educationUpdateSchema = educationSchema.partial()

// --- Certification Schemas ---
export const certificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  credentialUrl: optionalUrl,
  credentialId: optionalString,
  certificateImage: optionalString,
  skills: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
})

export const certificationUpdateSchema = certificationSchema.partial()

// --- Skill Schemas ---
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.nativeEnum(SkillCategory).optional().default(SkillCategory.FRONTEND),
  icon: optionalString,
  color: optionalString,
  proficiency: z.number().int().min(0).max(100).optional().default(80),
  order: z.number().int().optional().default(0),
  featured: z.boolean().optional().default(false),
})

export const skillUpdateSchema = skillSchema.partial()

// --- Development Setup Schemas ---
export const developmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: optionalString,
  subtitle: optionalString,
  category: z.string().min(1, 'Category is required'),
  whyIUseIt: z.string().min(1, 'Reasoning is required'),
  content: optionalString,
  tags: z.array(z.string()).optional().default([]),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).optional().default([]),
  configSnippetFilename: optionalString,
  configSnippetCode: optionalString,
  links: z.array(z.object({ label: z.string(), url: z.string() })).optional().default([]),
  laptop: optionalString,
  desktop: optionalString,
  keyboard: optionalString,
  mouse: optionalString,
  monitor: optionalString,
  microphone: optionalString,
  camera: optionalString,
  chair: optionalString,
  ide: optionalString,
  extensions: optionalString,
  terminal: optionalString,
  browser: optionalString,
  wallpaper: optionalString,
  productivityApps: optionalString,
  image: optionalString,
  affiliateLink: optionalString,
  order: z.number().int().optional().default(0),
})

export const developmentUpdateSchema = developmentSchema.partial()
export const developmentSetupSchema = developmentSchema

// --- Setting Schemas ---
export const heroSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  subtitle: optionalString,
  location: optionalString,
  availability: optionalString,
  profileImage: optionalString,
  resumeUrl: optionalUrl,
  email: z.string().email('Valid email required').or(z.literal('')),
  phone: optionalString,
  shortBio: optionalString,
  ctaButtons: z.any().optional().default([]),
})

export const aboutSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  image: optionalString,
  yearsExperience: z.number().int().min(0).optional().default(0),
  projectsCompleted: z.number().int().min(0).optional().default(0),
  githubContributions: z.number().int().min(0).optional().default(0),
  customCards: z.any().optional().default([]),
})

export const seoSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required'),
  description: optionalString,
  keywords: optionalString,
  ogImage: optionalUrl,
  twitterImage: optionalUrl,
  robots: z.string().optional().default('index, follow'),
  canonicalUrl: optionalUrl,
  favicon: optionalString,
})

export const socialSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().trim().min(1, 'URL is required'),
  label: z.string().min(1, 'Label is required'),
  icon: optionalString,
  order: z.number().int().optional().default(0),
  enabled: z.boolean().optional().default(true),
})
