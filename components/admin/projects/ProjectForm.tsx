'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  Star,
  ArrowUpRight,
  AlertCircle,
  Cpu,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Video,
  Globe,
  Newspaper,
} from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import MarkdownEditor from '@/components/admin/ui/MarkdownEditor'
import MediaUploader from '@/components/admin/ui/MediaUploader'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import { toast } from 'sonner'
import { slugify, normalizeMediaPath } from '@/lib/utils'
import { createProjectAction, updateProjectAction } from '@/actions/projects'
import { Project, ProjectStatus } from '@prisma/client'

export interface ProjectFormProps {
  initialData?: Partial<Project> & {
    videoUrl?: string | null
    postUrl?: string | null
    showGithub?: boolean | null
    showLive?: boolean | null
    showPost?: boolean | null
  }
  isEditing?: boolean
}

const PRESET_TECH = [
  'Next.js',
  'React',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'Express.js',
  'Python',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Docker',
  'Git',
  'GitHub',
  'Framer Motion',
  'GraphQL',
  'Redis',
  'Upstash',
]

const PROJECT_IMAGE_PRESETS = [
  { name: 'Blueprint Dark UI', url: '/images/project section/image copy 2.png' },
  { name: 'Analytics Dashboard', url: '/images/project section/image copy 3.png' },
  { name: 'Interactive Builder', url: '/images/project section/image copy 4.png' },
  { name: 'Search & AI Engine', url: '/images/project section/image copy 5.png' },
]

