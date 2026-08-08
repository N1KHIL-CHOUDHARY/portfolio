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
  CheckCircle,
  ExternalLink
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

  const filteredAssets = assets.filter(
    (a) =>
      a.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              Media Library Manager
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-1">
            Upload, search, copy URLs, and manage assets for projects, articles, and profile photos.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
        <MediaUploader onUploadSuccess={loadMedia} label="Drop new images, PDFs, or videos here to upload" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs font-mono text-xs">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by filename..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-zinc-600"
          />
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Total: {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Assets Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-40 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
            ))
          ) : filteredAssets.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs font-mono text-zinc-500">
              No media assets uploaded yet.
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                {/* Preview Thumbnail */}
                <div className="h-32 bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                  {asset.mimeType.startsWith('image/') ? (
                    <Image
                      src={asset.url}
                      alt={asset.originalName}
                      width={300}
                      height={128}
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1 text-zinc-500">
                      <FileText className="w-8 h-8" />
                      <span className="text-[10px] font-mono uppercase">{asset.type}</span>
                    </div>
                  )}

                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyUrl(asset.url)}
                      className="p-2 rounded-xl bg-zinc-100 text-zinc-950 font-medium transition-transform hover:scale-105"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-zinc-800 text-white font-medium transition-transform hover:scale-105"
                      title="View Full"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3 font-mono text-xs space-y-0.5 bg-zinc-900/90 border-t border-zinc-800">
                  <div className="font-bold text-white truncate text-[11px]" title={asset.originalName}>
                    {asset.originalName}
                  </div>
                  <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                    <span>{(asset.size / 1024).toFixed(1)} KB</span>
                    <span className="uppercase text-[9px] px-1 rounded bg-zinc-800 text-zinc-400">
                      {asset.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900/60 overflow-hidden font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 text-[11px] uppercase">
                <th className="p-3.5">Filename</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">URL</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-zinc-800/40">
                  <td className="p-3.5 font-bold text-white truncate max-w-xs">{asset.originalName}</td>
                  <td className="p-3.5 text-zinc-400 uppercase">{asset.type}</td>
                  <td className="p-3.5 text-zinc-400">{(asset.size / 1024).toFixed(1)} KB</td>
                  <td className="p-3.5 text-emerald-400 truncate max-w-xs">{asset.url}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => copyUrl(asset.url)}
                      className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
