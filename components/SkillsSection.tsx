'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react'

const SKILLS = [
  { id: 1, name: 'React', designation: 'Frontend', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765433904/React_a3rw47.png' },
  { id: 2, name: 'Node.js', designation: 'Backend', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432670/Node.js_tbuz56.png' },
  { id: 3, name: 'Tailwind', designation: 'CSS Framework', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432673/Tailwind-CSS_wgo3yx.png' },
  { id: 4, name: 'MongoDB', designation: 'Database', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/MongoDB_vzwooc.png' },
  { id: 5, name: 'Git', designation: 'Version Control', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/Git_i7ulab.png' },
  { id: 6, name: 'GitHub', designation: 'Collaboration', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/GitHub_gpdqqt.png' },
  { id: 7, name: 'Postman', designation: 'API Testing', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432670/Postman_dnvezd.png' },
  { id: 8, name: 'Express', designation: 'Backend Framework', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765432669/Express_rbyn2d.png' },
  { id: 9, name: 'Cloudinary', designation: 'Media Management', image: 'https://res.cloudinary.com/ddgdcca86/image/upload/v1765433414/idFpf9vxql_1765433408184_uf0amt.jpg' },
]

function SkillItem({ skill }: { skill: typeof SKILLS[0] }) {
  const [hovered, setHovered] = useState(false)
  const springConfig = { stiffness: 120, damping: 8 }
  const x = useMotionValue(0)
  const rotate = useSpring(useTransform(x, [-100, 100], [-30, 30]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-40, 40]), springConfig)

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 14 } }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            style={{ translateX, rotate, whiteSpace: 'nowrap' }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            <p className="text-xs font-semibold text-white dark:text-neutral-900">{skill.name}</p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{skill.designation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={skill.image}
        alt={skill.name}
        onMouseMove={(e) => {
          x.set(e.nativeEvent.offsetX - (e.target as HTMLImageElement).offsetWidth / 2)
        }}
        whileHover={{ scale: 1.15, y: -3 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        className="w-12 h-12 object-contain cursor-pointer"
      />
    </div>
  )
}

export default function SkillsSection() {
  return (
    <section className="w-full py-24 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-2xl font-bold tracking-tight mb-16 text-neutral-900 dark:text-white"
      >
        Technical Skills
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-12"
      >
        {SKILLS.map((skill) => (
          <SkillItem key={skill.id} skill={skill} />
        ))}
      </motion.div>
    </section>
  )
}
