'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { CTABanner, Footer } from './FooterCTA'
const SOCIAL = [
  { href: 'https://github.com/N1KHIL-CHOUDHARY', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/nikhil-h-184560338', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:nikhil2k7h@gmail.com', icon: Mail, label: 'Email' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
]



export default function FooterRevealLayout({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 24])

  return (
    <div className="bg-[#FAFAF9] dark:bg-[#0F0F0F]">
      <motion.div
        style={{ 
          scale, 
          borderBottomLeftRadius: borderRadius, 
          borderBottomRightRadius: borderRadius 
        }}
        className="relative z-10 bg-white dark:bg-[#151515] shadow-2xl origin-bottom pb-6"
      >
        {children}
        <CTABanner />
      </motion.div>

      <div ref={containerRef} className="relative z-0">
        <Footer />
      </div>
    </div>
  )
}