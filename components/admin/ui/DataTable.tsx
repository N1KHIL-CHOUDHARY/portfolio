'use client'

import React, { useState } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
  CheckCircle,
  Archive,
  Inbox,
  Filter
} from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  totalCount?: number
  currentPage?: number
  totalPages?: number
  isLoading?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onPageChange?: (page: number) => void
  activeTab?: string
  onTabChange?: (tab: string) => void
  tabs?: { id: string; label: string; count?: number }[]
  bulkActions?: {
    onBulkDelete?: (selectedIds: string[]) => void
    onBulkPublish?: (selectedIds: string[]) => void
    onBulkArchive?: (selectedIds: string[]) => void
  }
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  onPageChange,
  activeTab,
  onTabChange,
  tabs,
  bulkActions,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const isAllSelected = data.length > 0 && selectedIds.length === data.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(data.map((item) => item.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Top Bar: Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        {tabs && tabs.length > 0 && (
          <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl shrink-0 font-mono text-xs overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium shadow-xs border border-zinc-700/50'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive
                          ? 'bg-zinc-700 text-zinc-200'
                          : 'bg-zinc-950 text-zinc-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Search Input */}
        {onSearchChange && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter records..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
            />
          </div>
        )}
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && bulkActions && (
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700/60 text-xs font-mono flex items-center justify-between animate-in fade-in duration-200">
          <span className="text-zinc-300 font-medium">
            {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
          </span>

          <div className="flex items-center gap-2">
            {bulkActions.onBulkPublish && (
              <button
                onClick={() => bulkActions.onBulkPublish!(selectedIds)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>
            )}

            {bulkActions.onBulkArchive && (
              <button
                onClick={() => bulkActions.onBulkArchive!(selectedIds)}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            )}

            {bulkActions.onBulkDelete && (
              <button
                onClick={() => bulkActions.onBulkDelete!(selectedIds)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Trash</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="border border-zinc-800/80 rounded-2xl bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-0 cursor-pointer"
                  />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="p-3.5 font-semibold">
                    <div className="flex items-center gap-1">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-3.5 text-center">
                      <div className="w-4 h-4 bg-zinc-800 rounded mx-auto" />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="p-3.5">
                        <div className="h-4 bg-zinc-800/60 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="p-12 text-center text-zinc-500 font-mono"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox className="w-8 h-8 text-zinc-600 stroke-[1.5]" />
                      <p className="text-xs">No records found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const isSelected = selectedIds.includes(item.id)
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-zinc-800/40 transition-colors ${
                        isSelected ? 'bg-zinc-800/50' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {columns.map((col) => (
                        <td key={col.key} className="p-3.5 text-zinc-300">
                          {col.render
                            ? col.render(item)
                            : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/60 font-mono text-xs text-zinc-400 flex items-center justify-between">
          <div>
            Showing <span className="text-zinc-200">{data.length}</span> of{' '}
            <span className="text-zinc-200">{totalCount || data.length}</span> entries
          </div>

          {totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
