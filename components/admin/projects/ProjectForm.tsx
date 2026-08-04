'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle,
  Star,
  GitFork,
  ArrowUpRight,
  Sparkles,
  Code2,
  AlertCircle,
  Cpu,
  Loader2,
  Trash2
} from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import MarkdownEditor from '@/components/admin/ui/MarkdownEditor'
import MediaUploader from '@/components/admin/ui/MediaUploader'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'
import { createProjectAction, updateProjectAction, softDeleteProjectAction } from '@/actions/projects'
import { Project, ProjectStatus } from '@prisma/client'

export interface ProjectFormProps {
  initialData?: Partial<Project>
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
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '')
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(initialData?.tags)
      ? (initialData?.tags as string[]).join(', ')
      : typeof initialData?.tags === 'string'
      ? (JSON.parse(initialData.tags) as string[]).join(', ')
      : ''
  )
  const [architectureInput, setArchitectureInput] = useState(
    Array.isArray(initialData?.architecture)
      ? (initialData?.architecture as string[]).join('\n')
      : typeof initialData?.architecture === 'string'
      ? (JSON.parse(initialData.architecture) as string[]).join('\n')
      : ''
  )
  const [coreProblem, setCoreProblem] = useState(initialData?.coreProblem || '')
  const [highlightsInput, setHighlightsInput] = useState(
    Array.isArray(initialData?.highlights)
      ? (initialData?.highlights as string[]).join('\n')
      : typeof initialData?.highlights === 'string'
      ? (JSON.parse(initialData.highlights) as string[]).join('\n')
      : ''
  )
  const [codeSnippetFilename, setCodeSnippetFilename] = useState(initialData?.codeSnippetFilename || '')
  const [codeSnippetCode, setCodeSnippetCode] = useState(initialData?.codeSnippetCode || '')
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || '')
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || '')
  const [stars, setStars] = useState<number>(initialData?.stars || 0)
  const [forks, setForks] = useState<number>(initialData?.forks || 0)
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status || ProjectStatus.DRAFT)
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false)
  const [order, setOrder] = useState<number>(initialData?.order || 0)
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '')

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

  const parsedArchitecture = architectureInput
    .split('\n')
    .map((a) => a.trim())
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
        thumbnail,
        tags: parsedTags,
        architecture: parsedArchitecture,
        coreProblem,
        highlights: parsedHighlights,
        codeSnippetFilename,
        codeSnippetCode,
        githubUrl,
        liveUrl,
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
              Live Preview updates in real-time as you edit draft fields.
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
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-5">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Universal App Opener"
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
                  placeholder="universal-app-opener"
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
                  placeholder="Cross-platform URL routing engine..."
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
                    placeholder="Nov 2025 – Present"
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
                <span className="text-[10px] text-zinc-500 font-mono block">Click preset skill to add to project:</span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border border-zinc-800 bg-zinc-950/80">
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
                            setTagsInput(current.filter((t) => t.toLowerCase() !== tech.toLowerCase()).join(', '))
                          } else {
                            setTagsInput(current.length > 0 ? `${current.join(', ')}, ${tech}` : tech)
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

            {/* URLs & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono text-zinc-400 block">GitHub Repository URL</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono text-zinc-400 block">Live Application URL</label>
                <input
                  type="text"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://app.com"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
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

            {/* Core Problem Solved */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-zinc-400 block">Core Problem Solved</label>
              <textarea
                rows={2}
                value={coreProblem}
                onChange={(e) => setCoreProblem(e.target.value)}
                placeholder="Describe the main technical challenge or problem this app solves..."
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Technical Architecture (Line per item) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 block">
                Architecture Breakdown (1 bullet per line)
              </label>
              <textarea
                rows={3}
                value={architectureInput}
                onChange={(e) => setArchitectureInput(e.target.value)}
                placeholder="Client-side Intent Router with latency fallback timers...&#10;Edge Middleware evaluating headers..."
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Key System Highlights */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 block">
                System Highlights (1 bullet per line)
              </label>
              <textarea
                rows={3}
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Sub-50ms fallback redirects when app is missing...&#10;Parses 50k lines of code under 1.2s..."
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Code Snippet Highlight */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-mono font-bold text-white block">
                Featured Code Snippet
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={codeSnippetFilename}
                  onChange={(e) => setCodeSnippetFilename(e.target.value)}
                  placeholder="Filename (e.g. deepLinkRouter.ts)"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                />
                <textarea
                  rows={4}
                  value={codeSnippetCode}
                  onChange={(e) => setCodeSnippetCode(e.target.value)}
                  placeholder="Paste highlighted code snippet here..."
                  className="w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-zinc-500 leading-relaxed"
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

            {/* Reusing exact Portfolio Card & Case Study Components */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 space-y-6 shadow-2xl overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-zinc-800">
              {/* Preview 1: Portfolio Section Card */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  1. Home Page Card View
                </span>
                <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-zinc-100 font-mono">
                          {title || 'Project Title Placeholder'}
                        </h3>
                        {stars > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400">
                            <Star className="w-3 h-3 text-zinc-400" />
                            {stars}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {description || 'Short project description placeholder will render here.'}
                      </p>
                    </div>
                    <div className="p-1.5 rounded-lg text-zinc-400 bg-zinc-800">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60">
                    {parsedTags.length > 0 ? (
                      parsedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-600">Tags will display here</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview 2: Full Case Study Header View */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  2. Detailed Case Study View (/projects/{slug || 'slug'})
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold font-mono text-white">
                      {title || 'Project Title'}
                    </h2>
                    <div className="flex items-center gap-2">
                      {githubUrl && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
                          <IconBrandGithub className="w-3 h-3" /> Repo
                        </span>
                      )}
                      {liveUrl && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white text-zinc-950 font-medium flex items-center gap-1">
                          Live App <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {subtitle || description}
                  </p>

                  {coreProblem && (
                    <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px] mb-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Core Problem Solved</span>
                      </div>
                      {coreProblem}
                    </div>
                  )}

                  {parsedArchitecture.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Technical Architecture Breakdown</span>
                      </div>
                      {parsedArchitecture.map((arch, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-300 flex items-start gap-2">
                          <span className="font-mono font-bold text-zinc-500 text-[10px]">0{idx + 1}</span>
                          <span>{arch}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {codeSnippetCode && (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                      <div className="text-[10px] text-zinc-500 pb-1 border-b border-zinc-800 mb-2">
                        {codeSnippetFilename || 'codeSnippet.ts'}
                      </div>
                      <pre className="whitespace-pre">{codeSnippetCode}</pre>
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
