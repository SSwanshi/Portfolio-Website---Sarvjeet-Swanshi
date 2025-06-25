// components/ResumeButton.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ResumeButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Link href="/resume" className="block">
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-300"
          animate={{ rotate: [360, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="relative px-8 py-4 bg-slate-800/80 backdrop-blur-sm border-2 border-purple-500/50 text-purple-300 font-semibold rounded-full overflow-hidden hover:border-purple-400 transition-all duration-300 shadow-lg">
          <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
          <div className="relative z-10 flex items-center gap-3">
            <motion.span
              className="text-lg"
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              📄
            </motion.span>
            Get Resume
            <motion.span
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-xl"
            >
              ↓
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}