'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

interface TechLoaderProps {
  onComplete?: () => void
}

export const TechLoader: React.FC<TechLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentCode, setCurrentCode] = useState('')
  const [loadingText, setLoadingText] = useState('Initializing...')

  const codeSnippets = useMemo(() => [
    'const portfolio = new Developer();',
    'portfolio.skills = ["React", "Next.js", "TypeScript"];',
    'portfolio.experience = "2+ years";',
    'portfolio.passion = "Full-Stack Development";',
    'portfolio.loading = false;',
    'portfolio.ready = true;'
  ], [])

  const loadingSteps = useMemo(() => [
    'Initializing...',
    'Loading components...',
    'Compiling assets...',
    'Optimizing performance...',
    'Finalizing...',
    'Ready!'
  ], [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete?.()
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const codeInterval = setInterval(() => {
      const randomCode = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      setCurrentCode(randomCode)
    }, 200)

    return () => clearInterval(codeInterval)
  }, [codeSnippets])

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingSteps.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingSteps.length
        return loadingSteps[nextIndex]
      })
    }, 800)

    return () => clearInterval(textInterval)
  }, [loadingSteps])

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20 grid-pulse">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Binary Rain Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400/30 font-mono text-sm binary-fall"
            style={{
              left: `${i * 5}%`,
              top: '-100px'
            }}
                  animate={{
                    y: [0, (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100],
                    opacity: [0, 1, 0]
                  }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'linear'
            }}
          >
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j}>
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Main Loader Content */}
      <div className="relative z-10 text-center">
        {/* Terminal Window */}
        <motion.div
          className="bg-black/90 border border-cyan-400/30 rounded-lg p-4 sm:p-6 md:p-8 w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] max-w-3xl mx-auto backdrop-blur-sm terminal-glow min-h-[350px] sm:min-h-[400px] flex flex-col justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Terminal Header */}
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-2 sm:ml-4 text-cyan-400 font-mono text-xs sm:text-sm">
              portfolio-loader@dev:~$
            </div>
          </div>

          {/* Code Display */}
          <div className="text-left mb-4 sm:mb-6 overflow-hidden">
            <div className="text-cyan-400 font-mono text-xs sm:text-sm mb-2">
              <span className="text-green-400">$</span> npm run dev
            </div>
            <motion.div
              className="text-white font-mono text-xs sm:text-sm break-words whitespace-pre-wrap"
              key={currentCode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentCode}
              <motion.span
                className="text-cyan-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between text-cyan-400 font-mono text-xs sm:text-sm mb-2">
              <span className="truncate flex-1 mr-2">{loadingText}</span>
              <span className="flex-shrink-0">{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Floating Tech Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {['</>', '{}', '=>', '()', '<div>'].map((icon, i) => (
            <motion.div
              key={i}
              className="absolute text-cyan-400/20 font-mono text-2xl"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CSS for grid animation */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  )
}
