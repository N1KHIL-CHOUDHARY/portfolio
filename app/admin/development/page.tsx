'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Edit2, Trash2, Terminal, ExternalLink, CheckCircle2, Loader2, X, FileText, Eye, Code } from 'lucide-react'
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
          ? (item.tags as string[]).join(', ')
          : typeof item.tags === 'string'
          ? (JSON.parse(item.tags) as string[]).join(', ')
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
      toast.error('Title, Category, and Why I Use It are required!')
      return
    }

    startTransition(async () => {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      const payload = {
        title,
        subtitle,
        category,
        whyIUseIt,
        content,
        tags,
        configSnippetFilename: configFilename,
        configSnippetCode: configCode,
        order,
      }

      let res
      if (editingId) {
        res = await updateDevelopmentItemAction(editingId, payload)
      } else {
        res = await createDevelopmentItemAction(payload)
      }

      if (res.success) {
        toast.success(editingId ? 'Item updated' : 'Item created')
        setIsModalOpen(false)
        loadItems()
      } else {
        toast.error(res.error || 'Failed to save item')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      const res = await softDeleteDevelopmentItemAction(id)
      if (res.success) {
        toast.success('Item deleted')
        setDeleteTargetId(null)
        loadItems()
      } else {
        toast.error(res.error || 'Failed to delete item')
      }
    })
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<DevelopmentSetup>[] = [
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
      key: 'why',
      header: 'Why I Use It / Markdown',
      render: (item) => (
        <div className="space-y-1 max-w-xs">
          <p className="text-xs font-sans text-zinc-400 truncate">{item.whyIUseIt}</p>
          {(item as any).content && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <FileText className="w-3 h-3" />
              <span>Markdown guide included</span>
            </span>
          )}
        </div>
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
            title="Edit Setup"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id)}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20"
            title="Delete Setup"
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
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Development Setup CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Manage workstation hardware specs, terminal profiles, editor settings, and gear configurations.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs" />

          <div className="relative z-10 w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white">
                {editingId ? 'Edit Setup & Markdown Guide' : 'Add Setup & Markdown Guide'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Cursor AI & VS Code"
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
                    placeholder="Code Editor, Terminal, Shell & Prompt..."
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
                  placeholder="AI-Powered Code Editor & Primary IDE"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Why I Use It *</label>
                <textarea
                  rows={2}
                  required
                  value={whyIUseIt}
                  onChange={(e) => setWhyIUseIt(e.target.value)}
                  placeholder="Optimized for minimal visual distraction, rapid keyboard navigation..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Markdown Guide / Post Section */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Markdown Guide / Post Content (.md)</span>
                  </label>
                  <div className="flex items-center p-0.5 bg-zinc-950 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setActiveTab('edit')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        activeTab === 'edit'
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      <span>Edit .md</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'edit' ? (
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={'### How to add this extension\n\n1. Open Cursor/VS Code Command Palette (`Cmd + Shift + P`)\n2. Search for `Extensions: Install Extension`\n3. Paste the following configuration:\n\n```json\n{\n  "editor.formatOnSave": true\n}\n```'}
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500 leading-relaxed"
                  />
                ) : (
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 min-h-[140px] max-h-[250px] overflow-y-auto">
                    {content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="text-zinc-500 italic text-center py-6">No markdown content entered yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Cursor AI, VS Code, Geist Mono, JetBrains Mono"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-zinc-400 block">Config Snippet (Optional)</label>
                <input
                  type="text"
                  value={configFilename}
                  onChange={(e) => setConfigFilename(e.target.value)}
                  placeholder="Filename (settings.json)"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
                <textarea
                  rows={3}
                  value={configCode}
                  onChange={(e) => setConfigCode(e.target.value)}
                  placeholder="Paste configuration JSON or zsh snippet..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 font-mono focus:outline-none focus:border-zinc-500"
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
                  <span>Save Setup Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Setup Entry?"
        description="Are you sure you want to delete this development setup item?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
