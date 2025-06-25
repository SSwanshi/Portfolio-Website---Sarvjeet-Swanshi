// ScrollIndicator.tsx
'use client'

import { motion, useTransform, MotionValue } from 'framer-motion'

interface ScrollIndicatorProps {
  mouseXSpring: MotionValue<number>
}

export function ScrollIndicator({ mouseXSpring }: ScrollIndicatorProps) {
  const x = useTransform(mouseXSpring, [-1, 1], [-5, 5])

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ x }}
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-md"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="w-8 h-12 border-2 border-slate-400/60 rounded-full flex justify-center backdrop-blur-sm bg-slate-800/20 shadow-lg">
          <motion.div
            className="w-1.5 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mt-2 shadow-lg"
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)' }}
          />
        </div>
      </div>
    </motion.div>
  )
}