import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import {
  Inter,
  JetBrains_Mono,
} from 'next/font/google'

import './globals.css'

export const metadata: Metadata = {
  title: 'Nikhil — Full Stack Developer',
  description:
    'Full Stack Developer building fast, accessible, and modern web experiences.',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const themeScript = `
(function () {
  try {
    const saved = localStorage.getItem('theme');

    const dark =
      saved === 'dark' ||
      (!saved &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`
          ${GeistSans.variable}
          ${GeistMono.variable}
          ${inter.variable}
          ${jetbrains.variable}
          font-sans antialiased
        `}
      >
        {children}
      </body>
    </html>
  )
}