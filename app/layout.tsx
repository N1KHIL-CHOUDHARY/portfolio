import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nikhil — Full Stack Developer',
  description:
    'Full Stack Developer based in Chennai, India. Building fast, accessible, and user-friendly web applications.',
}

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
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <div id="boot-screen" aria-hidden="true">
          <div className="boot-spinner" />
        </div>
        {children}
      </body>
    </html>
  )
}