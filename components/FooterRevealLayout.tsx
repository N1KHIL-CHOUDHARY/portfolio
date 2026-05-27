'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const scale = useTransform(smoothProgress, [0, 1], [1, 0.95])
  const borderRadius = useTransform(smoothProgress, [0, 1], [0, 24])
  const footerY = useTransform(smoothProgress, [0, 1], ['-30%', '0%'])

  return (
    <div className="bg-[#FAFAF9] dark:bg-[#0F0F0F]">
      <motion.div
        style={{ 
          scale, 
          borderBottomLeftRadius: borderRadius, 
          borderBottomRightRadius: borderRadius 
        }}
        className="relative z-10 bg-white dark:bg-[#151515] shadow-2xl origin-bottom pb-16"
      >
        {children}
        <CTABanner />
      </motion.div>

      <motion.div 
        ref={containerRef} 
        style={{ y: footerY }}
        className="relative z-0 flex flex-col items-center justify-center  w-full"
      >
        <Footer />
      </motion.div>
    </div>
  )
}