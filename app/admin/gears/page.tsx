'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Wrench, ExternalLink, CheckCircle2, Loader2, X, Laptop } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { fetchGearsAction, createGearAction, updateGearAction, softDeleteGearAction } from '@/actions/gears'
export interface Gear {
  id: string
  title: string
  subtitle?: string | null
  category: string
  link: string
  description?: string | null
  tags?: any
  specs?: any
  order: number
  createdBy?: string | null
  updatedBy?: string | null
  deletedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export default function AdminGearsPage() {
  const [items, setItems] = useState<Gear[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form State
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('Computer')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [specsInput, setSpecsInput] = useState('')
  const [order, setOrder] = useState(0)

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const res = await fetchGearsAction()
      if (res.success && res.items) {
        setItems(res.items as Gear[])
      }
    } catch {
      toast.error('Failed to load gears')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const openModal = (item?: Gear) => {
    if (item) {
      setEditingId(item.id)
      setTitle(item.title)
      setSubtitle(item.subtitle || '')
      setCategory(item.category)
      setLink(item.link)
      setDescription(item.description || '')
      setTagsInput(
        Array.isArray(item.tags)
          ? (item.tags as string[]).join(', ')
          : typeof item.tags === 'string'
          ? (JSON.parse(item.tags) as string[]).join(', ')
          : ''
      )
      const rawSpecs = Array.isArray(item.specs)
        ? (item.specs as { label: string; value: string }[])
        : typeof item.specs === 'string'
        ? (JSON.parse(item.specs) as { label: string; value: string }[])
        : []
      setSpecsInput(rawSpecs.map((s) => `${s.label}: ${s.value}`).join('\n'))
      setOrder(item.order)
    } else {
      setEditingId(null)
      setTitle('')
      setSubtitle('')
      setCategory('Computer')
      setLink('')
      setDescription('')
      setTagsInput('')
      setSpecsInput('')
      setOrder(items.length + 1)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !category || !link) {
      toast.error('Title, Category, and Product Link are required!')
      return
    }

    startTransition(async () => {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      const specs = specsInput
        .split('\n')
        .map((line) => {
          const idx = line.indexOf(':')
          if (idx > -1) {
            return {
              label: line.slice(0, idx).trim(),
              value: line.slice(idx + 1).trim(),
            }
          }
          return null
        })
        .filter(Boolean)

      const payload = {
        title,
        subtitle,
        category,
        link,
        description,
        tags,
        specs,
        order,
      }

      let res
      if (editingId) {
        res = await updateGearAction(editingId, payload)
      } else {
        res = await createGearAction(payload)
      }

      if (res.success) {
        toast.success(editingId ? 'Gear updated' : 'Gear created')
        setIsModalOpen(false)
        loadItems()
      } else {
        toast.error(res.error || 'Failed to save gear')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      const res = await softDeleteGearAction(id)
      if (res.success) {
        toast.success('Gear deleted')
        setDeleteTargetId(null)
        loadItems()
      } else {
        toast.error(res.error || 'Failed to delete gear')
      }
    })
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Gear>[] = [
    {
      key: 'title',
      header: 'Title & Category',
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-mono font-bold text-white text-xs">{item.title}</div>
          <div className="text-xs text-zinc-400 font-mono">{item.category}</div>
        </div>
      ),
    },
    {
      key: 'subtitle',
      header: 'Subtitle / Description',
      render: (item) => (
        <div className="max-w-xs truncate text-xs text-zinc-300 font-sans">
          {item.subtitle || item.description || '—'}
        </div>
      ),
    },
    {
      key: 'link',
      header: 'Link',
      render: (item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:underline"
        >
          <span>View</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal(item)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
            title="Edit Gear"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id)}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20"
            title="Delete Gear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Gears & Hardware CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Tools & devices I use for development, extensions, hardware, and productivity setups.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gear</span>
        </button>
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Gear Entry' : 'Add Gear Entry'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='MacBook Pro 16" M3 Max'
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block">Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Computer, Monitor, Keyboard, Audio..."
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Workstation & Primary Laptop"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Product Link *</label>
                <input
                  type="url"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://www.apple.com/macbook-pro/"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Blazing fast compilation times, zero thermal throttling..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Apple Silicon, 36GB RAM, 1TB NVMe"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Specifications (One per line as &quot;Label: Value&quot;)</label>
                <textarea
                  rows={3}
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  placeholder={"Processor: Apple M3 Max\nMemory: 36GB Unified Architecture\nStorage: 1TB NVMe SSD"}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

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
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Save Gear</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Gear Entry?"
        description="Are you sure you want to delete this gear item?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
