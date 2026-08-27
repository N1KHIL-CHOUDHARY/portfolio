'use client'

import React, { useState, useEffect, useTransition, useMemo } from 'react'
import {
  GitPullRequest,
  GitMerge,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  Search,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  GitFork,
  FolderGit2,
} from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import {
  fetchOpenSourceContributionsAction,
  createOpenSourceContributionAction,
  updateOpenSourceContributionAction,
  deleteOpenSourceContributionAction,
  reorderOpenSourceContributionsAction,
  seedOpenSourceContributionsAction,
  OpenSourceFormInput,
} from '@/actions/opensource'

interface OpenSourceItem {
  id: string
  title: string
  number: number
  url: string
  repo: string
  repoUrl?: string | null
  status: 'MERGED' | 'OPEN'
  mergedAt?: string | null
  description?: string | null
  additions: number
  deletions: number
  order: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

const REPO_SUGGESTIONS = [
  'vercel/next.js',
  'tailwindlabs/tailwindcss',
  'prisma/prisma',
  'facebook/react',
  'shadcn-ui/ui',
  'nodejs/node',
]

export default function AdminOpenSourcePage() {
  const [items, setItems] = useState<OpenSourceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [number, setNumber] = useState<number | ''>('')
  const [url, setUrl] = useState('')
  const [repo, setRepo] = useState('vercel/next.js')
  const [repoUrl, setRepoUrl] = useState('')
  const [status, setStatus] = useState<'MERGED' | 'OPEN'>('MERGED')
  const [mergedAt, setMergedAt] = useState('')
  const [description, setDescription] = useState('')
  const [additions, setAdditions] = useState<number | ''>(0)
  const [deletions, setDeletions] = useState<number | ''>(0)
  const [order, setOrder] = useState<number>(0)
  const [featured, setFeatured] = useState(false)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MERGED' | 'OPEN'>('ALL')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const res = await fetchOpenSourceContributionsAction()
      if (res.success && res.items) {
        setItems(res.items as OpenSourceItem[])
      }
    } catch {
      toast.error('Failed to load contributions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openModal = (item?: OpenSourceItem) => {
    if (item) {
      setEditingId(item.id)
      setTitle(item.title)
      setNumber(item.number)
      setUrl(item.url)
      setRepo(item.repo)
      setRepoUrl(item.repoUrl || '')
      setStatus(item.status)
      setMergedAt(item.mergedAt || '')
      setDescription(item.description || '')
      setAdditions(item.additions)
      setDeletions(item.deletions)
      setOrder(item.order)
      setFeatured(item.featured)
    } else {
      setEditingId(null)
      setTitle('')
      setNumber('')
      setUrl('')
      setRepo('vercel/next.js')
      setRepoUrl('')
      setStatus('MERGED')
      setMergedAt('')
      setDescription('')
      setAdditions(0)
      setDeletions(0)
      const maxOrder = items.reduce((max, i) => Math.max(max, i.order), -1)
      setOrder(maxOrder + 1)
      setFeatured(false)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !number || !url.trim() || !repo.trim()) {
      toast.error('Please fill in title, PR number, URL, and repository!')
      return
    }

    startTransition(async () => {
      try {
        const payload: OpenSourceFormInput = {
          title: title.trim(),
          number: Number(number),
          url: url.trim(),
          repo: repo.trim(),
          repoUrl: repoUrl.trim() || `https://github.com/${repo.trim()}`,
          status,
          mergedAt: mergedAt.trim() || undefined,
          description: description.trim() || undefined,
          additions: Number(additions || 0),
          deletions: Number(deletions || 0),
          order: Number(order || 0),
          featured,
        }

        let res
        if (editingId) {
          res = await updateOpenSourceContributionAction(editingId, payload)
        } else {
          res = await createOpenSourceContributionAction(payload)
        }

        if (res.success) {
          toast.success(editingId ? 'Contribution updated' : 'Contribution added')
          setIsModalOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Failed to save contribution')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save contribution')
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteOpenSourceContributionAction(id)
        if (res.success) {
          toast.success('Contribution removed')
          setDeleteTargetId(null)
          loadData()
        } else {
          toast.error(res.error || 'Failed to delete contribution')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete contribution')
      }
    })
  }

  const handleMoveOrder = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const temp = newItems[index].order
    newItems[index].order = newItems[targetIndex].order
    newItems[targetIndex].order = temp

    startTransition(async () => {
      try {
        const res = await reorderOpenSourceContributionsAction([
          { id: newItems[index].id, order: newItems[index].order },
          { id: newItems[targetIndex].id, order: newItems[targetIndex].order },
        ])
        if (res.success) {
          toast.success('Order updated')
          loadData()
        }
      } catch {
        toast.error('Failed to reorder')
      }
    })
  }

  const handleSeed = () => {
    startTransition(async () => {
      try {
        const res = await seedOpenSourceContributionsAction()
        if (res.success) {
          toast.success(`Seeded ${res.count} sample open source contributions!`)
          loadData()
        } else {
          toast.error(res.error || 'Failed to seed')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to seed')
      }
    })
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.number).includes(searchQuery)

      if (!matchesSearch) return false

      if (statusFilter === 'MERGED') return item.status === 'MERGED'
      if (statusFilter === 'OPEN') return item.status === 'OPEN'
      return true
    })
  }, [items, searchQuery, statusFilter])

  const mergedCount = useMemo(() => items.filter((i) => i.status === 'MERGED').length, [items])
  const openCount = useMemo(() => items.filter((i) => i.status === 'OPEN').length, [items])
  const totalAdditions = useMemo(() => items.reduce((sum, i) => sum + (i.additions || 0), 0), [items])
  const totalDeletions = useMemo(() => items.reduce((sum, i) => sum + (i.deletions || 0), 0), [items])

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Open Source CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage your open-source PRs, repo links, and diff metrics for the blueprint portfolio timeline.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {items.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Seed Initial Data</span>
            </button>
          )}

          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contribution</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total PRs */}
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-1">
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-500" />
            Total Tracked
          </div>
          <div className="text-xl font-bold font-mono text-white">{items.length} PRs</div>
        </div>

        {/* Merged */}
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-1">
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <GitMerge className="w-3.5 h-3.5 text-purple-400" />
            Merged PRs
          </div>
          <div className="text-xl font-bold font-mono text-purple-400">{mergedCount}</div>
        </div>

        {/* Open */}
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-1">
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
            Open PRs
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">{openCount}</div>
        </div>

        {/* Code Diff Impact */}
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-1">
          <div className="text-[11px] font-mono text-zinc-400">Total Code Diff</div>
          <div className="text-xs font-mono font-bold pt-1 flex items-center gap-2">
            <span className="text-emerald-400">+{totalAdditions}</span>
            <span className="text-rose-400">-{totalDeletions}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl shrink-0 font-mono text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'ALL'
                ? 'bg-zinc-800 text-white font-semibold shadow-xs border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setStatusFilter('MERGED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'MERGED'
                ? 'bg-zinc-800 text-purple-300 font-semibold shadow-xs border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Merged ({mergedCount})
          </button>
          <button
            onClick={() => setStatusFilter('OPEN')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'OPEN'
                ? 'bg-zinc-800 text-emerald-300 font-semibold shadow-xs border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Open ({openCount})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repo, title, or PR #..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-800/80 rounded-2xl bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3.5 w-14 text-center">Index</th>
                <th className="p-3.5 w-48">Repository</th>
                <th className="p-3.5">Pull Request</th>
                <th className="p-3.5 w-28 text-center">Status</th>
                <th className="p-3.5 w-28 text-center">Diff</th>
                <th className="p-3.5 w-32 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-3.5 text-center">
                      <div className="w-6 h-4 bg-zinc-800 rounded mx-auto" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-4 bg-zinc-800/60 rounded w-28" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-4 bg-zinc-800/60 rounded w-3/4" />
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="w-12 h-4 bg-zinc-800 rounded mx-auto" />
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="w-16 h-4 bg-zinc-800 rounded mx-auto" />
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="w-16 h-4 bg-zinc-800 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500 font-mono">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <GitFork className="w-8 h-8 text-zinc-600 stroke-[1.5]" />
                      <p className="text-xs">No open source contributions found.</p>
                      {items.length === 0 && (
                        <button
                          onClick={handleSeed}
                          className="mt-2 text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Click here to seed sample contributions</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Index */}
                    <td className="p-3.5 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
                        #{item.order}
                      </span>
                    </td>

                    {/* Repo */}
                    <td className="p-3.5 font-mono">
                      <a
                        href={item.repoUrl || `https://github.com/${item.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-zinc-200 font-semibold hover:underline"
                      >
                        <IconBrandGithub className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.repo}</span>
                      </a>
                    </td>

                    {/* PR Title & Number */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-300">
                            #{item.number}
                          </span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-xs text-zinc-200 hover:text-white hover:underline flex items-center gap-1"
                          >
                            <span className="line-clamp-1">{item.title}</span>
                            <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                          </a>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center font-mono">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                          item.status === 'MERGED'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {item.status === 'MERGED' ? (
                          <GitMerge className="w-2.5 h-2.5" />
                        ) : (
                          <GitPullRequest className="w-2.5 h-2.5" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Diff */}
                    <td className="p-3.5 text-center font-mono text-[11px]">
                      <span className="text-emerald-400 font-medium">+{item.additions}</span>{' '}
                      <span className="text-rose-400 font-medium">-{item.deletions}</span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right font-mono">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          disabled={idx === 0 || isPending}
                          onClick={() => handleMoveOrder(idx, 'UP')}
                          title="Move Up"
                          className="p-1.5 rounded-lg bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === filteredItems.length - 1 || isPending}
                          onClick={() => handleMoveOrder(idx, 'DOWN')}
                          title="Move Down"
                          className="p-1.5 rounded-lg bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openModal(item)}
                          title="Edit"
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/60 font-mono text-xs text-zinc-400 flex items-center justify-between">
          <div>
            Showing <span className="text-zinc-200">{filteredItems.length}</span> of{' '}
            <span className="text-zinc-200">{items.length}</span> contributions
          </div>
        </div>
      </div>

      {/* Single Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-purple-400" />
                <span>{editingId ? 'Edit Contribution' : 'Add Open Source PR'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              {/* Repository */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-semibold">Repository (owner/repo) *</label>
                <input
                  type="text"
                  required
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="e.g. vercel/next.js"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {REPO_SUGGESTIONS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRepo(preset)}
                      className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                        repo === preset
                          ? 'border-purple-500/50 bg-purple-950/40 text-purple-300'
                          : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* PR Number & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block font-semibold">PR Number *</label>
                  <input
                    type="number"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 64210"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block font-semibold">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'MERGED' | 'OPEN')}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="MERGED">MERGED</option>
                    <option value="OPEN">OPEN</option>
                  </select>
                </div>
              </div>

              {/* PR Title */}
              <div className="space-y-1">
                <label className="text-zinc-400 block font-semibold">PR Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. fix(router): prevent state de-synchronization during parallel route transitions"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* PR URL */}
              <div className="space-y-1">
                <label className="text-zinc-400 block font-semibold">PR Link / URL *</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/vercel/next.js/pull/64210"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Merged / Created Date */}
              <div className="space-y-1">
                <label className="text-zinc-400 block">Date Label (e.g. "Mar 2026")</label>
                <input
                  type="text"
                  value={mergedAt}
                  onChange={(e) => setMergedAt(e.target.value)}
                  placeholder="e.g. Mar 2026"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-zinc-400 block">Description / Summary</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of the issue resolved or feature introduced."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              {/* Additions & Deletions & Order */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-emerald-400 block font-semibold">+ Additions</label>
                  <input
                    type="number"
                    value={additions}
                    onChange={(e) => setAdditions(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-rose-400 block font-semibold">- Deletions</label>
                  <input
                    type="number"
                    value={deletions}
                    onChange={(e) => setDeletions(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block font-semibold">Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-zinc-950 font-bold hover:bg-purple-400 flex items-center gap-1.5 shadow-md"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{editingId ? 'Update PR' : 'Save PR'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {deleteTargetId && (
        <ConfirmDialog
          isOpen={Boolean(deleteTargetId)}
          title="Delete Open Source Contribution"
          description="Are you sure you want to remove this contribution from your portfolio? It will be moved to trash."
          confirmText="Delete Contribution"
          isDestructive={true}
          isLoading={isPending}
          onConfirm={() => handleDelete(deleteTargetId)}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  )
}
