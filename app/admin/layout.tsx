'use client'

import React from 'react'
import Header from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans flex flex-col">
      <div className="flex-1 flex flex-col min-h-screen">
                <Header/>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}