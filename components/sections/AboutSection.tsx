'use client'

import React from 'react'

export interface AboutSectionProps {
  headline?: string | null
  shortBio?: string | null
  subtitle?: string | null
}

export default function AboutSection(_props?: AboutSectionProps) {
  const tech =
    'underline underline-offset-[3px] decoration-neutral-400 dark:decoration-neutral-500 font-medium text-neutral-800 dark:text-neutral-200'

  return (
    <ul className="list-disc pl-4 space-y-2.5 text-[14px] text-neutral-600 dark:text-neutral-400 leading-[1.65] font-normal">
  <li>
    I build products end to end with <span className={tech}>React</span>,{' '}
    <span className={tech}>Next.js</span>,{' '}
    <span className={tech}>TypeScript</span> and{' '}
    <span className={tech}>Node.js</span> - from schema and API design through to the interface.
  </li>
  <li>
    On the backend I work with <span className={tech}>Express</span>,{' '}
    <span className={tech}>MongoDB</span>,{' '}
    <span className={tech}>PostgreSQL</span> and{' '}
    <span className={tech}>Supabase</span>, with a bias toward strong validation, correctness and predictable failure handling.
  </li>
</ul>
  )
}