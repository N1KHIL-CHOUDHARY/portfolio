'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { RotateCw } from 'lucide-react'

export interface CardItem {
  id: string
  src: string
  alt: string
}

const DEFAULT_CARDS: CardItem[] = [
  { id: '1', src: '/profile-3.webp', alt: 'Photo 2024' },
  { id: '2', src: '/profile-2.webp', alt: 'Photo 2021' },
  { id: '3', src: '/profile-1.webp', alt: 'Photo 2018' },
]

export default function DraggableImageStack({
  cards = DEFAULT_CARDS,
}: {
  cards?: CardItem[]
}) {
  const [deck, setDeck] = useState<CardItem[]>(cards)

  const handleDismiss = (id: string) => {
    setDeck((prev) => prev.filter((c) => c.id !== id))
  }

  const handleReset = () => {
    setDeck(cards)
  }

  return (
    <div className="relative grid h-[233px] w-[175px] place-items-center shrink-0 select-none overflow-visible my-2">
      <AnimatePresence>
        {deck.length > 0 ? (
          deck.map((card, index) => {
            const isTop = index === deck.length - 1
            // Reverse index: top card = 0, card directly behind = 1, third card = 2
            const reverseIndex = deck.length - 1 - index

            return (
              <CardNode
                key={card.id}
                card={card}
                isTop={isTop}
                index={reverseIndex}
                onDismiss={() => handleDismiss(card.id)}
              />
            )
          })
        ) : (
          /* Minimalist Dark Pill "Again" Button matching reference */
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleReset}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e2330] hover:bg-[#282f3f] text-zinc-100 text-sm font-semibold border border-zinc-700/50 shadow-md active:scale-95 transition-all cursor-pointer select-none"
          >
            <RotateCw className="w-4 h-4 text-zinc-300" />
            <span>Again</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Individual Tilted Card Node ── */
function CardNode({
  card,
  isTop,
  index,
  onDismiss,
}: {
  card: CardItem
  isTop: boolean
  index: number
  onDismiss: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Rotation during dragging
  const rotateDrag = useTransform(x, [-150, 150], [-15, 15])

  // Exact tilt angles matching reference:
  // Card 0 (Top) = 0deg, 1.0 scale
  // Card 1 (Behind) = -6deg, 0.9 scale
  // Card 2 (Bottom) = 6deg, 0.86 scale
  const staticRotation = index === 1 ? -6 : index === 2 ? 6 : index > 2 ? (index % 2 === 0 ? 8 : -8) : 0
  const staticScale = index === 0 ? 1 : index === 1 ? 0.9 : 0.86

  return (
    <motion.div
      style={{
        gridArea: '1 / 1',
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotateDrag : staticRotation,
        scale: isTop ? 1 : staticScale,
        zIndex: 50 - index,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      dragSnapToOrigin={true}
      onDragEnd={(_, info) => {
        if (!isTop) return
        // Dismiss card if dragged past 80px threshold in any direction
        if (Math.abs(info.offset.x) > 80 || Math.abs(info.offset.y) > 80) {
          onDismiss()
        }
      }}
      initial={{ scale: staticScale, opacity: 0 }}
      animate={{
        scale: isTop ? 1 : staticScale,
        rotate: isTop ? rotateDrag : staticRotation,
        opacity: 1,
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      className={`absolute h-[233px] w-[175px] origin-bottom overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-lg select-none ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      <div className="relative h-full w-full overflow-hidden pointer-events-none">
        <Image
          src={card.src}
          alt={card.alt}
          fill
          sizes="175px"
          priority={isTop}
          draggable={false}
          className="object-cover select-none"
        />
      </div>
    </motion.div>
  )
}