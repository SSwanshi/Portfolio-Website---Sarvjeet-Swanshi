'use client'

import { motion, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'

interface FloatingAvatarProps {
  mouseXSpring: MotionValue<number>
  mouseYSpring: MotionValue<number>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any
  className?: string
}

export const FloatingAvatar: React.FC<FloatingAvatarProps> = ({
  mouseXSpring,
  mouseYSpring,
  variants,
  className = '',
}) => {
  const x = useTransform(mouseXSpring, [-1, 1], [-10, 10])
  const y = useTransform(mouseYSpring, [-1, 1], [-10, 10])

  return (
    <motion.div className={`flex justify-center lg:justify-end ${className}`} variants={variants}>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ x, y }}
      >
        <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden backdrop-blur-sm bg-slate-800/40 border border-slate-500/40 shadow-2xl">
          <Image
            src="/self.jpg"
            alt="Sarvjeet - Full Stack Developer"
            fill
            className="object-cover transition-all duration-500 hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/20" />
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                'linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.3), transparent, rgba(139, 92, 246, 0.3), transparent)',
              backgroundSize: '400% 400%',
            }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Floating orbs */}
        <motion.div
          className="absolute -top-8 -right-8 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-2xl border border-slate-400/30"
          animate={{ y: [-8, 8, -8], scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl border border-slate-400/30"
          animate={{ x: [-4, 4, -4], y: [4, -4, 4], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 -left-10 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-2xl border border-slate-400/30"
          animate={{ x: [-3, 3, -3], opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  )
}