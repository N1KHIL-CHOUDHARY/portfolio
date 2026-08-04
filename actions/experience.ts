'use server'

import { experienceService } from '@/services/experience.service'
import { getAdminSession } from '@/lib/session'
import { EmploymentType } from '@prisma/client'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchExperiencesAction() {
  return experienceService.getExperiences()
}

export async function createExperienceAction(data: {
  company: string
  role: string
  location?: string
  employmentType?: EmploymentType
  startDate: string
  endDate?: string
  currentJob?: boolean
  description: string
  responsibilities?: string[]
  technologies?: string[]
  companyLogo?: string
  order?: number
}) {
  const session = await checkAuth()
  return experienceService.createExperience({ ...data, userId: session.userId })
}

export async function updateExperienceAction(
  id: string,
  data: Partial<{
    company: string
    role: string
    location: string
    employmentType: EmploymentType
    startDate: string
    endDate: string
    currentJob: boolean
    description: string
    responsibilities: string[]
    technologies: string[]
    companyLogo: string
    order: number
  }>
) {
  const session = await checkAuth()
  return experienceService.updateExperience(id, { ...data, userId: session.userId })
}

export async function softDeleteExperienceAction(id: string) {
  const session = await checkAuth()
  return experienceService.softDeleteExperience(id, session.userId)
}
