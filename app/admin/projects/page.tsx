'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Edit2,
  Copy,
  Trash2,
  RotateCcw,
  Star,
  ExternalLink,
  FolderKanban,
  Eye
} from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import {
  fetchProjectsAction,
  softDeleteProjectAction,
  restoreProjectAction,
  duplicateProjectAction,
  updateProjectAction
} from '@/actions/projects'
import { Project, ProjectStatus } from '@prisma/client'

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const isTrash = activeTab === 'TRASH'
      const statusFilter =
        activeTab === 'PUBLISHED'
          ? ProjectStatus.PUBLISHED
          : activeTab === 'DRAFT'
          ? ProjectStatus.DRAFT
          : undefined

      const res = await fetchProjectsAction({
        includeDeleted: isTrash,
        status: statusFilter,
        search: searchQuery,
        page,
        limit: 10,
      })

      if (res.success && res.items) {
        setProjects(res.items as Project[])
        setTotalCount(res.total || 0)
        setTotalPages((res as Record<string, unknown>).totalPages as number || 1)
      }
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [activeTab, searchQuery, page])

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      const res = await softDeleteProjectAction(id)
      if (res.success) {
        toast.success('Project moved to trash bin')
        setDeleteTargetId(null)
        loadProjects()
      } else {
        toast.error(res.error || 'Failed to delete project')
      }
    })
  }

  const handleRestore = (id: string) => {
    startTransition(async () => {
      const res = await restoreProjectAction(id)
      if (res.success) {
        toast.success('Project restored successfully')
        loadProjects()
      } else {
        toast.error(res.error || 'Failed to restore project')
      }
    })
  }

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      const res = await duplicateProjectAction(id)
      if (res.success && res.data) {
        toast.success('Project duplicated!')
        router.push(`/admin/projects/${res.data.id}`)
      } else {
        toast.error(res.error || 'Failed to duplicate project')
      }
    })
  }

  const handleToggleFeatured = (project: Project) => {
    startTransition(async () => {
      const res = await updateProjectAction(project.id, {
        featured: !project.featured,
      })
      if (res.success) {
        toast.success(
          `Project ${!project.featured ? 'marked as featured' : 'unfeatured'}`
        )
        loadProjects()
      }
    })
  }

  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'Title & Slug',
      render: (project) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/projects/${project.id}`}
              className="font-mono font-bold text-zinc-100 hover:text-emerald-400 transition-colors text-xs"
            >
              {project.title}
            </Link>
            {project.featured && (
              <span className="p-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            /projects/{project.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (project) => <StatusBadge status={project.status} />,
    },
    {
      key: 'role',
      header: 'Role & Timeline',
      render: (project) => (
        <div className="text-xs font-mono text-zinc-400 space-y-0.5">
          <div>{project.role || '—'}</div>
          <div className="text-[10px] text-zinc-500">{project.timeline || '—'}</div>
        </div>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (project) => (
        <button
          onClick={() => handleToggleFeatured(project)}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors border ${
            project.featured
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
        >
          {project.featured ? '★ Featured' : 'Normal'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project) => (
        <div className="flex items-center gap-1.5">
          {project.deletedAt ? (
            <button
              onClick={() => handleRestore(project.id)}
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
              title="Restore project"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <Link
                href={`/admin/projects/${project.id}`}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleDuplicate(project.id)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                title="Duplicate Project"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                title="View Live Page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setDeleteTargetId(project.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                title="Trash Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Projects CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage, reorder, feature, and publish your portfolio software applications and open-source repos.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </Link>
      </div>

      {/* Main Table */}
      <DataTable
        data={projects}
        columns={columns}
        totalCount={totalCount}
        currentPage={page}
        totalPages={totalPages}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPageChange={setPage}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setPage(1)
        }}
        tabs={[
          { id: 'ALL', label: 'All Projects' },
          { id: 'PUBLISHED', label: 'Published' },
          { id: 'DRAFT', label: 'Drafts' },
          { id: 'TRASH', label: 'Trash Bin' },
        ]}
        bulkActions={{
          onBulkDelete: (ids) => {
            ids.forEach((id) => softDeleteProjectAction(id))
            toast.success('Selected projects moved to trash')
            loadProjects()
          },
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Move Project to Trash?"
        description="This project will be moved to the trash bin. You can restore it anytime or permanently delete it."
        confirmText="Move to Trash"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
