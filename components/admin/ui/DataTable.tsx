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
    <div className="space-y-4 font-mono">
      {/* Top Bar: Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        {tabs && tabs.length > 0 && (
          <div className="flex items-center gap-1 bg-neutral-100/70 dark:bg-neutral-900/60 border border-dashed border-neutral-300 dark:border-neutral-800 p-1 rounded-md shrink-0 text-xs overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-semibold border border-neutral-300/80 dark:border-neutral-700/80 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] ${
                        isActive
                          ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200'
                          : 'bg-neutral-200 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400'
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
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter records..."
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            />
          </div>
        )}
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && bulkActions && (
        <div className="p-2.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <span className="text-neutral-800 dark:text-neutral-200 font-medium">
            {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
          </span>

          <div className="flex items-center gap-2">
            {bulkActions.onBulkPublish && (
              <button
                type="button"
                onClick={() => bulkActions.onBulkPublish!(selectedIds)}
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>
            )}

            {bulkActions.onBulkArchive && (
              <button
                type="button"
                onClick={() => bulkActions.onBulkArchive!(selectedIds)}
                className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            )}

            {bulkActions.onBulkDelete && (
              <button
                type="button"
                onClick={() => bulkActions.onBulkDelete!(selectedIds)}
                className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Trash</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 text-[11px] uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-0 cursor-pointer"
                  />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="p-3 font-semibold">
                    <div className="flex items-center gap-1">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800/80">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-3 text-center">
                      <div className="w-3.5 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="p-3">
                        <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="p-10 text-center text-neutral-400 dark:text-neutral-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox className="w-7 h-7 text-neutral-400 dark:text-neutral-600 stroke-[1.5]" />
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
                      className={`hover:bg-neutral-50/80 dark:hover:bg-neutral-900/40 transition-colors ${
                        isSelected ? 'bg-neutral-100/60 dark:bg-neutral-900/60' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {columns.map((col) => (
                        <td key={col.key} className="p-3 text-neutral-700 dark:text-neutral-300">
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
        <div className="p-3 border-t border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <div>
            Showing <span className="text-neutral-900 dark:text-neutral-200 font-semibold">{data.length}</span> of{' '}
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold">{totalCount || data.length}</span> entries
          </div>

          {totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-1 rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-1 rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors cursor-pointer"
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
