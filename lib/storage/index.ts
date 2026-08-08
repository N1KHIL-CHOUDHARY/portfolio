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
  upload(file: File | Buffer, filename: string, mimeType: string): Promise<UploadResult>
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

  async upload(fileOrBuffer: File | Buffer, originalName: string, mimeType: string): Promise<UploadResult> {
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
      folder: 'portfolio_assets',
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
  private uploadDir: string

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads')
  }

  async upload(fileOrBuffer: File | Buffer, originalName: string, mimeType: string): Promise<UploadResult> {
    await fs.mkdir(this.uploadDir, { recursive: true })

    const ext = path.extname(originalName) || '.bin'
    const safeFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    const targetPath = path.join(this.uploadDir, safeFilename)

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

    return {
      url: `/uploads/${safeFilename}`,
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
      await fs.unlink(filePath)
      return true
    } catch {
      return false
    }
  }
}

export const storageAdapter: StorageAdapter = process.env.CLOUDINARY_URL
  ? new CloudinaryStorageAdapter()
  : new LocalStorageAdapter()

