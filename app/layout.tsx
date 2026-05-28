import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import {
  Inter,
  Space_Grotesk,
  Poppins,
  JetBrains_Mono,
  Playfair_Display,
  Bebas_Neue,
  Orbitron,
} from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nikhil — Full Stack Developer',
  description:
    'Full Stack Developer based in Chennai, India. Building fast, accessible, and user-friendly web applications.',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

const themeScript = `
(function () {
  try {
    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && systemDark);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    window.addEventListener('load', function () {
      document.body.classList.add('loaded');
      setTimeout(function () {
        var boot = document.getElementById('boot-screen');
        if (boot) boot.remove();
      }, 300);
    });
  } catch (e) {}
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`
          ${GeistSans.variable}
          ${GeistMono.variable}
          ${inter.variable}
          ${grotesk.variable}
          ${poppins.variable}
          ${jetbrains.variable}
          ${playfair.variable}
          ${bebas.variable}
          ${orbitron.variable}
          font-sans antialiased
        `}
      >
        <div id="boot-screen" aria-hidden="true">
          <div className="boot-spinner" />
        </div>
        {children}
      </body>
    </html>
  )
}