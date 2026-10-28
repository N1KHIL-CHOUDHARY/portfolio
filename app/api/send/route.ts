// app/api/send/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { senderContact, message } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const data = await resend.emails.send({
      // Replace onboarding@resend.dev with your verified domain address:
      from: 'Portfolio Contact <contact@nikhil-dev.in>', 
      to: 'nikhil2k7h@gmail.com',
      replyTo: senderContact && senderContact.includes('@') ? senderContact : undefined,
      subject: `New Portfolio Message from ${senderContact || 'Visitor'}`,
      text: `Sender Contact: ${senderContact || 'Not provided'}\n\nMessage:\n${message}`,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}