'use client'

import React from 'react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="pt-20 pb-12 flex flex-col items-center w-full">
      <div className="flex flex-col items-center gap-5 mb-14 text-center">
        <p className="text-[18px] sm:text-[20px] text-neutral-800 dark:text-neutral-200 font-medium tracking-tight">
          Still reading? That means something clicked. Let's talk.
        </p>
        <a
          href="https://calendly.com/nikhil2k7h/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 pl-2 pr-5 py-1.5 bg-neutral-900 text-neutral-50 dark:bg-[#141414] dark:text-neutral-200 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-900 rounded-full text-[14px] font-medium transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
        >
          {/* Avatar / Logo Group */}
          <div className="flex items-center -space-x-2">
            {/* My Logo / Avatar */}
            <div className="relative z-10 w-7 h-7 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
              <Image
                src="/icon.png"
                alt="Logo"
                width={28}
                height={28}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.currentTarget.src = '/images/hero.png'
                }}
              />
            </div>

            {/* "+ You" Avatar on Hover */}
            <div className="relative z-20 flex items-center justify-center w-0 opacity-0 group-hover:w-7 group-hover:opacity-100 transition-all duration-300 ease-out overflow-hidden">
              <div className="w-7 h-7 rounded-full border border-dashed border-neutral-400 dark:border-neutral-500 bg-neutral-800 text-[10px] font-semibold text-neutral-100 flex items-center justify-center shrink-0">
                +You
              </div>
            </div>
          </div>

          <span>Book a free call</span>
        </a>
      </div>

      <div className="w-full h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 mb-8" />

      <div className="text-center text-[13px] sm:text-[14px] text-neutral-500 dark:text-neutral-400 space-y-1.5 font-normal">
        <p>
          Design and developed by{' '}
          <a
            href="https://github.com/n1khil-choudhary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 dark:text-neutral-200 font-medium underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-[4px] hover:decoration-neutral-700 dark:hover:decoration-neutral-300 transition-colors"
          >
            Nikhil Choudhary
          </a>
        </p>
        <p>&copy; {currentYear}. Built in the open.</p>
      </div>
    </footer>
  )
}