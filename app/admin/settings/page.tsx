'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Settings, Shield, Key, CheckCircle2, Loader2, Palette, Save, Sparkles, Sun, Moon } from 'lucide-react'
import { toast } from 'sonner'
import { getAdminProfile, updateAdminPassword } from '@/actions/auth'
import { fetchGithubThemeAction, updateGithubThemeAction } from '@/actions/github-theme'
import { GithubTheme, ModeTheme } from '@/lib/github'

const PRESET_THEMES: { name: string; light: ModeTheme; dark: ModeTheme }[] = [
  {
    name: 'Classic Green',
    light: {
      level0: '#ebedf0',
      level1: '#9be9a8',
      level2: '#40c463',
      level3: '#30a14e',
      level4: '#216e39',
    },
    dark: {
      level0: '#161b22',
      level1: '#0e4429',
      level2: '#006d32',
      level3: '#26a641',
      level4: '#39d353',
    },
  },
  {
    name: 'Ocean Blue',
    light: {
      level0: '#f0f9ff',
      level1: '#bae6fd',
      level2: '#38bdf8',
      level3: '#0284c7',
      level4: '#0369a1',
    },
    dark: {
      level0: '#0f172a',
      level1: '#1e3a8a',
      level2: '#1d4ed8',
      level3: '#2563eb',
      level4: '#60a5fa',
    },
  },
  {
    name: 'Sunset Orange',
    light: {
      level0: '#fff7ed',
      level1: '#ffedd5',
      level2: '#fb923c',
      level3: '#ea580c',
      level4: '#9a3412',
    },
    dark: {
      level0: '#1c1917',
      level1: '#7c2d12',
      level2: '#c2410c',
      level3: '#ea580c',
      level4: '#fb923c',
    },
  },
  {
    name: 'Violet / Purple',
    light: {
      level0: '#f5f3ff',
      level1: '#ddd6fe',
      level2: '#a78bfa',
      level3: '#7c3aed',
      level4: '#5b21b6',
    },
    dark: {
      level0: '#18181b',
      level1: '#4c1d95',
      level2: '#6d28d9',
      level3: '#8b5cf6',
      level4: '#c084fc',
    },
  },
  {
    name: 'Monochrome / Zinc',
    light: {
      level0: '#f4f4f5',
      level1: '#e4e4e7',
      level2: '#a1a1aa',
      level3: '#52525b',
      level4: '#18181b',
    },
    dark: {
      level0: '#18181b',
      level1: '#27272a',
      level2: '#52525b',
      level3: '#a1a1aa',
      level4: '#f4f4f5',
    },
  },
]

