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
import Image from 'next/image'
import heroImage from '../public/profile-3.webp'

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
    <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden bg-noise bg-[#fdfaec] dark:bg-[#1a1a1a]">

      <div className="relative max-w-6xl mx-auto px-6 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 border-2 border-black dark:border-white bg-[#ff5252] text-black font-bold uppercase tracking-widest text-[11px] rotate-[-2deg] shadow-[4px_4px_0_0_#000]">
                👋 Hello I'M
              </span>
            </motion.div>

            <motion.div variants={item} className="space-y-1">
              <h1 className="text-7xl lg:text-8xl font-black tracking-tighter text-black dark:text-white uppercase font-serif mix-blend-difference">
                Nikhil
              </h1>
              <p className="text-2xl lg:text-3xl font-bold tracking-tight text-white bg-black dark:bg-white dark:text-black inline-block px-3 py-1 transform rotate-1">
                Full Stack Developer.
              </p>
            </motion.div>

            <motion.p
              variants={item}
              className="text-lg text-black dark:text-white font-medium leading-relaxed max-w-sm border-l-4 border-black dark:border-white pl-4"
            >
              I build digital products with a focus on raw creative energy, 
              performance, and brutally honest interactions.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2 px-6 py-3 border-4 border-black bg-white dark:bg-black dark:border-white text-black dark:text-white font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#fff]"
              >
                View My Work
                <ArrowRight size={18} strokeWidth={3} />
              </button>

              <a
                href="/assets/RESUME.pdf"
                download="Nikhil_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 border-4 border-black dark:border-white text-black dark:text-white font-bold bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
              >
                <Download size={18} strokeWidth={3} />
                Grab Resume
              </a>
            </motion.div>

            <motion.div variants={item} className="space-y-3 pt-6 border-t-4 border-dashed border-black/20 dark:border-white/20">
              <p className="text-[14px] font-bold text-black dark:text-white uppercase tracking-widest font-serif">
                Studio Tools
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {TECH_STACK.map((tech) => (
                  <div key={tech.name} className="group relative">
                    <tech.Icon className="w-10 h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-6" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="relative flex flex-col items-center lg:items-end w-full">
            <div className="relative">
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 border-4 border-black dark:border-white shadow-[12px_12px_0_0_#000] dark:shadow-[12px_12px_0_0_#fff] rotate-3 bg-[#e0ded8]">
                <Image
                  src={heroImage}
                  alt="Nikhil"
                  fill
                  priority
                  placeholder="blur"
                  quality={82}
                  sizes="(max-width: 768px) 288px, 384px"
                  className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="absolute -left-10 top-12 flex items-center gap-2 px-4 py-2 border-4 border-black dark:border-white bg-[#ffdf00] text-black font-bold rotate-[-6deg] shadow-[6px_6px_0_0_#000] z-20">
                <MapPin size={16} strokeWidth={3} className="shrink-0" />
                <span className="text-[13px] uppercase tracking-wider whitespace-nowrap">
                  Chennai, India 🇮🇳
                </span>
              </div>

              <div className="hidden lg:block absolute -bottom-[40px] -right-[60px] z-20 cursor-pointer">
                <NowPlaying />
              </div>
            </div>

            <div className="lg:hidden mt-20 w-full flex justify-center">
              <NowPlaying />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}