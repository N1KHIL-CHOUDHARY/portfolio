'use client'

import React, { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { loginAdmin } from '@/actions/auth'
import { useTheme } from 'next-themes'
import ThemeToggle from '@/components/layout/ThemeToggle'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      const result = await loginAdmin(undefined, formData)

      if (result.success) {
        toast.success('Authentication successful! Redirecting...')
        router.push(from)
        router.refresh()
      } else {
        const err = result.error || 'Authentication failed'
        setErrorMessage(err)
        toast.error(err)
      }
    })
  }

  return (
    <div className="p-6 sm:p-8 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xl space-y-5 font-mono text-xs">
      {errorMessage && (
        <div className="p-3 rounded-md border border-dashed border-rose-400 dark:border-rose-800 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-neutral-600 dark:text-neutral-400 block font-semibold">Email Address</label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.com"
              className="w-full pl-9 pr-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-neutral-600 dark:text-neutral-400 block font-semibold">Password</label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-[11px] text-neutral-500 border-t border-dashed border-neutral-200 dark:border-neutral-800">
        Default credentials: <span className="text-neutral-700 dark:text-neutral-300">admin@portfolio.com</span>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center p-4 relative font-mono selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <Toaster position="top-right" theme={isDark ? 'dark' : 'light'} />

      {/* Theme toggle in top corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Admin Gateway</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Portfolio CMS
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Enter your credentials to manage portfolio content.
          </p>
        </div>

        <Suspense fallback={
          <div className="p-8 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex justify-center items-center">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
          </div>
        }>
          <LoginForm />
        </Suspense>

        <div className="text-center text-[11px] text-neutral-400 dark:text-neutral-600">
          Protected System • Blueprint Studio
        </div>
      </div>
    </div>
  )
}