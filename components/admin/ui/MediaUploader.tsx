'use client'

import React, { useState } from 'react'
import { UploadCloud, CheckCircle, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function MediaUploader({
  onUploadSuccess,
  label = 'Upload image asset (saves to public/images)',
  folder = 'images/project section',
  accept = 'image/*',
  helperText,
  currentValue,
}: {
  onUploadSuccess?: (url: string) => void
  label?: string
  folder?: string
  accept?: string
  helperText?: string
  currentValue?: string
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentValue || null)

  React.useEffect(() => {
    setUploadedUrl(currentValue || null)
  }, [currentValue])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.url) {
        setUploadedUrl(data.url)
        toast.success(`Image saved to ${data.url}!`)
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
    <div className="space-y-3 font-mono">
      <div className="relative border border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-600 rounded-lg p-5 text-center bg-neutral-50/50 dark:bg-neutral-900/30 transition-all group cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-2.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-neutral-900 dark:text-neutral-100" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {isUploading ? 'Uploading file...' : label}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {helperText || 'PNG, JPG, WEBP, SVG • Saved directly in public directory'}
            </p>
          </div>
        </div>
      </div>

      {uploadedUrl && (
        <div className="p-2.5 rounded-md border border-dashed border-emerald-500/40 bg-emerald-500/10 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-emerald-800 dark:text-emerald-300 truncate font-mono">{uploadedUrl}</span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(uploadedUrl)}
            className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 transition-colors shrink-0 cursor-pointer"
            title="Copy Asset URL"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
