'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  updateProjectAction,
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
        setTotalPages(((res as Record<string, unknown>).totalPages as number) || 1)
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
      header: 'Project & Image',
      render: (project) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-9 rounded-md overflow-hidden relative border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
            <Image
              src={project.thumbnail || '/images/project section/image copy 2.png'}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/projects/${project.id}`}
                className="font-mono font-bold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-white transition-colors text-xs truncate"
              >
                {project.title}
              </Link>
              {project.featured && (
                <span className="p-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Star className="w-3 h-3 fill-current" />
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 truncate">
              /projects/{project.slug}
            </div>
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
        <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 space-y-0.5">
          <div>{project.role || '—'}</div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500">{project.timeline || '—'}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project) => (
        <div className="flex items-center gap-1.5 font-mono">
          {activeTab === 'TRASH' ? (
            <button
              type="button"
              onClick={() => handleRestore(project.id)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleToggleFeatured(project)}
                className={`p-1.5 rounded-md border border-dashed transition-colors cursor-pointer ${
                  project.featured
                    ? 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title={project.featured ? 'Unfeature' : 'Feature on Home'}
              >
                <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-current' : ''}`} />
              </button>

              <Link
                href={`/admin/projects/${project.id}`}
                className="p-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => handleDuplicate(project.id)}
                className="p-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                title="Duplicate Project"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="p-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                title="Preview Live Page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setDeleteTargetId(project.id)}
                className="p-1.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
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
    <div className="space-y-6 font-mono text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-neutral-500" />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Projects CMS
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Manage, reorder, feature, and publish software applications and open-source repos.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
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
        isOpen={Boolean(deleteTargetId)}
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
