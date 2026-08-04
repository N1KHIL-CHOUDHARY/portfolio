'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Sparkles, Save, CheckCircle2, Loader2, User, Mail, MapPin, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { fetchHeroAction, updateHeroAction } from '@/actions/hero'
import MediaUploader from '@/components/admin/ui/MediaUploader'

export default function AdminHeroPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState('')
  const [headline, setHeadline] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [location, setLocation] = useState('')
  const [availability, setAvailability] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [shortBio, setShortBio] = useState('')

  useEffect(() => {
    async function loadHero() {
      setIsLoading(true)
      try {
        const res = await fetchHeroAction()
        if (res.success && res.data) {
          const d = res.data
          setName(d.name || '')
          setHeadline(d.headline || '')
          setSubtitle(d.subtitle || '')
          setLocation(d.location || '')
          setAvailability(d.availability || '')
          setProfileImage(d.profileImage || '')
          setResumeUrl(d.resumeUrl || '')
          setEmail(d.email || '')
          setPhone(d.phone || '')
          setShortBio(d.shortBio || '')
        }
      } catch {
        toast.error('Failed to load hero section')
      } finally {
        setIsLoading(false)
      }
    }
    loadHero()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateHeroAction({
        name,
        headline,
        subtitle,
        location,
        availability,
        profileImage,
        resumeUrl,
        email,
        phone,
        shortBio,
      })

      if (res.success) {
        toast.success('Hero section updated successfully!')
      } else {
        toast.error(res.error || 'Failed to update hero section')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
        Loading Hero Settings...
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Hero Section CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Edit your primary headline, availability status, profile image, and call-to-action details.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nikhil Choudhary"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Headline / Role Title *</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Full-Stack & Systems Architect"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 block">Subtitle / Catchphrase</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Building high-throughput web architectures..."
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="India / San Francisco"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Availability Badge Status</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Available for high-impact roles"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nikhil@example.com"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Resume File URL</label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="/uploads/resume.pdf or https://..."
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 block">Short Bio</label>
            <textarea
              rows={3}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="Brief executive summary..."
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-zinc-400 block">Profile Image / Avatar</label>
            <MediaUploader onUploadSuccess={(url) => setProfileImage(url)} label="Upload Avatar Image" />
            {profileImage && (
              <div className="text-[11px] text-emerald-400 truncate pt-1">
                Current avatar: {profileImage}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
