'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createAdminSession, destroyAdminSession, getAdminSession } from '@/lib/session'
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
    console.error('[loginAdmin Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected authentication error occurred',
    }
  }
}

export async function getAdminProfile() {
  const session = await getAdminSession()
  if (!session) return null

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: session.email },
    }).catch(() => null)

    if (user) {
      return {
        id: user.id,
        name: user.name || session.name || 'Admin',
        email: user.email,
      }
    }
  } catch {
    // fallback to session info if DB error
  }

  return {
    id: session.userId,
    name: session.name || 'Admin',
    email: session.email,
  }
}

const updatePasswordSchema = z.object({
  adminName: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
})

export type UpdatePasswordState = {
  success: boolean
  error?: string
}

export async function updateAdminPassword(data: {
  adminName: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<UpdatePasswordState> {
  const session = await getAdminSession()
  if (!session) {
    return { success: false, error: 'Unauthorized. Session expired or missing.' }
  }

  const validation = updatePasswordSchema.safeParse(data)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input parameters',
    }
  }

  const { adminName, email, currentPassword, newPassword } = validation.data

  try {
    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com'
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!'

    let user = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: session.email },
          { email: email },
        ],
      },
    }).catch(() => null)

    if (user) {
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isValid) {
        return { success: false, error: 'Incorrect current password' }
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10)

      const updatedUser = await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          passwordHash: newPasswordHash,
          name: adminName,
          email: email,
        },
      })

      await createAdminSession({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      })

      return { success: true }
    } else {
      const isValid = (currentPassword === defaultAdminPassword)
      if (!isValid) {
        return { success: false, error: 'Incorrect current password' }
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10)

      const newUser = await prisma.adminUser.create({
        data: {
          email: email || defaultAdminEmail,
          passwordHash: newPasswordHash,
          name: adminName || 'Admin',
          role: 'admin',
        },
      })

      await createAdminSession({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      })

      return { success: true }
    }
  } catch (error) {
    console.error('Failed to update password:', error)
    return { success: false, error: 'Failed to update credentials in database.' }
  }
}

export async function logoutAdmin() {
  await destroyAdminSession()
  redirect('/admin/login')
}

