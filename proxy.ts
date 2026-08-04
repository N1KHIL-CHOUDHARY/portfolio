import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_portfolio_cms_secret_key_2026_x89f'
const encodedKey = new TextEncoder().encode(JWT_SECRET)
const SESSION_COOKIE_NAME = 'admin_session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only handle /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  let isValidSession = false
  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, encodedKey, { algorithms: ['HS256'] })
      isValidSession = true
    } catch {
      isValidSession = false
    }
  }

  const isLoginPage = pathname === '/admin/login'

  // Logged in user trying to access /admin/login -> redirect to /admin
  if (isLoginPage && isValidSession) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Unauthenticated user trying to access protected /admin route -> redirect to /admin/login
  if (!isLoginPage && !isValidSession) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
