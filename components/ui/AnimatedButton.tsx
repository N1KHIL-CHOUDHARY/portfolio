import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
}

export default function AnimatedButton({
  children,
  className = '',
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}
