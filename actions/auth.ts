'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createAdminSession, destroyAdminSession } from '@/lib/session'
import { redirect } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginState = {
  success: boolean
  error?: string
}

export async function loginAdmin(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input parameters',
    }
  }

  try {
    let user = null
    try {
      user = await prisma.adminUser.findUnique({
        where: { email: validation.data.email },
      })
    } catch {
      // Database not reachable yet or schema unmigrated
    }

    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com'
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!'

    if (user) {
      const isValid = await bcrypt.compare(validation.data.password, user.passwordHash)
      if (!isValid) {
        return { success: false, error: 'Invalid email or password' }
      }
      await createAdminSession({ id: user.id, email: user.email, name: user.name })
      return { success: true }
    } else if (validation.data.email === defaultAdminEmail && validation.data.password === defaultAdminPassword) {
      // Fallback auth for initial setup before DB migration
      await createAdminSession({ id: 'default-admin-id', email: defaultAdminEmail, name: 'Admin' })
      return { success: true }
    }

    return { success: false, error: 'Invalid email or password' }
  } catch (error) {
    return { success: false, error: 'An unexpected authentication error occurred' }
  }
}

export async function logoutAdmin() {
  await destroyAdminSession()
  redirect('/admin/login')
}
