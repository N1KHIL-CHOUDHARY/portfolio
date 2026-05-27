'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Download, MapPin } from 'lucide-react'

const TECH_STACK = [
  {
    name: 'React',
    icon: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765433904/React_a3rw47.png',
  },
  {
    name: 'Next.js',
    icon: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432670/Node.js_tbuz56.png',
  },
  {
    name: 'TypeScript',
    icon: 'https://placehold.co/48x48/3178C6/fff?text=TS',
  },
  {
    name: 'Node.js',
    icon: 'https://placehold.co/48x48/339933/fff?text=N',
  },
  {
    name: 'MongoDB',
    icon: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/MongoDB_vzwooc.png',
  },
  {
    name: 'Tailwind',
    icon: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432673/Tailwind-CSS_wgo3yx.png',
  },
  {
    name: 'GitHub',
    icon: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/GitHub_gpdqqt.png',
  },
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
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export default function HeroSection({
  scrollToWork,
}: {
  scrollToWork: () => void
}) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/30 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-7"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/[0.06]">
                👋 Hello, I&apos;m
              </span>
            </motion.div>

            <motion.div variants={item} className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-neutral-900 dark:text-white">
                Full Stack
                <br />
                Developer
              </h1>
            </motion.div>

            <motion.p
              variants={item}
              className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md"
            >
              I build fast, accessible and user-friendly web applications with
              clean code and thoughtful design.
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
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                    />

                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
                      {tech.name}
                    </span>
                  </div>
                ))}

                <span className="text-neutral-400 text-sm">···</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: 'easeOut',
            }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] shadow-2xl">
                <img
                  src="https://res.cloudinary.com/ddgdcca86/image/upload/v1765432670/no1_79_ildna2.webp"
                  alt="Nikhil — Full Stack Developer"
                  className="w-full h-full object-cover object-topg"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                className="absolute -left-8 top-8 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200/70 dark:border-white/10 shadow-lg"
              >
                <MapPin
                  size={13}
                  className="text-blue-500 shrink-0"
                />

                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
                  Chennai, India 🇮🇳
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  delay: 0.75,
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                className="absolute -right-8 top-1/3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200/70 dark:border-white/10 shadow-lg"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                    2+ Years
                  </span>
                </span>

                <span className="text-[10px] text-neutral-400">
                  Building on Web
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.9,
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200/70 dark:border-white/10 shadow-lg whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
                  Open to Opportunities
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}