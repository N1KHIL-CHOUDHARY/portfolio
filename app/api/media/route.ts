import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { storageAdapter } from '@/lib/storage'
import { prisma } from '@/lib/prisma'
import { MediaType } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'images/project section'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const result = await storageAdapter.upload(file, file.name, file.type, folder)

    let type: MediaType = MediaType.IMAGE
    if (file.type.includes('pdf')) type = MediaType.PDF
    else if (file.type.includes('svg')) type = MediaType.SVG
    else if (file.type.includes('video')) type = MediaType.VIDEO

    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename: result.filename,
        originalName: result.originalName,
        mimeType: result.mimeType,
        size: result.size,
        url: result.url,
        path: result.path,
        type,
        storageAdapter: result.storageAdapter || (process.env.CLOUDINARY_URL ? 'cloudinary' : 'local'),
        createdBy: session.userId,
      },
    })

    return NextResponse.json({
      success: true,
      url: mediaAsset.url,
      asset: mediaAsset,
    })
  } catch (error: any) {
    console.error('[Media Upload API Error]:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'File upload failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const dbAssets = await prisma.mediaAsset.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    // Also scan public/images/project section directory
    const publicProjectDir = path.join(process.cwd(), 'public', 'images', 'project section')
    const localProjectFiles: Array<{
      id: string
      url: string
      filename: string
      originalName: string
      type: string
    }> = []

    try {
      const files = await fs.readdir(publicProjectDir)
      for (const file of files) {
        if (file.match(/\.(png|jpg|jpeg|webp|svg|gif)$/i)) {
          localProjectFiles.push({
            id: `local-${file}`,
            url: `/images/project section/${file}`,
            filename: file,
            originalName: file,
            type: 'IMAGE',
          })
        }
      }
    } catch {
      // Ignore if directory does not exist
    }

    return NextResponse.json({
      success: true,
      items: dbAssets,
      projectPresets: localProjectFiles,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch media assets' },
      { status: 500 }
    )
  }
}
