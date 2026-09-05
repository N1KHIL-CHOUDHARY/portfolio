'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Image as ImageIcon,
  Copy,
  Trash2,
  Search,
  Grid,
  List as ListIcon,
  File,
  Video,
  FileText,
  ExternalLink,
} from 'lucide-react'
import MediaUploader from '@/components/admin/ui/MediaUploader'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import { toast } from 'sonner'
import { MediaAsset } from '@prisma/client'

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const loadMedia = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/media')
      const data = await res.json()
      if (data.success && data.items) {
        setAssets(data.items)
      }
    } catch {
      toast.error('Failed to load media assets')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMedia()
  }, [])

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Asset URL copied to clipboard!')
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Asset deleted')
        setDeleteTargetId(null)
        loadMedia()
      } else {
        toast.error(data.error || 'Failed to delete asset')
      }
    } catch {
      toast.error('Failed to delete asset')
    }
  }

  const filteredAssets = assets.filter(
    (a) =>
      a.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-neutral-500" />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Media Library Manager
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
            Upload, search, copy URLs, and manage assets for projects, articles, and profile photos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 p-0.5 rounded-md">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <MediaUploader onUploadSuccess={loadMedia} label="Drop images or assets here to upload" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
        <span className="text-neutral-500 text-[11px]">
          Total: {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Assets Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-40 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 animate-pulse" />
            ))
          ) : filteredAssets.length === 0 ? (
            <div className="col-span-full p-12 text-center text-neutral-400">
              No media assets uploaded yet.
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden hover:border-neutral-500 dark:hover:border-neutral-600 transition-all flex flex-col justify-between"
              >
                {/* Preview Thumbnail */}
                <div className="h-28 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative overflow-hidden">
                  {asset.mimeType.startsWith('image/') ? (
                    <Image
                      src={asset.url}
                      alt={asset.originalName}
                      width={300}
                      height={112}
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1 text-neutral-400">
                      {asset.mimeType.includes('pdf') ? (
                        <FileText className="w-7 h-7" />
                      ) : asset.mimeType.startsWith('video/') ? (
                        <Video className="w-7 h-7" />
                      ) : (
                        <File className="w-7 h-7" />
                      )}
                      <span className="text-[10px] uppercase">{asset.mimeType.split('/')[1]}</span>
                    </div>
                  )}
                </div>

                {/* Metadata & Actions */}
                <div className="p-2.5 space-y-1.5 border-t border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                  <div className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 truncate" title={asset.originalName}>
                    {asset.originalName}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate font-mono">
                    {(asset.size / 1024).toFixed(1)} KB
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => copyUrl(asset.url)}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(asset.id)}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
        <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 text-[11px] uppercase tracking-wider">
                <th className="p-3">Preview</th>
                <th className="p-3">Filename</th>
                <th className="p-3">Size</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800/80">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-900/40">
                  <td className="p-3 w-16">
                    <div className="w-10 h-10 rounded overflow-hidden relative border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                      {asset.mimeType.startsWith('image/') ? (
                        <Image src={asset.url} alt={asset.originalName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <File className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-neutral-800 dark:text-neutral-200">{asset.originalName}</td>
                  <td className="p-3 text-neutral-500">{(asset.size / 1024).toFixed(1)} KB</td>
                  <td className="p-3 text-neutral-500 uppercase">{asset.mimeType.split('/')[1]}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyUrl(asset.url)}
                        className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        title="Copy URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(asset.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Media Asset?"
        description="Are you sure you want to permanently delete this media file?"
        confirmText="Delete"
        isDestructive
        onConfirm={() => deleteTargetId && handleDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}
