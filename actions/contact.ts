'use server'

import nodemailer from 'nodemailer'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const { name, email, subject, message } = data

  // Basic validation
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return { success: false, error: 'All fields are required.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  if (message.trim().length < 10) {
    return { success: false, error: 'Message must be at least 10 characters.' }
  }

  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10)
  const toEmail = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || smtpUser

  if (!smtpUser || !smtpPass) {
    console.error('[sendContactEmail] SMTP credentials not configured (SMTP_USER / SMTP_PASS missing in .env)')
    return { success: false, error: 'Mail service is not configured. Please try again later or reach out directly.' }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })

    await transporter.sendMail({
      from: `"${name}" <${smtpUser}>`,
      replyTo: email,
      to: toEmail,
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7;">
          <div style="background: #18181b; padding: 28px 32px;">
            <p style="margin: 0; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a; font-family: monospace;">New Contact Message</p>
            <h1 style="margin: 8px 0 0; font-size: 22px; color: #fafafa; font-weight: 700;">${subject}</h1>
          </div>
          <div style="padding: 28px 32px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; font-size: 12px; color: #71717a; font-family: monospace; width: 80px; vertical-align: top;">From</td>
                <td style="padding: 8px 0; font-size: 14px; color: #18181b; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 12px; color: #71717a; font-family: monospace; vertical-align: top;">Email</td>
                <td style="padding: 8px 0; font-size: 14px; color: #18181b;"><a href="mailto:${email}" style="color: #3f3f46;">${email}</a></td>
              </tr>
            </table>
            <div style="border-top: 1px solid #e4e4e7; padding-top: 20px;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #71717a; font-family: monospace; letter-spacing: 0.06em; text-transform: uppercase;">Message</p>
              <p style="margin: 0; font-size: 15px; color: #27272a; line-height: 1.7; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
          </div>
          <div style="background: #f4f4f5; padding: 16px 32px; border-top: 1px solid #e4e4e7;">
            <p style="margin: 0; font-size: 11px; color: #a1a1aa; font-family: monospace;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (error: any) {
    console.error('[sendContactEmail Error]:', error)
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