export default function ProjectForm({ initialData, isEditing }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [previewTab, setPreviewTab] = useState<'form' | 'split' | 'preview'>('split')

  // Form States
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '')
  const [role, setRole] = useState(initialData?.role || '')
  const [timeline, setTimeline] = useState(initialData?.timeline || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [thumbnail, setThumbnail] = useState(
    initialData?.thumbnail || '/images/project section/image copy 2.png'
  )
  const [backgroundImage, setBackgroundImage] = useState(
    '/images/project section/image copy 5.png'
  )
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(initialData?.tags)
      ? (initialData?.tags as string[]).join(', ')
      : typeof initialData?.tags === 'string'
      ? (JSON.parse(initialData.tags) as string[]).join(', ')
      : 'Next.js, TypeScript, Tailwind CSS'
  )
  const [highlightsInput, setHighlightsInput] = useState(
    Array.isArray(initialData?.highlights)
      ? (initialData?.highlights as string[]).join('\n')
      : typeof initialData?.highlights === 'string'
      ? (JSON.parse(initialData.highlights) as string[]).join('\n')
      : ''
  )
  const [codeSnippetFilename, setCodeSnippetFilename] = useState(
    initialData?.codeSnippetFilename || ''
  )
  const [codeSnippetCode, setCodeSnippetCode] = useState(
    initialData?.codeSnippetCode || ''
  )
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '')
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || '')
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || '')
  const [postUrl, setPostUrl] = useState(initialData?.postUrl || '')
  const [showGithub, setShowGithub] = useState<boolean>(
    initialData?.showGithub ?? true
  )
  const [showLive, setShowLive] = useState<boolean>(
    initialData?.showLive ?? true
  )
  const [showPost, setShowPost] = useState<boolean>(
    initialData?.showPost ?? true
  )
  const [stars, setStars] = useState<number>(initialData?.stars || 0)
  const [forks, setForks] = useState<number>(initialData?.forks || 0)
  const [status, setStatus] = useState<ProjectStatus>(
    initialData?.status || ProjectStatus.PUBLISHED
  )
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false)
  const [order, setOrder] = useState<number>(initialData?.order || 0)
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seoDescription || ''
  )

  // Auto slug generator when title changes in new project
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(slugify(title))
    }
  }, [title, isEditing])

  const parsedTags = tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const parsedHighlights = highlightsInput
    .split('\n')
    .map((h) => h.trim())
    .filter(Boolean)

  const handleSave = (targetStatus?: ProjectStatus) => {
    if (!title || !description) {
      toast.error('Title and Description are required!')
      return
    }

    startTransition(async () => {
      const payload = {
        title,
        slug: slug || slugify(title),
        subtitle,
        role,
        timeline,
        description,
        content,
        thumbnail: normalizeMediaPath(thumbnail),
        videoUrl: normalizeMediaPath(videoUrl),
        tags: parsedTags,
        highlights: parsedHighlights,
        codeSnippetFilename,
        codeSnippetCode,
        githubUrl,
        liveUrl,
        postUrl,
        showGithub,
        showLive,
        showPost,
        stars,
        forks,
        status: targetStatus || status,
        featured,
        order,
        seoTitle,
        seoDescription,
      }

      let res
      if (isEditing && initialData?.id) {
        res = await updateProjectAction(initialData.id, payload)
      } else {
        res = await createProjectAction(payload)
      }

      if (res.success && res.data) {
        toast.success(
          isEditing
            ? `Project updated (${payload.status})`
            : `Project created successfully (${payload.status})`
        )
        router.push('/admin/projects')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save project')
      }
    })
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Action Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              {isEditing ? `Edit Project: ${title || 'Untitled'}` : 'Create New Project'}
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Live Preview updates in real-time as you upload images and edit fields.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl font-mono text-xs">
            <button
              type="button"
              onClick={() => setPreviewTab('form')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                previewTab === 'form' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400'
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('split')}
              className={`hidden lg:inline-flex px-3 py-1 rounded-lg transition-colors ${
                previewTab === 'split' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('preview')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                previewTab === 'preview' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400'
              }`}
            >
              Live Preview
            </button>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave(ProjectStatus.DRAFT)}
            className="px-3.5 py-2 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave(ProjectStatus.PUBLISHED)}
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel */}
        <div
          className={`space-y-6 ${
            previewTab === 'preview'
              ? 'hidden'
              : previewTab === 'split'
              ? 'lg:col-span-6'
              : 'lg:col-span-12'
          }`}
        >
          {/* Main Card: Core Info */}
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-5">
            {/* Main Project Image & Screenshot Upload */}
            <div className="space-y-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Main Project Image (Saved to Next.js Public Folder)</span>
                </label>
                {thumbnail && (
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                    {thumbnail}
                  </span>
                )}
              </div>

              {/* Upload Dropzone */}
              <MediaUploader
                label="Click or drop screenshot to save into public/images/project section/"
                folder="images/project section"
                currentValue={thumbnail}
                onUploadSuccess={(url) => {
                  setThumbnail(url)
                  toast.success('Main image updated!')
                }}
              />

              {/* Quick Preset Selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-zinc-400 font-mono block">
                  Or select existing image from public/images/project section/:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PROJECT_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setThumbnail(preset.url)
                        toast.success(`Selected: ${preset.name}`)
                      }}
                      className={`p-1.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        thumbnail === preset.url
                          ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                      }`}
                    >
                      <div className="h-14 w-full relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                        <Image
                          src={preset.url}
                          alt={preset.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-300 truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual URL Input */}
              <div className="pt-2">
                <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                  Custom image path or URL:
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="/images/project section/image copy 2.png"
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* Video Demo Showcase Upload */}
            <div className="space-y-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Project Showcase Video (Saved to /public/uploads)</span>
                </label>
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="text-[10px] font-mono text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Video
                  </button>
                )}
              </div>

              <MediaUploader
                label="Click or drop demo video (mp4, webm) to save into public/uploads/"
                folder="uploads"
                accept="video/mp4,video/webm,video/*"
                helperText="MP4, WEBM (video/mp4, video/webm) • Saved directly into Next.js public/uploads directory"
                currentValue={videoUrl}
                onUploadSuccess={(url) => {
                  setVideoUrl(normalizeMediaPath(url))
                  toast.success('Project showcase video uploaded!')
                }}
              />

              <div className="pt-1">
                <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                  Custom video path or URL (e.g. /uploads/project-demo.mp4):
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setVideoUrl(normalizeMediaPath(e.target.value))
                    }
                  }}
                  placeholder="/uploads/project-demo.mp4"
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VengenceUI"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="vengenceui"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* Subtitle & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="AI UI builder and component library..."
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">Role & Timeline</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Creator & Lead"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="2025 – Present"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 block">Short Description *</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief high-level summary shown on project cards..."
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-sans text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 block">
                Tech Stack Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Next.js, TypeScript, Tailwind CSS, Redis"
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />

              {/* Preset Skill Quick Toggle Badges */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-zinc-500 font-mono block">
                  Click preset skill to toggle:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl border border-zinc-800 bg-zinc-950/80">
                  {PRESET_TECH.map((tech) => {
                    const isSelected = tagsInput
                      .split(',')
                      .map((t) => t.trim().toLowerCase())
                      .includes(tech.toLowerCase())

                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => {
                          const current = tagsInput
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean)

                          if (isSelected) {
                            setTagsInput(
                              current
                                .filter((t) => t.toLowerCase() !== tech.toLowerCase())
                                .join(', ')
                            )
                          } else {
                            setTagsInput(
                              current.length > 0 ? `${current.join(', ')}, ${tech}` : tech
                            )
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all select-none ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-bold'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Action Links & Visibility Toggles */}
            <div className="space-y-4 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-white">
                  Action Links &amp; Visibility Controls
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  Toggle buttons on the Case Study page
                </span>
              </div>

              {/* GitHub Link */}
              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconBrandGithub className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-300 font-medium">
                      GitHub Repository
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[11px] font-mono text-zinc-400">Show Button:</span>
                    <input
                      type="checkbox"
                      checked={showGithub}
                      onChange={(e) => setShowGithub(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer accent-emerald-500"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Live Link */}
              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-300 font-medium">
                      Visit Live App
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[11px] font-mono text-zinc-400">Show Button:</span>
                    <input
                      type="checkbox"
                      checked={showLive}
                      onChange={(e) => setShowLive(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer accent-emerald-500"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://app.com"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Post / Article Link */}
              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-300 font-medium">
                      Article / Blog Post
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[11px] font-mono text-zinc-400">Show Button:</span>
                    <input
                      type="checkbox"
                      checked={showPost}
                      onChange={(e) => setShowPost(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer accent-emerald-500"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://medium.com/@... or https://blog.com/..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* Status, Featured & Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">Publish Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                >
                  <option value={ProjectStatus.DRAFT}>Draft</option>
                  <option value={ProjectStatus.PUBLISHED}>Published</option>
                  <option value={ProjectStatus.ARCHIVED}>Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">Featured Project</label>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-medium transition-colors border ${
                    featured
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {featured ? '★ Featured on Home' : 'Normal Item'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* Markdown Content */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-mono font-bold text-white block">
                Full Case Study Content (Markdown)
              </label>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Write full case study markdown details..."
              />
            </div>
          </div>
        </div>

        {/* Live Preview Panel Right */}
        <div
          className={`space-y-4 ${
            previewTab === 'form'
              ? 'hidden'
              : previewTab === 'split'
              ? 'lg:col-span-6'
              : 'lg:col-span-12'
          }`}
        >
          <div className="sticky top-20 space-y-4">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white uppercase tracking-wider">
                  Live Portfolio Preview
                </span>
              </div>
              <StatusBadge status={status} />
            </div>

            {/* Blueprint Live Card Preview */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-black text-zinc-100 space-y-6 shadow-2xl overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-zinc-800">
              {/* Preview 1: Ambient Blueprint Project Card */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  1. Home & /projects Card Preview
                </span>

                <div className="rounded-xl border border-neutral-800 p-3 bg-black space-y-3">
                  {/* Ambient + Screenshot Frame */}
                  <div className="rounded-[12px] border border-neutral-800 p-[4px] bg-neutral-900/50">
                    <div className="relative h-[190px] w-full overflow-hidden rounded-[8px] border border-neutral-800 bg-neutral-900">
                      {/* Ambient background */}
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-80 scale-105"
                        style={{
                          backgroundImage: `url('${backgroundImage}')`,
                        }}
                      />

                      {/* View Project text */}
                      <span className="absolute top-2 left-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        View Project
                      </span>

                      {/* Floating Screenshot Preview */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[82%] h-[74%] rounded-t-[6px] bg-neutral-950 p-[2px] pb-0 shadow-2xl border-x border-t border-neutral-800">
                        <div className="size-full relative overflow-hidden rounded-t-[4px]">
                          <Image
                            src={thumbnail || '/images/project section/image copy 2.png'}
                            alt={title || 'Project Preview'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="space-y-1.5 px-1">
                    <h3 className="text-base font-bold font-mono text-neutral-100">
                      {title || 'Project Title'}
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                      {description || 'Short project description placeholder.'}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-2 border-t border-dashed border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-neutral-200">
                      View Details ↗
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      /projects/{slug || 'slug'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview 2: Detailed Case Study Preview */}
              <div className="space-y-4 pt-4 border-t border-dashed border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  2. Case Study Page Preview (/projects/{slug || 'slug'})
                </span>

                <div className="space-y-4 font-mono">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">&larr;</span>
                    <h2 className="text-base font-bold text-white">
                      {title || 'Project Title'}
                    </h2>
                  </div>

                  {/* Video / Showcase Media */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-zinc-500 font-mono">Live</span>
                    <div className="relative w-full rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                      {videoUrl ? (
                        <video
                          src={videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls
                          className="w-full h-auto object-cover max-h-[260px]"
                        />
                      ) : (
                        <div className="relative w-full h-44 bg-zinc-900">
                          <Image
                            src={thumbnail || '/images/project section/image copy 2.png'}
                            alt={title || 'Project Preview'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Centered 3-Button Action Bar */}
                  <div className="flex flex-wrap items-center justify-center gap-2 py-1">
                    {showGithub && githubUrl && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-zinc-700 bg-zinc-900 text-zinc-200">
                        <IconBrandGithub className="w-3.5 h-3.5" />
                        <span>Github</span>
                      </span>
                    )}

                    {showLive && liveUrl && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-white text-zinc-950 shadow-sm">
                        <span>Visit Live</span>
                        <Globe className="w-3.5 h-3.5" />
                      </span>
                    )}

                    {showPost && postUrl && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-zinc-700 bg-zinc-900 text-zinc-200">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Post</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="text-xs text-zinc-300 font-sans space-y-2 pt-2">
                    <p>{description || 'Project description summary...'}</p>
                  </div>

                  {/* Stack */}
                  {parsedTags.length > 0 && (
                    <div className="pt-3 border-t border-dashed border-zinc-800 space-y-2">
                      <span className="text-xs font-bold font-mono text-white block">
                        Stack used
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
