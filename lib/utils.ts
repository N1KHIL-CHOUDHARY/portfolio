import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function optimizeCloudinaryUrl(url?: string | null, width = 400): string {
  if (!url || typeof url !== 'string') return ''
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    if (url.includes('f_auto') || url.includes('q_auto')) {
      return url
    }
    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`)
  }
  return url
}

export function normalizeMediaPath(url?: string | null): string {
  if (!url || typeof url !== 'string') return ''
  let cleaned = url.trim().replace(/\\/g, '/')
  if (!cleaned) return ''
  if (
    cleaned.startsWith('http://') ||
    cleaned.startsWith('https://') ||
    cleaned.startsWith('data:') ||
    cleaned.startsWith('blob:')
  ) {
    return cleaned
  }
  // Strip accidental page prefix if relative route was prepended
  if (cleaned.startsWith('/projects/uploads/')) {
    cleaned = cleaned.replace('/projects/uploads/', '/uploads/')
  } else if (cleaned.startsWith('projects/uploads/')) {
    cleaned = cleaned.replace('projects/uploads/', '/uploads/')
  }
  // Ensure leading slash for root-relative resolution in browser
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned
  }
  return cleaned
}
