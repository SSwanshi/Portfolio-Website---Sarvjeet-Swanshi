'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FiMenu, FiX, FiHome, FiUser, FiCode, FiMail, FiDownload, FiTarget } from 'react-icons/fi'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'

export const Navbar = () => {
  const {  } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollY } = useScroll()

  useEffect(() => setMounted(true), [])

  // Handle scroll effects and active section detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
    
    // Detect active section based on scroll position
    const sections = ['home', 'about', 'projects', 'skills', 'contact']
    const sectionOffsets = sections.map(section => {
      const element = document.getElementById(section)
      return element ? element.offsetTop - 100 : 0
    })

    for (let i = sections.length - 1; i >= 0; i--) {
      if (latest >= sectionOffsets[i]) {
        setActiveSection(sections[i])
        break
      }
    }
  })

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
    setIsOpen(false) // Close mobile menu if open
  }

  // Navigation items - updated to match your sections
  const navItems = [
    { name: 'Home', href: 'home', icon: FiHome },
    { name: 'About', href: 'about', icon: FiUser },
    { name: 'Projects', href: 'projects', icon: FiCode },
    { name: 'Skills', href: 'skills', icon: FiTarget },
    { name: 'Contact', href: 'contact', icon: FiMail },
  ]

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  }

  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  }

  const linkVariants = {
    initial: { y: 0 },
    hover: { 
      y: -2,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    }
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
      }
    }
  }

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  }

  if (!mounted) return null

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <button 
                onClick={() => scrollToSection('home')}
                className="relative group cursor-pointer"
              >
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  Sarvjeet.dev
                </motion.h1>
                
                {/* Animated underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                  custom={index}
                >
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 group ${
                      activeSection === item.href
                        ? 'text-cyan-400 bg-cyan-400/10'
                        : 'text-gray-700 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-cyan-400'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Active indicator */}
                    {activeSection === item.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-600/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-600/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </motion.div>
              ))}

              {/* Resume Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/resume"
                  className="ml-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center space-x-2"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Resume</span>
                </Link>
              </motion.div>


            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">

              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiX className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMenu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 md:hidden border-l border-white/10"
            >
              <div className="p-6 pt-20">
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                  className="space-y-4"
                >
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className={`flex items-center space-x-4 p-4 rounded-xl w-full text-left transition-all duration-300 ${
                          activeSection === item.href
                            ? 'bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 text-cyan-600 dark:text-cyan-400'
                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 dark:hover:from-cyan-900/20 dark:hover:to-purple-900/20 hover:text-cyan-600 dark:hover:text-cyan-400'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-lg">{item.name}</span>
                      </button>
                    </motion.div>
                  ))}
                  
                  <motion.div variants={itemVariants} className="pt-4">
                    <Link
                      href="/resume"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg"
                    >
                      <FiDownload className="w-5 h-5" />
                      <span>Download Resume</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}