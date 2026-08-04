'use client'

import React, { useState } from 'react'
import { UploadCloud, CheckCircle, Copy, Loader2, File, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function MediaUploader({
  onUploadSuccess,
  label = 'Upload asset or drop file here',
}: {
  onUploadSuccess?: (url: string) => void
  label?: string
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.url) {
        setUploadedUrl(data.url)
        toast.success('Media file uploaded successfully!')
        onUploadSuccess?.(data.url)
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('An error occurred while uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('URL copied to clipboard!')
  }

  return (
    <div className="space-y-3 font-sans">
      <div className="relative border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 text-center bg-zinc-950/60 transition-all group cursor-pointer">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-2xl bg-zinc-900 text-zinc-400 group-hover:text-white group-hover:scale-105 transition-all">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-mono font-medium text-zinc-200">
              {isUploading ? 'Uploading asset...' : label}
            </p>
            <p className="text-[11px] font-mono text-zinc-500">
              Supports PNG, JPG, WEBP, SVG, PDF, MP4 (Max 20MB)
            </p>
          </div>
        </div>
      </div>

      {uploadedUrl && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-300 truncate">{uploadedUrl}</span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(uploadedUrl)}
            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors shrink-0"
            title="Copy Asset URL"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
