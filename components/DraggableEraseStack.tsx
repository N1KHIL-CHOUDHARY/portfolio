'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  animate,
} from 'framer-motion'
import { RotateCw } from 'lucide-react'
import ImageWithSkeleton from './ImageWithSkeleton'

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
  cards,
  images,
}: {
  cards?: CardItem[]
  images?: string[]
}) {
  // ── Fix #1: memoize initialCards so handleReset always gets the current value ──
  const initialCards = useMemo<CardItem[]>(
    () =>
      cards ??
      (images
        ? images.map((src, i) => ({ id: String(i + 1), src, alt: `Photo ${i + 1}` }))
        : DEFAULT_CARDS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // Serialize arrays to strings so memo recalculates only on actual content changes
      cards ? JSON.stringify(cards) : null,
      images ? JSON.stringify(images) : null,
    ]
  )

  const [deck, setDeck] = useState<CardItem[]>(initialCards)

  // ── Fix #1 (cont.): re-sync deck when the source images/cards prop changes ──
  useEffect(() => {
    setDeck(initialCards)
  }, [initialCards])

  const handleDismiss = (id: string) => {
    setDeck((prev) => prev.filter((c) => c.id !== id))
  }

  const handleReset = () => {
    setDeck(initialCards)
  }

  return (
    <div className="relative grid h-[233px] w-[175px] place-items-center shrink-0 select-none overflow-visible my-2">
      <AnimatePresence>
        {deck.length > 0 ? (
          deck.map((card, index) => {
            const isTop = index === deck.length - 1
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
  // Track whether a dismiss flight is in progress to prevent double-fires
  const isDismissing = useRef(false)

  const rotateDrag = useTransform(x, [-150, 150], [-15, 15])

  const staticRotation =
    index === 1 ? -6 : index === 2 ? 6 : index > 2 ? (index % 2 === 0 ? 8 : -8) : 0
  const staticScale = index === 0 ? 1 : index === 1 ? 0.9 : 0.86

  // ── Fix #4: no dragSnapToOrigin — fly card off-screen, then call onDismiss ──
  const flyOffAndDismiss = async (offsetX: number, offsetY: number) => {
    if (isDismissing.current) return
    isDismissing.current = true

    const direction = {
      x: offsetX > 0 ? 300 : offsetX < 0 ? -300 : 0,
      y: offsetY > 0 ? 300 : offsetY < 0 ? -300 : 0,
    }
    // If only one axis exceeded the threshold, keep the other neutral
    if (Math.abs(offsetX) <= 80) direction.x = 0
    if (Math.abs(offsetY) <= 80) direction.y = 0

    await Promise.all([
      animate(x, direction.x, { duration: 0.2, ease: 'easeOut' }),
      animate(y, direction.y, { duration: 0.2, ease: 'easeOut' }),
    ])
    onDismiss()
  }

  return (
    // ── Fix #6: use gridArea overlay only — removed 'absolute' class ──
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
      // ── Fix #4: no dragSnapToOrigin; constraints allow free drag ──
      dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        if (!isTop) return
        if (Math.abs(info.offset.x) > 80 || Math.abs(info.offset.y) > 80) {
          flyOffAndDismiss(info.offset.x, info.offset.y)
        } else {
          // Snap back manually if threshold not met
          animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
          animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
        }
      }}
      initial={{ scale: staticScale, opacity: 0 }}
      animate={{
        scale: isTop ? 1 : staticScale,
        opacity: 1,
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      className={`h-[233px] w-[175px] origin-bottom overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-lg select-none ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      <ImageWithSkeleton
        src={card.src}
        alt={card.alt}
        fill
        sizes="175px"
        draggable={false}
        containerClassName="h-full w-full pointer-events-none"
        className="object-cover select-none"
        priority={isTop}
        fetchPriority={isTop ? 'high' : 'low'}
        loading={isTop ? 'eager' : 'lazy'}
      />
    </motion.div>
  )
}