'use server'

import { skillService } from '@/services/skill.service'
import { getAdminSession } from '@/lib/session'
import { SkillCategory } from '@prisma/client'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchSkillsAction() {
  return skillService.getSkills()
}

export async function createSkillAction(data: {
  name: string
  category: SkillCategory
  icon?: string
  color?: string
  proficiency?: number
  order?: number
  featured?: boolean
}) {
  const session = await checkAuth()
  return skillService.createSkill({ ...data, userId: session.userId })
}

export async function updateSkillAction(id: string, data: any) {
  const session = await checkAuth()
  return skillService.updateSkill(id, { ...data, userId: session.userId })
}

export async function softDeleteSkillAction(id: string) {
  const session = await checkAuth()
  return skillService.softDeleteSkill(id, session.userId)
}
