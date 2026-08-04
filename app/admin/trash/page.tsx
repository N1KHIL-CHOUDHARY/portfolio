'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { fetchProjectsAction, restoreProjectAction } from '@/actions/projects'
import { fetchExperiencesAction } from '@/actions/experience'
import { fetchSkillsAction } from '@/actions/skills'
import { Project } from '@prisma/client'

export default function AdminTrashPage() {
  const [trashedProjects, setTrashedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const loadTrash = async () => {
    setIsLoading(true)
    try {
      const res = await fetchProjectsAction({ includeDeleted: true })
      if (res.success && res.items) {
        const deleted = (res.items as Project[]).filter((p) => p.deletedAt !== null)
        setTrashedProjects(deleted)
      }
    } catch {
      toast.error('Failed to load trash bin')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTrash()
  }, [])

  const handleRestore = (id: string) => {
    startTransition(async () => {
      const res = await restoreProjectAction(id)
      if (res.success) {
        toast.success('Project restored successfully')
        loadTrash()
      } else {
        toast.error(res.error || 'Failed to restore project')
      }
    })
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Trash Bin Manager
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Soft-deleted items are safely held here before permanent removal.
          </p>
        </div>
      </div>

      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden font-mono text-xs shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 flex items-center gap-2 text-amber-400 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Items in trash are hidden from your public portfolio until restored.</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 animate-pulse">Loading Trash Bin...</div>
        ) : trashedProjects.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">Trash Bin is currently empty 🎉</div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {trashedProjects.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-xs">{item.title}</div>
                  <div className="text-[11px] text-zinc-500">
                    Deleted at: {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '—'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestore(item.id)}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Item</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
