
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error('RESEND_API_KEY is missing')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    const { senderContact, message } = await req.json()

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <contact@nikhil-dev.in>',
      to: 'nikhil2k7h@gmail.com',
      replyTo:
        typeof senderContact === 'string' && senderContact.includes('@')
          ? senderContact
          : undefined,
      subject: `New Portfolio Message from ${senderContact || 'Visitor'}`,
      text: `Sender Contact: ${senderContact || 'Not provided'}\n\nMessage:\n${message}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
