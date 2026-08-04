import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { storageAdapter } from '@/lib/storage'
import { prisma } from '@/lib/prisma'
import { MediaType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const result = await storageAdapter.upload(file, file.name, file.type)

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
        storageAdapter: 'local',
        createdBy: session.userId,
      },
    })

    return NextResponse.json({
      success: true,
      url: mediaAsset.url,
      asset: mediaAsset,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'File upload failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const assets = await prisma.mediaAsset.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, items: assets })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch media assets' }, { status: 500 })
  }
}
