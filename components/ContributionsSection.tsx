'use client'

import { motion } from 'framer-motion'
import {
  Star,
  Github,
  ArrowUpRight,
} from 'lucide-react'

const CONTRIBUTIONS = [
  {
    id: 1,
    name: 'Universal App Opener',
    description:
      'An webapp which convert web url into deep link for android and ios apps. It supports more than 40+ apps and is growing.',
    stars: '256',
    url: 'https://github.com/mdsaban/universal-app-opener/pull/17',
    icon: 'https://placehold.co/80x80/000000/FFFFFF?text=U',
  }
]

export default function ContributionsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <p className="text-sm uppercase ml-1 tracking-[0.15rem] text-neutral-800 mb-3">
          Open Source 
        </p>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Contributions
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {CONTRIBUTIONS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: 'easeOut',
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-[20px]
              border
              border-neutral-200
              dark:border-white/10
              bg-[#fafaf9]
              dark:bg-[#151515]
              p-4
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {item.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5">
                <Star
                  size={16}
                  className="text-neutral-500"
                />

                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                  {item.stars}
                </span>
              </div>
            </div>

            <p className="mt-8 text-[0.875rem] leading-relaxed text-neutral-700 dark:text-neutral-300 max-w-xl">
              {item.description}
            </p>

            <div className="mt-10 flex items-center justify-between">
              <a
                href={item.url}
                target="_blank"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-black
                  text-white
                  px-4
                  py-2
                  text-lg
                  font-medium
                  transition-all
                  duration-300
                  hover:translate-y-[-4px]
                "
              >
                <Github size={20} />
                Contributions
              </a>

  
            </div>

            <div
              className="
                absolute
                inset-0
                opacity-0
                transition-opacity
                duration-500
                pointer-events-none
                bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_40%)]
                dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_40%)]
              "
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}