export default function AdminSettingsPage() {
  const [isPending, startTransition] = useTransition()
  const [isThemePending, startThemeTransition] = useTransition()

  const [adminName, setAdminName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [modeTab, setModeTab] = useState<'light' | 'dark'>('dark')
  const [themeColors, setThemeColors] = useState<GithubTheme>({
    light: {
      level0: '#ebedf0',
      level1: '#9be9a8',
      level2: '#40c463',
      level3: '#30a14e',
      level4: '#216e39',
    },
    dark: {
      level0: '#161b22',
      level1: '#0e4429',
      level2: '#006d32',
      level3: '#26a641',
      level4: '#39d353',
    },
  })

  useEffect(() => {
    getAdminProfile().then((profile) => {
      if (profile) {
        if (profile.name) setAdminName(profile.name)
        if (profile.email) setEmail(profile.email)
      }
    })

    fetchGithubThemeAction().then((res) => {
      if (res.success && res.data) {
        setThemeColors(res.data)
      }
    })
  }, [])

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('Please enter your current password.')
      return
    }

    if (!newPassword) {
      toast.error('Please enter a new password.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!')
      return
    }

    startTransition(async () => {
      const res = await updateAdminPassword({
        adminName,
        email,
        currentPassword,
        newPassword,
        confirmPassword,
      })

      if (res.success) {
        toast.success('Admin password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(res.error || 'Failed to update password')
      }
    })
  }

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault()
    startThemeTransition(async () => {
      const res = await updateGithubThemeAction(themeColors)
      if (res.success) {
        toast.success('GitHub graph light & dark mode themes updated!')
      } else {
        toast.error(res.error || 'Failed to update graph colors')
      }
    })
  }

  const samplePattern = [
    [0, 1, 0, 2, 0, 1, 0],
    [1, 2, 3, 2, 1, 0, 1],
    [0, 3, 4, 4, 3, 2, 0],
    [2, 4, 4, 3, 4, 1, 2],
    [1, 2, 3, 2, 1, 0, 1],
    [0, 1, 2, 4, 3, 2, 0],
    [2, 3, 4, 1, 2, 3, 4],
    [1, 0, 2, 3, 4, 2, 1],
  ]

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Admin Account & Theme Settings
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage your CMS credentials, security settings, and customize separate Light & Dark GitHub contribution graph themes.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-6 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>GitHub Graph Themes (Light & Dark)</span>
          </h2>

          <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setModeTab('light')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                modeTab === 'light'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setModeTab('dark')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                modeTab === 'dark'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-zinc-300 font-semibold block">Presets</label>
            <span className="text-[10px] text-zinc-400">Clicking a preset applies matching Light & Dark shades</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  setThemeColors({
                    light: preset.light,
                    dark: preset.dark,
                  })
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 text-xs font-sans transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex gap-0.5">
                  {([0, 1, 2, 3, 4] as const).map((lvl) => (
                    <div
                      key={lvl}
                      className="w-2.5 h-2.5 rounded-[2px]"
                      style={{ backgroundColor: preset[modeTab][`level${lvl}`] }}
                    />
                  ))}
                </div>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              {modeTab === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span>{modeTab === 'light' ? 'Light Mode Level Colors' : 'Dark Mode Level Colors'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {(['level0', 'level1', 'level2', 'level3', 'level4'] as const).map((lvlKey, idx) => (
              <div key={lvlKey} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-300">Level {idx}</span>
                  <div
                    className="w-3.5 h-3.5 rounded border border-zinc-700"
                    style={{ backgroundColor: themeColors[modeTab][lvlKey] }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColors[modeTab][lvlKey]}
                    onChange={(e) =>
                      setThemeColors((prev) => ({
                        ...prev,
                        [modeTab]: {
                          ...prev[modeTab],
                          [lvlKey]: e.target.value,
                        },
                      }))
                    }
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={themeColors[modeTab][lvlKey]}
                    onChange={(e) =>
                      setThemeColors((prev) => ({
                        ...prev,
                        [modeTab]: {
                          ...prev[modeTab],
                          [lvlKey]: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-white text-[11px] font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-zinc-300 bg-white text-zinc-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode Live Preview</span>
            </div>
            <div className="flex gap-[3px] overflow-hidden p-2 bg-zinc-50 rounded-lg border border-zinc-200 justify-center">
              {samplePattern.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {column.map((levelVal, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="w-3 h-3 rounded-[2px] border border-zinc-200"
                      style={{
                        backgroundColor: themeColors.light[`level${levelVal as 0 | 1 | 2 | 3 | 4}`],
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark Mode Live Preview</span>
            </div>
            <div className="flex gap-[3px] overflow-hidden p-2 bg-zinc-900 rounded-lg border border-zinc-800 justify-center">
              {samplePattern.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {column.map((levelVal, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="w-3 h-3 rounded-[2px] border border-zinc-800"
                      style={{
                        backgroundColor: themeColors.dark[`level${levelVal as 0 | 1 | 2 | 3 | 4}`],
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveTheme} className="pt-2">
          <button
            type="submit"
            disabled={isThemePending}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isThemePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Theme Colors</span>
          </button>
        </form>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-6 font-mono text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Admin Credentials</span>
        </h2>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-zinc-400 block">Admin Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Admin Name"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.com"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Password</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Update Account Credentials</span>
          </button>
        </form>
      </div>
    </div>
  )
}
