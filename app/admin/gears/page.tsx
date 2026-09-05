'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Wrench, ExternalLink, Loader2, X } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { fetchGearsAction, createGearAction, updateGearAction, softDeleteGearAction } from '@/actions/gears'

export interface Gear {
  id: string
  title: string
  link: string
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

  // Simplified Form State
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
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
      setLink(item.link)
      setOrder(item.order)
    } else {
      setEditingId(null)
      setTitle('')
      setLink('')
      setOrder(items.length + 1)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !link) {
      toast.error('Title and link are required!')
      return
    }

    startTransition(async () => {
      try {
        if (editingId) {
          const res = await updateGearAction(editingId, { title, link, order })
          if (res.success) {
            toast.success('Gear updated!')
            setIsModalOpen(false)
            loadItems()
          } else {
            toast.error(res.error || 'Failed to update gear')
          }
        } else {
          const res = await createGearAction({ title, link, order })
          if (res.success) {
            toast.success('Gear added!')
            setIsModalOpen(false)
            loadItems()
          } else {
            toast.error(res.error || 'Failed to add gear')
          }
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save gear')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await softDeleteGearAction(id)
        if (res.success) {
          toast.success('Gear deleted')
          setDeleteTargetId(null)
          loadItems()
        } else {
          toast.error(res.error || 'Failed to delete gear')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete gear')
      }
    })
  }

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Gear>[] = [
    {
      key: 'title',
      header: 'Device & Hardware',
      render: (item) => (
        <div className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
          {item.title}
        </div>
      ),
    },
    {
      key: 'link',
      header: 'Product / Affiliate Link',
      render: (item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white inline-flex items-center gap-1 max-w-sm truncate text-xs"
        >
          <span className="truncate">{item.link}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      render: (item) => (
        <span className="text-neutral-600 dark:text-neutral-400 font-mono text-xs">
          #{item.order}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openModal(item)}
            className="p-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Edit Gear"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTargetId(item.id)}
            className="p-1.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
            title="Delete Gear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-neutral-500" />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Hardware & Gear CMS
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Manage your workstation devices, hardware tools, and hardware links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingId ? 'Edit Gear Entry' : 'Add Gear Entry'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Title / Device Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Apple MacBook Pro 16" M4'
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Product Link *</label>
                <input
                  type="url"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-xs cursor-pointer"
                >
                  Save Gear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
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
