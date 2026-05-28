'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import {
  React as ReactIcon,
  Nextjs,
  TypeScript,
  Nodejs,
  MongoDB,
  TailwindCSS,
  GitHub,
} from './icons'
import NowPlaying from './NowPlaying'
import image from 'next/image'
import heroImage from '../public/profile-3.jpeg'

const TECH_STACK = [
  { name: 'React', Icon: ReactIcon },
  { name: 'Next.js', Icon: Nextjs },
  { name: 'TypeScript', Icon: TypeScript },
  { name: 'Node.js', Icon: Nodejs },
  { name: 'MongoDB', Icon: MongoDB },
  { name: 'Tailwind', Icon: TailwindCSS },
  { name: 'GitHub', Icon: GitHub },
]

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function HeroSection({
  scrollToWork,
}: {
  scrollToWork: () => void
}) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-10">
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#FAFAF9] dark:bg-[#0F0F0F]">
        <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-neutral-200/40 to-transparent dark:from-white/[0.03] dark:to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/[0.06]">
                👋 Hello I'M
              </span>
            </motion.div>

            <motion.div variants={item} className="space-y-1">
              <h1 className="text-7xl lg:text-8xl font-extrabold tracking-tighter text-neutral-900 dark:text-white">
                Nikhil
              </h1>
              <p className="text-2xl lg:text-3xl font-medium tracking-tight text-neutral-500 dark:text-neutral-400">
                Full Stack Developer.
              </p>
            </motion.div>

            <motion.p
              variants={item}
              className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm"
            >
              I build digital products with a focus on minimalist design, 
              performance, and human-centric interactions.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3">
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-all duration-200 shadow-sm"
              >
                View My Work
                <ArrowRight size={14} />
              </button>

              <a
                href="/assets/RESUME.pdf"
                download="Nikhil_Resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-200"
              >
                <Download size={14} />
                Download Resume
              </a>
            </motion.div>

            <motion.div variants={item} className="space-y-3 pt-2">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
                Tech I work with
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {TECH_STACK.map((tech) => (
                  <div key={tech.name} className="group relative">
                    <tech.Icon className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
                      {tech.name}
                    </span>
                  </div>
                ))}
                <span className="text-neutral-400 text-sm">···</span>
              </div>
            </motion.div>
          </motion.div>

         {/* Right: Visual Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative flex flex-col items-center lg:items-end w-full"
            >
              <div className="relative">
                {/* Profile Image Container */}
                <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] shadow-2xl">
                  <img
                    src={heroImage.src}
                    alt="Nikhil"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Location Badge */}
                <div className="absolute -left-8 top-8 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200/70 dark:border-white/10 shadow-lg z-20">
                  <MapPin size={13} className="text-blue-500 shrink-0" />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
                    Chennai, India 🇮🇳
                  </span>
                </div>

                {/* Desktop: Bottom Right Widget */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="hidden lg:block absolute -bottom-[70px] -right-[100px] z-20 cursor-pointer"
                >
                  <NowPlaying />
                </motion.div>
              </div>

              {/* Mobile Flow Widget */}
              <div className="lg:hidden mt-16 w-full flex justify-center">
                <NowPlaying />
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}