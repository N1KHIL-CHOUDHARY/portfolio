'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Share2, CheckCircle2, Loader2, X } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { fetchSocialsAction, saveSocialAction, deleteSocialAction } from '@/actions/social'
import { SocialLink } from '@prisma/client'

export default function AdminSocialPage() {
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form State
  const [platform, setPlatform] = useState('')
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [order, setOrder] = useState(0)

  const loadSocials = async () => {
    setIsLoading(true)
    try {
      const res = await fetchSocialsAction()
      if (res.success && res.items) {
        setSocials(res.items as SocialLink[])
      }
    } catch {
      toast.error('Failed to load social links')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSocials()
  }, [])

  const openModal = (soc?: SocialLink) => {
    if (soc) {
      setEditingId(soc.id)
      setPlatform(soc.platform)
      setUrl(soc.url)
      setLabel(soc.label)
      setEnabled(soc.enabled)
      setOrder(soc.order)
    } else {
      setEditingId(null)
      setPlatform('')
      setUrl('')
      setLabel('')
      setEnabled(true)
      setOrder(socials.length + 1)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!platform || !url) {
      toast.error('Platform and URL are required!')
      return
    }

    startTransition(async () => {
      const res = await saveSocialAction(editingId || undefined, {
        platform,
        url,
        label: label || platform,
        enabled,
        order,
      })

      if (res.success) {
        toast.success('Social link saved!')
        setIsModalOpen(false)
        loadSocials()
      } else {
        toast.error(res.error || 'Failed to save social link')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteSocialAction(id)
      if (res.success) {
        toast.success('Social link removed')
        setDeleteTargetId(null)
        loadSocials()
      } else {
        toast.error(res.error || 'Failed to remove link')
      }
    })
  }

  const columns: Column<SocialLink>[] = [
    {
      key: 'platform',
      header: 'Platform & Label',
      render: (soc) => (
        <div className="space-y-0.5 font-mono text-xs">
          <div className="font-bold text-white">{soc.platform}</div>
          <div className="text-[10px] text-zinc-400">{soc.label}</div>
        </div>
      ),
    },
    {
      key: 'url',
      header: 'URL Destination',
      render: (soc) => (
        <a
          href={soc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-emerald-400 hover:underline max-w-xs truncate block"
        >
          {soc.url}
        </a>
      ),
    },
    {
      key: 'enabled',
      header: 'Status',
      render: (soc) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
            soc.enabled
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
          }`}
        >
          {soc.enabled ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (soc) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal(soc)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(soc.id)}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20"
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
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Social Links CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage your GitHub, LinkedIn, Twitter/X, Discord, and Email external profile links.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      <DataTable data={socials} columns={columns} isLoading={isLoading} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Social Link' : 'Add Social Link'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="GitHub / LinkedIn / Twitter"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">URL Destination *</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Label</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="GitHub Profile"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="enabledSocial"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-emerald-400 cursor-pointer"
                />
                <label htmlFor="enabledSocial" className="text-zinc-300 cursor-pointer">
                  Enabled & Visible on Portfolio
                </label>
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
                  <span>Save Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Social Link?"
        description="Are you sure you want to delete this social media link?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
