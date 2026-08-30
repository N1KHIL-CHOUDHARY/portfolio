import fs from 'fs/promises'
import path from 'path'

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

export const storageAdapter: StorageAdapter = new LocalStorageAdapter()
