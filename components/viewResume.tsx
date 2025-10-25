// components/ResumeButton.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ResumeButton() {
  const handleResumeClick = () => {
    console.log('Resume button clicked - navigating to /resume');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="relative group z-20"
    >
      <Link href="/resume" className="block cursor-pointer" onClick={handleResumeClick}>
        <div className="relative px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-full hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-white/25">
          <div className="flex items-center gap-3">
            <span className="text-lg">📄</span>
            Get Resume
            <span className="text-xl">↓</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}