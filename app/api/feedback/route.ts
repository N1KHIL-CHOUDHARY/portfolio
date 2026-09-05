import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { category, message, contact } = body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      )
    }

    const cleanCategory = typeof category === 'string' ? category.slice(0, 50) : 'general'
    const cleanMessage = message.trim().slice(0, 2000)
    const cleanContact = typeof contact === 'string' ? contact.trim().slice(0, 200) : ''

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const userAgent = req.headers.get('user-agent') || null
    const timestamp = new Date().toISOString()
    const id = crypto.randomUUID()

    const feedbackEntry = {
      id,
      category: cleanCategory,
      message: cleanMessage,
      contact: cleanContact || null,
      ip: ip ? ip.slice(0, 45) : null,
      userAgent: userAgent ? userAgent.slice(0, 250) : null,
      createdAt: timestamp,
    }

    // 1. Store in Upstash Redis if configured
    if (redis) {
      try {
        await redis.lpush('portfolio:feedback', JSON.stringify(feedbackEntry))
        // Keep the last 500 feedback entries in Redis
        await redis.ltrim('portfolio:feedback', 0, 499)
      } catch (redisError) {
        console.error('[Feedback API] Redis storage error:', redisError)
      }
    }

    // 2. Persist to Prisma AuditLog as permanent backup
    if (prisma && prisma.auditLog) {
      try {
        await prisma.auditLog.create({
          data: {
            action: 'FEEDBACK_SUBMITTED',
            entity: 'Feedback',
            entityId: id,
            details: feedbackEntry,
          },
        })
      } catch (dbError) {
        console.error('[Feedback API] Database audit log error:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully',
    })
  } catch (error) {
    console.error('[Feedback API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
