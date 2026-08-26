import fs from 'fs/promises'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

export interface UploadResult {
  url: string
  path: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  storageAdapter?: string
}

export interface StorageAdapter {
  upload(
    file: File | Buffer,
    filename: string,
    mimeType: string,
    subfolder?: string
  ): Promise<UploadResult>
  delete(filePath: string): Promise<boolean>
}

export class CloudinaryStorageAdapter implements StorageAdapter {
  constructor() {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
      })
    }
  }

  async upload(
    fileOrBuffer: File | Buffer,
    originalName: string,
    mimeType: string,
    subfolder?: string
  ): Promise<UploadResult> {
    let buffer: Buffer
    let size = 0

    if (fileOrBuffer instanceof File) {
      const bytes = await fileOrBuffer.arrayBuffer()
      buffer = Buffer.from(bytes)
      size = fileOrBuffer.size
    } else {
      buffer = fileOrBuffer
      size = buffer.length
    }

    const base64Data = buffer.toString('base64')
    const effectiveMime = mimeType || 'application/octet-stream'
    const fileUri = `data:${effectiveMime};base64,${base64Data}`

    const cleanBaseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, '_')
    const customPublicId = `${cleanBaseName}_${Date.now().toString().slice(-6)}`

    let resourceType: 'image' | 'raw' | 'video' | 'auto' = 'auto'
    if (effectiveMime.startsWith('image/')) resourceType = 'image'
    else if (effectiveMime.startsWith('video/')) resourceType = 'video'
    else if (effectiveMime.includes('pdf') || effectiveMime.includes('document')) resourceType = 'auto'

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: subfolder || 'portfolio_assets',
      resource_type: resourceType,
      public_id: customPublicId,
    })

    return {
      url: uploadResponse.secure_url,
      path: uploadResponse.public_id,
      filename: uploadResponse.public_id,
      originalName,
      mimeType: effectiveMime,
      size: uploadResponse.bytes || size,
      storageAdapter: 'cloudinary',
    }
  }

  async delete(publicIdOrUrl: string): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(publicIdOrUrl)
      return true
    } catch {
      return false
    }
  }
}

export class LocalStorageAdapter implements StorageAdapter {
  private basePublicDir: string

  constructor() {
    this.basePublicDir = path.join(process.cwd(), 'public')
  }

  async upload(
    fileOrBuffer: File | Buffer,
    originalName: string,
    mimeType: string,
    subfolder: string = 'images/project section'
  ): Promise<UploadResult> {
    const targetDir = path.join(this.basePublicDir, subfolder)
    await fs.mkdir(targetDir, { recursive: true })

    const ext = path.extname(originalName) || '.png'
    const cleanBaseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, '_')
    const safeFilename = `${cleanBaseName}_${Date.now().toString().slice(-6)}${ext}`
    const targetPath = path.join(targetDir, safeFilename)

    let buffer: Buffer
    let size = 0

    if (fileOrBuffer instanceof File) {
      const bytes = await fileOrBuffer.arrayBuffer()
      buffer = Buffer.from(bytes)
      size = fileOrBuffer.size
    } else {
      buffer = fileOrBuffer
      size = buffer.length
    }

    await fs.writeFile(targetPath, buffer)

    // Form clean Next.js public URL (e.g. /images/project section/filename.png)
    const normalizedSubfolder = subfolder.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
    const publicUrl = `/${normalizedSubfolder}/${safeFilename}`

    return {
      url: publicUrl,
      path: targetPath,
      filename: safeFilename,
      originalName,
      mimeType,
      size,
      storageAdapter: 'local',
    }
  }

  async delete(filePath: string): Promise<boolean> {
    try {
      const fullPath = filePath.startsWith(this.basePublicDir)
        ? filePath
        : path.join(this.basePublicDir, filePath.replace(/^\/+/, ''))
      await fs.unlink(fullPath)
      return true
    } catch {
      return false
    }
  }
}

export const storageAdapter: StorageAdapter = process.env.CLOUDINARY_URL
  ? new CloudinaryStorageAdapter()
  : new LocalStorageAdapter()
