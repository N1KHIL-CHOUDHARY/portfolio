'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import {
  React as ReactIcon,
  Nextjs,
  TypeScript,
  Nodejs,
  MongoDB,
  TailwindCSS,
  GitHub,
} from './icons'

import heroImage from '../public/profile-3.webp'

const NowPlaying = dynamic(
  () => import('./NowPlaying'),
  {
    ssr: false,
    loading: () => null,
  }
)

const TECH_STACK = [
  { name: 'React', Icon: ReactIcon },
  { name: 'Next.js', Icon: Nextjs },
  { name: 'TypeScript', Icon: TypeScript },
  { name: 'Node.js', Icon: Nodejs },
  { name: 'MongoDB', Icon: MongoDB },
  { name: 'Tailwind', Icon: TailwindCSS },
  { name: 'GitHub', Icon: GitHub },
]

export default function HeroSection({
  scrollToWork,
}: {
  scrollToWork: () => void
}) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none z-[-1] bg-[#FAFAF9] dark:bg-[#0F0F0F]">
        <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-neutral-200/30 to-transparent dark:from-white/[0.02] dark:to-transparent" />
      </div>

      {/* Noise Texture */}
      <div className="noise-bg absolute inset-0 pointer-events-none z-[-1]" />

      <div className="relative max-w-6xl mx-auto px-6 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-8"
          >
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/[0.06]">
                👋 Hello I&apos;M
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-neutral-900 dark:text-white leading-none">
                Nikhil
              </h1>

              <p className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-neutral-500 dark:text-neutral-400">
                Full Stack Developer.
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
              I build digital products focused on minimalist design,
              performance, and thoughtful interactions.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors duration-200 shadow-sm"
              >
                View My Work
                <ArrowRight size={14} />
              </button>

              <a
                href="/assets/RESUME.pdf"
                download="Nikhil_Resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors duration-200"
              >
                <Download size={14} />
                Download Resume
              </a>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
                Tech I work with
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                {TECH_STACK.map((tech) => (
                  <div key={tech.name} className="group relative">
                    <tech.Icon className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105" />

                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
                      {tech.name}
                    </span>
                  </div>
                ))}

                <span className="text-neutral-400 text-sm">···</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative flex flex-col items-center lg:items-end w-full"
          >
            <div className="relative">
              
              {/* Image Card */}
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] shadow-xl shadow-black/5 dark:shadow-black/20 transition-transform duration-500 hover:scale-[1.02] will-change-transform">
                
                <Image
                  src={heroImage}
                  alt="Nikhil"
                  fill
                  priority
                  placeholder="blur"
                  quality={82}
                  sizes="(max-width: 768px) 288px, 384px"
                  className="object-cover object-top rounded-3xl"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </div>

              {/* Location Badge */}
              <div className="absolute -left-8 top-8 flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 shadow-md z-20">
                <MapPin
                  size={13}
                  className="text-blue-500 shrink-0"
                />

                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
                  Chennai, India 🇮🇳
                </span>
              </div>

              {/* Desktop Spotify */}
              <div className="hidden lg:block absolute -bottom-[70px] -right-[100px] z-20">
                <NowPlaying />
              </div>
            </div>

            {/* Mobile Spotify */}
            <div className="lg:hidden mt-16 w-full flex justify-center">
              <NowPlaying />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

