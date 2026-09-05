'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Terminal, ExternalLink, Loader2, X, FileText, Eye, Code } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { toast } from 'sonner'
import { fetchDevelopmentItemsAction, createDevelopmentItemAction, updateDevelopmentItemAction, softDeleteDevelopmentItemAction } from '@/actions/development'
import { DevelopmentSetup } from '@prisma/client'

export default function AdminDevelopmentPage() {
  const [items, setItems] = useState<DevelopmentSetup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  // Form State
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('Code Editor')
  const [whyIUseIt, setWhyIUseIt] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [configFilename, setConfigFilename] = useState('')
  const [configCode, setConfigCode] = useState('')
  const [order, setOrder] = useState(0)

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const res = await fetchDevelopmentItemsAction()
      if (res.success && res.items) {
        setItems(res.items as DevelopmentSetup[])
      }
    } catch {
      toast.error('Failed to load setup items')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const openModal = (item?: DevelopmentSetup) => {
    setActiveTab('edit')
    if (item) {
      setEditingId(item.id)
      setTitle(item.title)
      setSubtitle(item.subtitle || '')
      setCategory(item.category)
      setWhyIUseIt(item.whyIUseIt)
      setContent((item as any).content || '')
      setTagsInput(
        Array.isArray(item.tags)
          ? item.tags.join(', ')
          : typeof item.tags === 'string'
          ? item.tags
          : ''
      )
      setConfigFilename(item.configSnippetFilename || '')
      setConfigCode(item.configSnippetCode || '')
      setOrder(item.order)
    } else {
      setEditingId(null)
      setTitle('')
      setSubtitle('')
      setCategory('Code Editor')
      setWhyIUseIt('')
      setContent('')
      setTagsInput('')
      setConfigFilename('')
      setConfigCode('')
      setOrder(items.length + 1)
    }
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !category || !whyIUseIt) {
      toast.error('Title, Category, and "Why I Use It" are required!')
      return
    }

    const tagsArray = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    startTransition(async () => {
      try {
        if (editingId) {
          const res = await updateDevelopmentItemAction(editingId, {
            title,
            subtitle,
            category,
            whyIUseIt,
            content,
            tags: tagsArray,
            configSnippetFilename: configFilename || undefined,
            configSnippetCode: configCode || undefined,
            order,
          })
          if (res.success) {
            toast.success('Tool entry updated!')
            setIsModalOpen(false)
            loadItems()
          } else {
            toast.error(res.error || 'Failed to update item')
          }
        } else {
          const res = await createDevelopmentItemAction({
            title,
            subtitle,
            category,
            whyIUseIt,
            content,
            tags: tagsArray,
            configSnippetFilename: configFilename || undefined,
            configSnippetCode: configCode || undefined,
            order,
          })
          if (res.success) {
            toast.success('Tool entry created!')
            setIsModalOpen(false)
            loadItems()
          } else {
            toast.error(res.error || 'Failed to add item')
          }
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save item')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await softDeleteDevelopmentItemAction(id)
        if (res.success) {
          toast.success('Tool deleted')
          setDeleteTargetId(null)
          loadItems()
        } else {
          toast.error(res.error || 'Failed to delete item')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete item')
      }
    })
  }

  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<DevelopmentSetup>[] = [
    {
      key: 'title',
      header: 'Tool / Category',
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
            {item.title}
          </div>
          <div className="text-[11px] text-neutral-500">
            {item.category} • /{item.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'whyIUseIt',
      header: 'Value Proposition',
      render: (item) => (
        <div className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 max-w-sm">
          {item.whyIUseIt}
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (item) => {
        const tags = Array.isArray(item.tags) ? (item.tags as string[]) : []
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {tags.slice(0, 3).map((tag: any) => (
              <span
                key={String(tag)}
                className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                {String(tag)}
              </span>
            ))}
          </div>
        )
      },
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
            title="Edit Setup Item"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <a
            href={`/development/${item.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="View Public Post"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setDeleteTargetId(item.id)}
            className="p-1.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
            title="Delete Item"
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
            <Terminal className="w-4 h-4 text-neutral-500" />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Development Setup CMS
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Manage workstation hardware specs, terminal profiles, editor settings, and tool write-ups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-white transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Tool / Guide</span>
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
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingId ? 'Edit Setup & Markdown Guide' : 'Add Setup & Markdown Guide'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Cursor AI & VS Code"
                    className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Code Editor, Terminal..."
                    className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="AI-Powered Code Editor & Primary IDE"
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Why I Use It *</label>
                <textarea
                  rows={2}
                  required
                  value={whyIUseIt}
                  onChange={(e) => setWhyIUseIt(e.target.value)}
                  placeholder="Optimized for minimal visual distraction, rapid keyboard navigation..."
                  className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none resize-y"
                />
              </div>

              {/* Markdown Guide Section */}
              <div className="space-y-2 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Markdown Guide / Post Content</span>
                  </label>
                  <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md border border-dashed border-neutral-300 dark:border-neutral-700">
                    <button
                      type="button"
                      onClick={() => setActiveTab('edit')}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                        activeTab === 'edit'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-bold shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      <span>Edit .md</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                        activeTab === 'preview'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-bold shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'edit' ? (
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={'### How to add this extension\n\n1. Open Command Palette (`Cmd + Shift + P`)\n2. Install Extension...'}
                    className="w-full px-3 py-2 bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none resize-y"
                  />
                ) : (
                  <div className="p-4 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 min-h-[140px] max-h-[250px] overflow-y-auto">
                    {content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="text-neutral-400 italic text-center py-6">No markdown content entered yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400 block mb-1 font-semibold">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="IDE, AI, TypeScript"
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
                  Save Tool Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Development Setup Entry?"
        description="Are you sure you want to delete this tool/guide?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
