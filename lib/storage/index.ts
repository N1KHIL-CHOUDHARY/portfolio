import fs from 'fs/promises'
import path from 'path'

export interface UploadResult {
  url: string
  path: string
  filename: string
  originalName: string
  mimeType: string
  size: number
}

export interface StorageAdapter {
  upload(file: File | Buffer, filename: string, mimeType: string): Promise<UploadResult>
  delete(filePath: string): Promise<boolean>
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

export const storageAdapter: StorageAdapter = new LocalStorageAdapter()
