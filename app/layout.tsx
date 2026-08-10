import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import './globals.css'

export const metadata: Metadata = {
  title: 'Nikhil — Full Stack Developer',
  description:
    'Full Stack Developer building fast, accessible, and modern web experiences.',
}

const themeScript = `
(function () {
  try {
    const saved = localStorage.getItem('theme');

    const dark =
      saved === 'dark' ||
      (!saved &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (_) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />

        {/* ── Resource hints for external origins ── */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://res.cloudinary.com"
        />
        <link
          rel="preconnect"
          href="https://api.github.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://api.github.com"
        />
      </head>
      <body
        className={`
          ${GeistSans.variable}
          ${GeistMono.variable}
          font-sans antialiased
        `}
      >
        {children}
      </body>
    </html>
  )
}