'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Globe, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { fetchSeoAction, updateSeoAction } from '@/actions/seo'
import MediaUploader from '@/components/admin/ui/MediaUploader'

export default function AdminSeoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [siteTitle, setSiteTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [twitterImage, setTwitterImage] = useState('')
  const [robots, setRobots] = useState('index, follow')
  const [canonicalUrl, setCanonicalUrl] = useState('')

  useEffect(() => {
    async function loadSeo() {
      setIsLoading(true)
      try {
        const res = await fetchSeoAction()
        if (res.success && res.data) {
          const d = res.data
          setSiteTitle(d.siteTitle || '')
          setDescription(d.description || '')
          setKeywords(d.keywords || '')
          setOgImage(d.ogImage || '')
          setTwitterImage(d.twitterImage || '')
          setRobots(d.robots || 'index, follow')
          setCanonicalUrl(d.canonicalUrl || '')
        }
      } catch {
        toast.error('Failed to load SEO settings')
      } finally {
        setIsLoading(false)
      }
    }
    loadSeo()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateSeoAction({
        siteTitle,
        description,
        keywords,
        ogImage,
        twitterImage,
        robots,
        canonicalUrl,
      })

      if (res.success) {
        toast.success('SEO settings updated successfully!')
      } else {
        toast.error(res.error || 'Failed to update SEO settings')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
        Loading SEO Settings...
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              SEO & Metadata CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Global search engine optimization settings, OpenGraph social sharing images, and canonical URL directives.
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
          <div className="space-y-1.5">
            <label className="text-zinc-400 block">Default Site Title *</label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="Nikhil — Senior Full-Stack Engineer Portfolio"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 block">Default Meta Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Senior Full-Stack Engineer specializing in Next.js, React, TypeScript..."
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 block">Keywords (Comma separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Nikhil, Next.js 16, React 19, TypeScript, Portfolio, Systems Architect"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Robots Directives</label>
              <input
                type="text"
                value={robots}
                onChange={(e) => setRobots(e.target.value)}
                placeholder="index, follow"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Canonical Base URL</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://nikhilchoudhary.dev"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-zinc-400 block">OpenGraph / Social Banner Image (1200x630)</label>
            <MediaUploader onUploadSuccess={(url) => setOgImage(url)} label="Upload OpenGraph Image" />
            {ogImage && <div className="text-[11px] text-emerald-400 truncate">Current OG Image: {ogImage}</div>}
          </div>
        </div>
      </form>
    </div>
  )
}
