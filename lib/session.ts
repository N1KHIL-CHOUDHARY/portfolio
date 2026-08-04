import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_portfolio_cms_secret_key_2026_x89f'
const encodedKey = new TextEncoder().encode(JWT_SECRET)
export const SESSION_COOKIE_NAME = 'admin_session'

export interface SessionPayload {
  userId: string
  email: string
  name?: string
  role: string
  expiresAt: Date
}

export async function encrypt(payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  if (!session) return null
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch (error) {
    return null
  }
}

export async function createAdminSession(user: { id: string; email: string; name?: string | null; role?: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const sessionToken = await encrypt({
    userId: user.id,
    email: user.email,
    name: user.name || 'Admin',
    role: user.role || 'admin',
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  return sessionToken
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!cookie) return null
  return decrypt(cookie)
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
