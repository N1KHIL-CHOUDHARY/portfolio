'use client'

import type { RefObject } from 'react'
import { motion } from 'motion/react'

const PRINCIPLES = [
  {
    num: '01',
    title: 'Technical Depth',
    text: "I don't just use frameworks; I dissect them. Understanding the underlying principles allows me to write optimized, clean code rather than just gluing libraries together.",
  },
  {
    num: '02',
    title: 'Invisible Engineering',
    text: 'The best code is the code the user never notices. I focus on building systems that just work—smoothly, intuitively, and without friction.',
  },
  {
    num: '03',
    title: 'Adaptive Growth',
    text: "The tech landscape changes daily. I don't tie my identity to a single language. I stay adaptable and am always ready to pick up the right tool for the job.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutSection({
  sectionRef,
}: {
  sectionRef?: RefObject<HTMLElement>
}) {
  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-6 py-28 md:py-40 lg:px-8"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <Reveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-neutral-500 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
                ABOUT
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="max-w-xl text-4xl font-bold tracking-tighter text-neutral-400 leading-[1.05] md:text-5xl lg:text-6xl dark:text-neutral-500">
                Less noise, <br />
                <span className="text-neutral-900 dark:text-white">
                  more impact.
                </span>
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-24 md:space-y-28">
          <Reveal delay={0.1}>
            <div className="max-w-3xl space-y-6 text-lg font-medium leading-8 text-neutral-600 md:text-xl md:leading-9 dark:text-neutral-400">
              <p>
                <span className="text-neutral-900 dark:text-white">
                  I&apos;m Nikhil, a developer based in Chennai.
                </span>{' '}
                My journey started with curiosity about how the internet worked.
                That curiosity evolved into a strong focus on digital craftsmanship.
              </p>
              <p>
                From building early static sites to architecting full-stack applications,
                I enjoy turning complex problems into elegant, scalable solutions.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <h3 className="mb-10 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
                The Approach
              </h3>

              <div className="space-y-12">
                {PRINCIPLES.map(({ num, title, text }) => (
                  <div
                    key={num}
                    className="group grid gap-5 md:grid-cols-[auto,1fr] md:gap-10"
                  >
                    <span className="text-5xl font-light tracking-tighter text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900 md:text-6xl dark:text-neutral-800 dark:group-hover:text-white">
                      {num}
                    </span>

                    <div className="pt-1">
                      <h4 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white">
                        {title}
                      </h4>
                      <p className="max-w-2xl leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <h3 className="mb-10 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
                Timeline
              </h3>

              <div className="relative space-y-10 border-l border-neutral-200 pl-2 ml-2 md:ml-4 dark:border-white/10">
                {[
                  {
                    year: '2024 — 2028',
                    title: 'B.E in Computer Science',
                    org: 'Saveetha Engineering College, Chennai',
                    active: true,
                  },
                  {
                    year: '2022 — 2024',
                    title: 'Higher Secondary',
                    org: 'MGR Adarsh Matriculation School',
                    active: false,
                  },
                ].map((item) => (
                  <div key={item.year} className="relative pl-8 md:pl-12">
                    <div
                      className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ring-8 ring-[#FAFAF9] dark:ring-[#0F0F0F] ${
                        item.active
                          ? 'bg-neutral-900 dark:bg-white'
                          : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    />

                    <div className="mb-2 flex flex-col">
                      <span className="mb-2 text-sm font-mono text-neutral-400">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-neutral-500 dark:text-neutral-400">
                      {item.org}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}