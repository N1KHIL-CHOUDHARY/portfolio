'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { User, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { fetchAboutAction, updateAboutAction } from '@/actions/about'
import MarkdownEditor from '@/components/admin/ui/MarkdownEditor'
import MediaUploader from '@/components/admin/ui/MediaUploader'

export default function AdminAboutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [yearsExperience, setYearsExperience] = useState(4)
  const [projectsCompleted, setProjectsCompleted] = useState(18)
  const [githubContributions, setGithubContributions] = useState(1420)

  useEffect(() => {
    async function loadAbout() {
      setIsLoading(true)
      try {
        const res = await fetchAboutAction()
        if (res.success && res.data) {
          const d = res.data
          setContent(d.content || '')
          setImage(d.image || '')
          setYearsExperience(d.yearsExperience || 4)
          setProjectsCompleted(d.projectsCompleted || 18)
          setGithubContributions(d.githubContributions || 1420)
        }
      } catch {
        toast.error('Failed to load about section')
      } finally {
        setIsLoading(false)
      }
    }
    loadAbout()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateAboutAction({
        content,
        image,
        yearsExperience,
        projectsCompleted,
        githubContributions,
      })

      if (res.success) {
        toast.success('About section updated successfully!')
      } else {
        toast.error(res.error || 'Failed to update about section')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
        Loading About Settings...
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              About Section CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Edit your background markdown story and key milestone counters.
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
        {/* Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-1.5">
            <label className="text-zinc-400 block">Years of Experience</label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(Number(e.target.value))}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-lg font-bold"
            />
          </div>

          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-1.5">
            <label className="text-zinc-400 block">Projects Completed</label>
            <input
              type="number"
              value={projectsCompleted}
              onChange={(e) => setProjectsCompleted(Number(e.target.value))}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-lg font-bold"
            />
          </div>

          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-1.5">
            <label className="text-zinc-400 block">GitHub Contributions</label>
            <input
              type="number"
              value={githubContributions}
              onChange={(e) => setGithubContributions(Number(e.target.value))}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-lg font-bold"
            />
          </div>
        </div>

        {/* Markdown Content */}
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-4">
          <label className="text-zinc-300 font-bold block text-sm">About Me Bio (Markdown)</label>
          <MarkdownEditor value={content} onChange={setContent} rows={10} />

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-zinc-400 block">Bio Photo / Image</label>
            <MediaUploader onUploadSuccess={(url) => setImage(url)} label="Upload Bio Image" />
          </div>
        </div>
      </form>
    </div>
  )
}
