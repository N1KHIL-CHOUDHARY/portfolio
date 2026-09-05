'use client'

import React, { useState, useEffect, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Sparkles,
  User,
  Share2,
  Globe,
  Palette,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'
import MediaUploader from '@/components/admin/ui/MediaUploader'
import { fetchHeroAction, updateHeroAction } from '@/actions/hero'
import { fetchAboutAction, updateAboutAction } from '@/actions/about'
import { fetchSocialsAction, saveSocialAction, deleteSocialAction } from '@/actions/social'
import { fetchSeoAction, updateSeoAction } from '@/actions/seo'
import { fetchGithubThemeAction, updateGithubThemeAction } from '@/actions/github-theme'
import { updateAdminPassword, getAdminProfile } from '@/actions/auth'
import { GithubTheme, ModeTheme } from '@/lib/github'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'

const PRESET_THEMES: { name: string; light: ModeTheme; dark: ModeTheme }[] = [
  {
    name: 'Classic Green',
    light: { level0: '#ebedf0', level1: '#9be9a8', level2: '#40c463', level3: '#30a14e', level4: '#216e39' },
    dark: { level0: '#161b22', level1: '#0e4429', level2: '#006d32', level3: '#26a641', level4: '#39d353' },
  },
  {
    name: 'Ocean Blue',
    light: { level0: '#f0f9ff', level1: '#bae6fd', level2: '#38bdf8', level3: '#0284c7', level4: '#0369a1' },
    dark: { level0: '#0f172a', level1: '#1e3a8a', level2: '#1d4ed8', level3: '#2563eb', level4: '#60a5fa' },
  },
  {
    name: 'Sunset Orange',
    light: { level0: '#fff7ed', level1: '#ffedd5', level2: '#fb923c', level3: '#ea580c', level4: '#9a3412' },
    dark: { level0: '#1c1917', level1: '#7c2d12', level2: '#c2410c', level3: '#ea580c', level4: '#fb923c' },
  },
  {
    name: 'Monochrome Zinc',
    light: { level0: '#f4f4f5', level1: '#e4e4e7', level2: '#a1a1aa', level3: '#71717a', level4: '#27272a' },
    dark: { level0: '#18181b', level1: '#27272a', level2: '#52525b', level3: '#a1a1aa', level4: '#f4f4f5' },
  },
]

type TabId = 'hero' | 'about' | 'social' | 'seo' | 'theme' | 'security'

function SettingsContent() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as TabId) || 'hero'
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [isPending, startTransition] = useTransition()

  // -------------------------
  // Hero State
  // -------------------------
  const [heroLoading, setHeroLoading] = useState(false)
  const [heroForm, setHeroForm] = useState({
    name: '',
    headline: '',
    subtitle: '',
    location: '',
    availability: '',
    profileImage: '',
    resumeUrl: '',
    email: '',
    phone: '',
    shortBio: '',
  })

  // -------------------------
  // About State
  // -------------------------
  const [aboutLoading, setAboutLoading] = useState(false)
  const [aboutForm, setAboutForm] = useState({
    content: '',
    image: '',
    yearsExperience: 0,
    projectsCompleted: 0,
    githubContributions: 0,
  })

  // -------------------------
  // Social State
  // -------------------------
  const [socialLoading, setSocialLoading] = useState(false)
  const [socialLinks, setSocialLinks] = useState<any[]>([])
  const [editingSocial, setEditingSocial] = useState<any | null>(null)
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false)
  const [socialDeleteId, setSocialDeleteId] = useState<string | null>(null)

  // -------------------------
  // SEO State
  // -------------------------
  const [seoLoading, setSeoLoading] = useState(false)
  const [seoForm, setSeoForm] = useState({
    siteTitle: '',
    description: '',
    keywords: '',
    ogImage: '',
    twitterImage: '',
    robots: 'index, follow',
    canonicalUrl: '',
    favicon: '',
  })

  // -------------------------
  // Theme State
  // -------------------------
  const [themeLoading, setThemeLoading] = useState(false)
  const [githubTheme, setGithubTheme] = useState<GithubTheme | null>(null)

  // -------------------------
  // Security State
  // -------------------------
  const [adminName, setAdminName] = useState('Admin')
  const [adminEmail, setAdminEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Load Initial Data for Current Tab
  useEffect(() => {
    if (activeTab === 'hero') loadHero()
    if (activeTab === 'about') loadAbout()
    if (activeTab === 'social') loadSocials()
    if (activeTab === 'seo') loadSeo()
    if (activeTab === 'theme') loadTheme()
    if (activeTab === 'security') loadSecurity()
  }, [activeTab])

  const loadSecurity = async () => {
    try {
      const profile = await getAdminProfile()
      if (profile) {
        if (profile.name) setAdminName(profile.name)
        if (profile.email) setAdminEmail(profile.email)
      }
    } catch {
      // ignore
    }
  }

  const loadHero = async () => {
    setHeroLoading(true)
    try {
      const res = await fetchHeroAction()
      if (res.success && res.data) {
        const d = res.data
        setHeroForm({
          name: d.name || '',
          headline: d.headline || '',
          subtitle: d.subtitle || '',
          location: d.location || '',
          availability: d.availability || '',
          profileImage: d.profileImage || '',
          resumeUrl: d.resumeUrl || '',
          email: d.email || '',
          phone: d.phone || '',
          shortBio: d.shortBio || '',
        })
      }
    } catch {
      toast.error('Failed to load hero configuration')
    } finally {
      setHeroLoading(false)
    }
  }

  const loadAbout = async () => {
    setAboutLoading(true)
    try {
      const res = await fetchAboutAction()
      if (res.success && res.data) {
        const d = res.data
        setAboutForm({
          content: d.content || '',
          image: d.image || '',
          yearsExperience: d.yearsExperience || 0,
          projectsCompleted: d.projectsCompleted || 0,
          githubContributions: d.githubContributions || 0,
        })
      }
    } catch {
      toast.error('Failed to load about configuration')
    } finally {
      setAboutLoading(false)
    }
  }

  const loadSocials = async () => {
    setSocialLoading(true)
    try {
      const res = await fetchSocialsAction()
      if (res.success && res.items) {
        setSocialLinks(res.items)
      }
    } catch {
      toast.error('Failed to load social links')
    } finally {
      setSocialLoading(false)
    }
  }

  const loadSeo = async () => {
    setSeoLoading(true)
    try {
      const res = await fetchSeoAction()
      if (res.success && res.data) {
        const d = res.data
        setSeoForm({
          siteTitle: d.siteTitle || '',
          description: d.description || '',
          keywords: d.keywords || '',
          ogImage: d.ogImage || '',
          twitterImage: d.twitterImage || '',
          robots: d.robots || 'index, follow',
          canonicalUrl: d.canonicalUrl || '',
          favicon: d.favicon || '',
        })
      }
    } catch {
      toast.error('Failed to load SEO settings')
    } finally {
      setSeoLoading(false)
    }
  }

  const loadTheme = async () => {
    setThemeLoading(true)
    try {
      const res = await fetchGithubThemeAction()
      if (res.success && res.data) {
        setGithubTheme(res.data)
      }
    } catch {
      toast.error('Failed to load GitHub theme')
    } finally {
      setThemeLoading(false)
    }
  }

  // Handlers
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateHeroAction(heroForm)
      if (res.success) {
        toast.success('Hero configuration saved successfully')
      } else {
        toast.error(res.error || 'Failed to save hero')
      }
    })
  }

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateAboutAction(aboutForm)
      if (res.success) {
        toast.success('About configuration saved successfully')
      } else {
        toast.error(res.error || 'Failed to save about')
      }
    })
  }

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSocial) return
    startTransition(async () => {
      const res = await saveSocialAction(editingSocial.id, editingSocial)
      if (res.success) {
        toast.success('Social link saved')
        setIsSocialModalOpen(false)
        setEditingSocial(null)
        loadSocials()
      } else {
        toast.error(res.error || 'Failed to save social link')
      }
    })
  }

  const handleDeleteSocial = () => {
    if (!socialDeleteId) return
    startTransition(async () => {
      const res = await deleteSocialAction(socialDeleteId)
      if (res.success) {
        toast.success('Social link removed')
        setSocialDeleteId(null)
        loadSocials()
      } else {
        toast.error(res.error || 'Failed to delete social link')
      }
    })
  }

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateSeoAction(seoForm)
      if (res.success) {
        toast.success('SEO configuration saved')
      } else {
        toast.error(res.error || 'Failed to update SEO')
      }
    })
  }

  const handleApplyPreset = (preset: (typeof PRESET_THEMES)[0]) => {
    const newTheme: GithubTheme = {
      light: preset.light,
      dark: preset.dark,
    }
    setGithubTheme(newTheme)
    startTransition(async () => {
      const res = await updateGithubThemeAction(newTheme)
      if (res.success) {
        toast.success(`Theme "${preset.name}" applied!`)
      } else {
        toast.error(res.error || 'Failed to update theme')
      }
    })
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    startTransition(async () => {
      const res = await updateAdminPassword({
        adminName: adminName.trim() || 'Admin',
        email: adminEmail.trim() || 'admin@portfolio.com',
        currentPassword,
        newPassword,
        confirmPassword,
      })
      if (res.success) {
        toast.success('Admin password updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(res.error || 'Failed to update password')
      }
    })
  }

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'hero', label: 'Profile & Hero', icon: Sparkles },
    { id: 'about', label: 'About & Stats', icon: User },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
    { id: 'theme', label: 'GitHub Theme', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Site Configuration Hub
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Configure profile hero, bio, statistics, social media links, SEO tags, and security settings.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md bg-neutral-100/60 dark:bg-neutral-900/60">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-semibold border border-neutral-300/80 dark:border-neutral-700/80 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: HERO */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="space-y-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Hero & Introduction</h2>
              <p className="text-[11px] text-neutral-500">Configure public banner name, headlines, and availability status.</p>
            </div>
            <button
              type="submit"
              disabled={isPending || heroLoading}
              className="px-3.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Hero</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                required
                value={heroForm.name}
                onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Headline</label>
              <input
                type="text"
                required
                value={heroForm.headline}
                onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Subtitle / Tagline</label>
              <input
                type="text"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Location</label>
              <input
                type="text"
                value={heroForm.location}
                onChange={(e) => setHeroForm({ ...heroForm, location: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Availability Status</label>
              <input
                type="text"
                value={heroForm.availability}
                onChange={(e) => setHeroForm({ ...heroForm, availability: e.target.value })}
                placeholder="e.g. Open to Opportunities"
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Email</label>
              <input
                type="email"
                required
                value={heroForm.email}
                onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Resume URL</label>
              <input
                type="text"
                value={heroForm.resumeUrl}
                onChange={(e) => setHeroForm({ ...heroForm, resumeUrl: e.target.value })}
                placeholder="e.g. /resume.pdf"
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Short Bio</label>
              <textarea
                rows={3}
                required
                value={heroForm.shortBio}
                onChange={(e) => setHeroForm({ ...heroForm, shortBio: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-y"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Profile Photo</label>
              <MediaUploader
                currentValue={heroForm.profileImage}
                onUploadSuccess={(url) => setHeroForm({ ...heroForm, profileImage: url })}
                label="Upload profile image (avatar)"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: ABOUT */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="space-y-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">About & Statistics</h2>
              <p className="text-[11px] text-neutral-500">Configure detailed bio text and milestone metrics.</p>
            </div>
            <button
              type="submit"
              disabled={isPending || aboutLoading}
              className="px-3.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save About</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Years of Experience</label>
              <input
                type="number"
                value={aboutForm.yearsExperience}
                onChange={(e) => setAboutForm({ ...aboutForm, yearsExperience: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Projects Completed</label>
              <input
                type="number"
                value={aboutForm.projectsCompleted}
                onChange={(e) => setAboutForm({ ...aboutForm, projectsCompleted: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">GitHub Contributions</label>
              <input
                type="number"
                value={aboutForm.githubContributions}
                onChange={(e) => setAboutForm({ ...aboutForm, githubContributions: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">About Bio Narrative</label>
              <textarea
                rows={6}
                required
                value={aboutForm.content}
                onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none resize-y"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: SOCIAL */}
      {activeTab === 'social' && (
        <div className="space-y-4 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Social Media Links</h2>
              <p className="text-[11px] text-neutral-500">Manage links displayed in Connect section and portfolio footer.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingSocial({ platform: '', label: '', url: '', icon: '', order: socialLinks.length, enabled: true })
                setIsSocialModalOpen(true)
              }}
              className="px-3 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Social Link</span>
            </button>
          </div>

          <div className="divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800">
            {socialLinks.length === 0 ? (
              <div className="py-8 text-center text-neutral-400">No social links configured yet.</div>
            ) : (
              socialLinks.map((link) => (
                <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{link.label || link.platform}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] border ${link.enabled ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500'}`}>
                        {link.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate max-w-sm sm:max-w-md">{link.url}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSocial(link)
                        setIsSocialModalOpen(true)
                      }}
                      className="p-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialDeleteId(link.id)}
                      className="p-1.5 rounded-md border border-dashed border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SEO */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSeo} className="space-y-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Search Engine Optimization (SEO)</h2>
              <p className="text-[11px] text-neutral-500">Configure global metadata tags, search rankings, and social card previews.</p>
            </div>
            <button
              type="submit"
              disabled={isPending || seoLoading}
              className="px-3.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save SEO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Site Title</label>
              <input
                type="text"
                required
                value={seoForm.siteTitle}
                onChange={(e) => setSeoForm({ ...seoForm, siteTitle: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Meta Description</label>
              <textarea
                rows={3}
                required
                value={seoForm.description}
                onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none resize-y"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Keywords (comma separated)</label>
              <input
                type="text"
                value={seoForm.keywords}
                onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Robots Meta</label>
              <input
                type="text"
                value={seoForm.robots}
                onChange={(e) => setSeoForm({ ...seoForm, robots: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Open Graph Image (Social Card URL)</label>
              <input
                type="text"
                value={seoForm.ogImage}
                onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                placeholder="e.g. /banner.png"
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: THEME */}
      {activeTab === 'theme' && (
        <div className="space-y-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-white dark:bg-neutral-950">
          <div className="border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">GitHub Graph Color Palette</h2>
            <p className="text-[11px] text-neutral-500">Choose the active contribution grid theme for your portfolio overview.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRESET_THEMES.map((preset) => {
              const isSelected =
                githubTheme?.dark?.level4 === preset.dark.level4 &&
                githubTheme?.light?.level4 === preset.light.level4
              return (
                <div
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-4 rounded-md border border-dashed transition-all cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900'
                      : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{preset.name}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  {/* Swatches preview */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400 w-10">Light</span>
                      {Object.values(preset.light).map((color, i) => (
                        <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400 w-10">Dark</span>
                      {Object.values(preset.dark).map((color, i) => (
                        <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordChange} className="space-y-6 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-white dark:bg-neutral-950 max-w-xl">
          <div className="border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Change Admin Password</h2>
            <p className="text-[11px] text-neutral-500">Update the credentials required to log into the Nikhil CMS dashboard.</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Admin Name</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Update Password</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Social Modal */}
      {isSocialModalOpen && editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 w-full max-w-md space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {editingSocial.id ? 'Edit Social Link' : 'Add Social Link'}
            </h3>

            <form onSubmit={handleSaveSocial} className="space-y-3">
              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Platform</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GitHub, Twitter, LinkedIn"
                  value={editingSocial.platform}
                  onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Display Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. github.com/username"
                  value={editingSocial.label}
                  onChange={(e) => setEditingSocial({ ...editingSocial, label: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Destination URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingSocial.url}
                  onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="socialEnabled"
                  checked={editingSocial.enabled}
                  onChange={(e) => setEditingSocial({ ...editingSocial, enabled: e.target.checked })}
                  className="rounded border-neutral-300 dark:border-neutral-700"
                />
                <label htmlFor="socialEnabled" className="text-neutral-700 dark:text-neutral-300 text-xs">
                  Active (Show on portfolio)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsSocialModalOpen(false)
                    setEditingSocial(null)
                  }}
                  className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-xs cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Social Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(socialDeleteId)}
        title="Delete Social Link"
        description="Are you sure you want to remove this social platform link from your portfolio?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={handleDeleteSocial}
        onCancel={() => setSocialDeleteId(null)}
      />
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-neutral-400">Loading Configuration Hub...</div>}>
      <SettingsContent />
    </Suspense>
  )
}
