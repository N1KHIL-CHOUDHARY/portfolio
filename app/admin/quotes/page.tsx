'use client'

import React, { useState, useEffect, useTransition, useMemo } from 'react'
import {
  Quote as QuoteIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  Search,
  ListPlus,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import {
  fetchQuotesAction,
  createQuoteAction,
  updateQuoteAction,
  toggleQuoteActiveAction,
  softDeleteQuoteAction,
  bulkCreateQuotesAction,
  reorderQuotesAction,
} from '@/actions/quotes'

interface QuoteItem {
  id: string
  text: string
  author: string
  order: number
  category?: string | null
  active: boolean
  createdAt: string | Date
}

const AUTHOR_SUGGESTIONS = [
  'Bhagavad Gita',
  'Steve Jobs',
  'Marcus Aurelius',
  'Naval Ravikant',
  'Linus Torvalds',
  'Alan Kay',
  'Nikola Tesla',
  'Albert Einstein',
  'Lao Tzu',
  'Seneca',
  'Epictetus',
  'Richard Feynman',
]

const SAMPLE_BULK_QUOTES = `You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions. || Bhagavad Gita
Stay hungry, stay foolish. || Steve Jobs
The mind is everything. What you think you become. || Buddha
Waste no more time arguing what a good man should be. Be one. || Marcus Aurelius
Talk is cheap. Show me the code. || Linus Torvalds
Simplicity is prerequisite for reliability. || Edsger W. Dijkstra
Simple things should be simple, complex things should be possible. || Alan Kay
We are what we repeatedly do. Excellence, then, is not an act, but a habit. || Will Durant
Seek wealth, not money or status. Wealth is having assets that earn while you sleep. || Naval Ravikant
It always seems impossible until it is done. || Nelson Mandela`

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [todayQuoteId, setTodayQuoteId] = useState<string | null>(null)
  const [todayIndex, setTodayIndex] = useState<number>(-1)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Single Quote Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('Bhagavad Gita')
  const [category, setCategory] = useState('Wisdom')
  const [order, setOrder] = useState(0)
  const [active, setActive] = useState(true)

  // Bulk Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [bulkCategory, setBulkCategory] = useState('Wisdom')

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [tabFilter, setTabFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')

  // Delete Target
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const loadQuotes = async () => {
    setIsLoading(true)
    try {
      const res = await fetchQuotesAction()
      if (res.success && res.items) {
        setQuotes(res.items as QuoteItem[])
        setTodayQuoteId(res.todayQuoteId)
        setTodayIndex(res.todayIndex)
      }
    } catch {
      toast.error('Failed to load quotes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQuotes()
  }, [])

  // Parse bulk text using '||' delimiter (Quote Text || Author)
  const parsedBulkQuotes = useMemo(() => {
    if (!bulkText.trim()) return []

    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean)
    const results: Array<{ text: string; author: string; category: string }> = []

    for (const line of lines) {
      if (line.includes('||')) {
        const parts = line.split('||').map((p) => p.trim()).filter(Boolean)
        if (parts.length >= 2) {
          results.push({
            text: parts[0],
            author: parts[1] || 'Bhagavad Gita',
            category: bulkCategory || 'Wisdom',
          })
        } else if (parts.length === 1) {
          results.push({
            text: parts[0],
            author: 'Bhagavad Gita',
            category: bulkCategory || 'Wisdom',
          })
        }
      } else {
        results.push({
          text: line,
          author: 'Bhagavad Gita',
          category: bulkCategory || 'Wisdom',
        })
      }
    }

    return results
  }, [bulkText, bulkCategory])

  const openSingleModal = (q?: QuoteItem) => {
    if (q) {
      setEditingId(q.id)
      setText(q.text)
      setAuthor(q.author)
      setCategory(q.category || 'Wisdom')
      setOrder(q.order)
      setActive(q.active)
    } else {
      setEditingId(null)
      setText('')
      setAuthor('Bhagavad Gita')
      setCategory('Wisdom')
      const maxOrder = quotes.reduce((max, item) => Math.max(max, item.order), -1)
      setOrder(maxOrder + 1)
      setActive(true)
    }
    setIsModalOpen(true)
  }

  const handleSaveSingle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      toast.error('Quote text is required!')
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          text,
          author: author.trim() || 'Bhagavad Gita',
          category: category.trim() || 'Wisdom',
          order: Number(order),
          active,
        }

        let res
        if (editingId) {
          res = await updateQuoteAction(editingId, payload)
        } else {
          res = await createQuoteAction(payload)
        }

        if (res.success) {
          toast.success(editingId ? 'Quote updated' : 'Quote added to rotation')
          setIsModalOpen(false)
          loadQuotes()
        } else {
          toast.error(res.error || 'Failed to save quote')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save quote')
      }
    })
  }

  const handleBulkImport = () => {
    if (parsedBulkQuotes.length === 0) {
      toast.error('No valid quotes found to import!')
      return
    }

    startTransition(async () => {
      try {
        const res = await bulkCreateQuotesAction({ quotes: parsedBulkQuotes })
        if (res.success) {
          toast.success(`Successfully imported ${res.count} quotes into rotation!`)
          setIsBulkModalOpen(false)
          setBulkText('')
          loadQuotes()
        } else {
          toast.error(res.error || 'Failed to import quotes')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to import quotes')
      }
    })
  }

  const handleToggleActive = (id: string, currentActive: boolean) => {
    startTransition(async () => {
      try {
        const res = await toggleQuoteActiveAction(id, !currentActive)
        if (res.success) {
          toast.success(!currentActive ? 'Quote activated in rotation' : 'Quote disabled')
          loadQuotes()
        } else {
          toast.error(res.error || 'Failed to update quote status')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to update quote status')
      }
    })
  }

  const handleMoveOrder = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= quotes.length) return

    const newQuotes = [...quotes]
    const temp = newQuotes[index].order
    newQuotes[index].order = newQuotes[targetIndex].order
    newQuotes[targetIndex].order = temp

    startTransition(async () => {
      try {
        const res = await reorderQuotesAction([
          { id: newQuotes[index].id, order: newQuotes[index].order },
          { id: newQuotes[targetIndex].id, order: newQuotes[targetIndex].order },
        ])
        if (res.success) {
          toast.success('Order updated')
          loadQuotes()
        }
      } catch {
        toast.error('Failed to reorder')
      }
    })
  }

  const handleSoftDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await softDeleteQuoteAction(id)
        if (res.success) {
          toast.success('Quote removed')
          setDeleteTargetId(null)
          loadQuotes()
        } else {
          toast.error(res.error || 'Failed to delete quote')
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete quote')
      }
    })
  }

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.author.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (tabFilter === 'ACTIVE') return q.active
      if (tabFilter === 'INACTIVE') return !q.active
      return true
    })
  }, [quotes, searchQuery, tabFilter])

  const todayQuote = useMemo(() => {
    return quotes.find((q) => q.id === todayQuoteId)
  }, [quotes, todayQuoteId])

  const activeCount = useMemo(() => quotes.filter((q) => q.active).length, [quotes])

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <QuoteIcon className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Daily Quotes CMS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Quotes rotate automatically day-by-day based on index. Add single quotes or bulk import with <code className="text-emerald-400 bg-zinc-900 px-1 py-0.5 rounded">||</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 transition-all shadow-sm"
          >
            <ListPlus className="w-4 h-4 text-sky-400" />
            <span>Bulk Add (||)</span>
          </button>

          <button
            onClick={() => openSingleModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Quote</span>
          </button>
        </div>
      </div>

      {/* Today's Active Spotlight & Stats Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Spotlight Card */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-zinc-900/60 to-zinc-950/80 backdrop-blur-md space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Live on Portfolio Banner Today
              </span>
            </div>

            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
              Day Index #{todayIndex >= 0 ? todayIndex + 1 : 1} of {activeCount || 1}
            </span>
          </div>

          {todayQuote ? (
            <div className="space-y-2 pt-1 font-mono">
              <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
                &quot;{todayQuote.text}&quot;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-800/60">
                <span className="font-semibold text-emerald-300">
                  — {todayQuote.author}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  DB Index: #{todayQuote.order}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-zinc-400 py-2">
              No quotes currently active in DB. Showing default Bhagavad Gita quote.
            </div>
          )}
        </div>

        {/* Quick Stats Counter */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Rotation Status
            </div>
            <div className="text-2xl font-bold font-mono text-white pt-1">
              {activeCount}{' '}
              <span className="text-xs font-normal text-zinc-500 font-sans">Active in cycle</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 space-y-1 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
            <div className="flex justify-between">
              <span>Total in DB:</span>
              <span className="text-white font-bold">{quotes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-rotates at:</span>
              <span className="text-emerald-400">Midnight (UTC)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl shrink-0 font-mono text-xs">
          <button
            onClick={() => setTabFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tabFilter === 'ALL'
                ? 'bg-zinc-800 text-white font-semibold shadow-xs border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({quotes.length})
          </button>
          <button
            onClick={() => setTabFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tabFilter === 'ACTIVE'
                ? 'bg-zinc-800 text-white font-semibold shadow-xs border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setTabFilter('INACTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tabFilter === 'INACTIVE'
                ? 'bg-zinc-800 text-white font-semibold shadow-xs border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Disabled ({quotes.length - activeCount})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quote or author..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
          />
        </div>
      </div>

      {/* Quotes List / Table */}
      <div className="border border-zinc-800/80 rounded-2xl bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3.5 w-16 text-center">Index</th>
                <th className="p-3.5">Quote Text</th>
                <th className="p-3.5 w-44">Author</th>
                <th className="p-3.5 w-28 text-center">Status</th>
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
                      <div className="h-4 bg-zinc-800/60 rounded w-3/4" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-4 bg-zinc-800/60 rounded w-28" />
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="w-12 h-4 bg-zinc-800 rounded mx-auto" />
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="w-16 h-4 bg-zinc-800 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 font-mono">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <QuoteIcon className="w-8 h-8 text-zinc-600 stroke-[1.5]" />
                      <p className="text-xs">No quotes found matching your filters.</p>
                      <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="mt-2 text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>Click here to bulk import quotes with ||</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q, idx) => {
                  const isToday = q.id === todayQuoteId

                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-zinc-800/40 transition-colors ${
                        isToday ? 'bg-emerald-950/15' : ''
                      }`}
                    >
                      {/* Index / Order */}
                      <td className="p-3.5 text-center font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
                          #{q.order}
                        </span>
                      </td>

                      {/* Quote Text */}
                      <td className="p-3.5 text-zinc-200">
                        <div className="space-y-1">
                          <p className="font-mono text-xs italic line-clamp-2">
                            &quot;{q.text}&quot;
                          </p>
                          {isToday && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Sparkles className="w-2.5 h-2.5" /> Active Today
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Author */}
                      <td className="p-3.5 font-mono text-xs">
                        <div className="text-zinc-200 font-bold">{q.author}</div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center font-mono">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(q.id, q.active)}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border transition-all cursor-pointer ${
                            q.active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          {q.active ? 'Active' : 'Disabled'}
                        </button>
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
                            disabled={idx === filteredQuotes.length - 1 || isPending}
                            onClick={() => handleMoveOrder(idx, 'DOWN')}
                            title="Move Down"
                            className="p-1.5 rounded-lg bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openSingleModal(q)}
                            title="Edit"
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(q.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/60 font-mono text-xs text-zinc-400 flex items-center justify-between">
          <div>
            Showing <span className="text-zinc-200">{filteredQuotes.length}</span> of{' '}
            <span className="text-zinc-200">{quotes.length}</span> quotes
          </div>
          <div className="text-[11px] text-zinc-500">
            Rotates automatically day by day via DB index
          </div>
        </div>
      </div>

      {/* Single Quote Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <QuoteIcon className="w-4 h-4 text-emerald-400" />
                <span>{editingId ? 'Edit Quote' : 'Add New Rotating Quote'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSingle} className="space-y-4 font-mono text-xs">
              {/* Quote Text */}
              <div className="space-y-1">
                <label className="text-zinc-400 block font-semibold">Quote Text *</label>
                <textarea
                  required
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 resize-none font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Author field & quick suggestions */}
              <div className="space-y-2">
                <label className="text-zinc-400 block font-semibold">Author *</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Bhagavad Gita"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
                {/* 1-Click Author Suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500">Quick Author Presets:</span>
                  <div className="flex flex-wrap gap-1">
                    {AUTHOR_SUGGESTIONS.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setAuthor(name)}
                        className={`px-2 py-0.5 rounded-md border text-[10px] transition-colors ${
                          author === name
                            ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                            : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-zinc-400 block">Category / Tag</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Wisdom / Tech / Stoicism"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Order / Index & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-zinc-400 block">Order Index</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="activeQuote"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-950 text-emerald-400 cursor-pointer"
                  />
                  <label htmlFor="activeQuote" className="text-zinc-300 cursor-pointer">
                    Active in Daily Rotation
                  </label>
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 flex items-center gap-1.5 shadow-md"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{editingId ? 'Update Quote' : 'Save to Rotation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Modal (Custom || Delimiter) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsBulkModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
              <div>
                <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                  <ListPlus className="w-4 h-4 text-sky-400" />
                  <span>Bulk Add Quotes using <code className="text-emerald-400 bg-zinc-950 px-1 py-0.5 rounded">||</code> Delimiter</span>
                </h2>
                <p className="text-[11px] font-mono text-zinc-400 pt-0.5">
                  Format: <code className="text-zinc-300">Quote Text || Author</code> (One quote per line)
                </p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs overflow-y-auto flex-1 pr-1">
              {/* Preset Loader */}
              <div className="flex items-center justify-between bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                <div className="text-[11px] text-zinc-400">
                  Want sample wisdom & tech quotes ready to insert?
                </div>
                <button
                  type="button"
                  onClick={() => setBulkText(SAMPLE_BULK_QUOTES)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono flex items-center gap-1 border border-zinc-700 transition-colors shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Load 10 Sample Quotes</span>
                </button>
              </div>

              {/* Textarea */}
              <div className="space-y-1">
                <label className="text-zinc-400 block font-semibold flex items-center justify-between">
                  <span>Paste Quotes (One per line)</span>
                  <span className="text-[10px] text-emerald-400">
                    {parsedBulkQuotes.length} quotes detected
                  </span>
                </label>
                <textarea
                  rows={7}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`Stay hungry, stay foolish. || Steve Jobs\nTalk is cheap. Show me the code. || Linus Torvalds\nSimplicity is prerequisite for reliability. || Edsger W. Dijkstra`}
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-500 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Live Preview Table */}
              {parsedBulkQuotes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Parsed Preview ({parsedBulkQuotes.length})</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-zinc-800 rounded-xl bg-zinc-950">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-zinc-900 text-zinc-400 sticky top-0 border-b border-zinc-800">
                        <tr>
                          <th className="p-2 w-8 text-center">#</th>
                          <th className="p-2">Quote</th>
                          <th className="p-2 w-36">Author</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
                        {parsedBulkQuotes.map((p, i) => (
                          <tr key={i} className="hover:bg-zinc-900/40">
                            <td className="p-2 text-center text-zinc-500">{i + 1}</td>
                            <td className="p-2 text-zinc-200 italic line-clamp-1 truncate max-w-xs">
                              &quot;{p.text}&quot;
                            </td>
                            <td className="p-2 font-bold text-emerald-300 truncate">{p.author}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800 shrink-0 font-mono text-xs">
              <span className="text-[11px] text-zinc-500">
                Will be indexed sequentially starting after #{quotes.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending || parsedBulkQuotes.length === 0}
                  onClick={handleBulkImport}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Import {parsedBulkQuotes.length} Quotes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Quote from Rotation?"
        description="Are you sure you want to remove this quote from the daily rotating banner?"
        confirmText="Delete"
        isDestructive
        isLoading={isPending}
        onConfirm={() => deleteTargetId && handleSoftDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
