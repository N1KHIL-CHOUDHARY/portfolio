'use client';

import { motion } from 'motion/react'
import { Code, User, Heart } from 'lucide-react'

const TRAITS = [
  {
    icon: Code,
    color: 'blue',
    title: 'Technical Depth',
    text: "I don't just use frameworks; I try to understand the underlying principles to write optimized, clean code.",
  },
  {
    icon: User,
    color: 'purple',
    title: 'User Centric',
    text: 'I believe the best code is invisible to the user — it just works, smoothly and intuitively.',
  },
  {
    icon: Heart,
    color: 'pink',
    title: 'Continuous Learning',
    text: 'The tech landscape changes daily. I stay adaptable and am always ready to pick up the next big tool.',
  },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500',
  purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-500',
  pink: 'bg-pink-50 dark:bg-pink-500/10 text-pink-500',
}

export default function AboutSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> | null }) {
  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold tracking-tight mb-12 text-neutral-900 dark:text-white"
      >
        About &amp; Journey
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-5 text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px]"
        >
          <p>
            <span className="text-neutral-900 dark:text-white font-semibold">Hello! I&apos;m Nikhil.</span>{' '}
            A passionate developer based in Chennai, driven by the challenge of creating efficient, scalable, and visually engaging web applications.
          </p>
          <p>
            My journey started with a curiosity for how things work on the internet. That curiosity quickly turned into an obsession with code — from hacking together my first static sites to building complex full-stack applications.
          </p>
          <p>
            When I&apos;m not coding, I&apos;m exploring new technologies, refining my design eye, or diving into the tech community in India.
          </p>

          <div className="pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Education</h3>
            <div className="relative border-l border-neutral-200 dark:border-white/[0.06] space-y-8 ml-3">
              <div className="relative pl-7">
                <div className="absolute -left-[5px] top-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[#222222] dark:ring-[#151515]" />
                  <div className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">B.E – Computer Science</h4>
                  <span className="text-[11px] font-mono text-neutral-400">2024 – 2028</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Saveetha Engineering College, Chennai</p>
              </div>

              <div className="relative pl-7">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 ring-4 ring-[#222222] dark:ring-[#151515]" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Higher Secondary</h4>
                  <span className="text-[11px] font-mono text-neutral-400">2022 – 2024</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">MGR Adrash Matriculation School</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          {TRAITS.map(({ icon: Icon, color, title, text }) => (
            <div
              key={title}
              className="flex gap-4 items-start p-4 rounded-xl border border-neutral-200/70 dark:border-white/[0.05] bg-[#FAFAF9] dark:bg-[#151515] hover:border-neutral-300 dark:hover:border-white/10 transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${colorMap[color]}`}>
                <Icon size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">{title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}