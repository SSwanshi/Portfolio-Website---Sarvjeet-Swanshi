'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'
import { FiMenu, FiX, FiHome, FiUser, FiCode, FiMail, FiDownload, FiTarget } from 'react-icons/fi'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface NavbarProps {
  loaderComplete?: boolean;
}

export const Navbar = ({ loaderComplete = true }: NavbarProps) => {
  const {  } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  
  
  const { scrollY } = useScroll()

  // Refs for GSAP animations
  const navbarRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLButtonElement>(null)
  const navItemsRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // GSAP Animations
  useEffect(() => {
    if (!mounted) return;

    // Navbar entrance animation
    gsap.from(navbarRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    // Logo animation
    gsap.from(logoRef.current, {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1.7)"
    });

    // Nav items animation
    gsap.from(navItemsRef.current?.children || [], {
      y: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.5,
      ease: "power3.out"
    });

    // Mobile menu animation
    if (isOpen) {
      gsap.from(mobileMenuRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.out"
      });
    }

  }, [mounted, isOpen]);

  // Handle scroll effects and active section detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
    
    // Detect active section based on scroll position
    const sections = ['home', 'about', 'projects', 'skills', 'contact']
    
    // Get all section elements and their positions
    const sectionElements = sections.map(section => {
      const element = document.getElementById(section)
      return {
        id: section,
        element,
        top: element ? element.offsetTop : 0,
        bottom: element ? element.offsetTop + element.offsetHeight : 0
      }
    })

    // Check if we're near the bottom of the page (contact section)
    const documentHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0
    const isNearBottom = latest + windowHeight >= documentHeight - 100

    if (isNearBottom) {
      setActiveSection('contact')
    } else {
      // Find the section that contains the current scroll position
      let activeSectionFound = 'home'
      
      for (const section of sectionElements) {
        if (latest >= section.top - 100 && latest < section.bottom - 100) {
          activeSectionFound = section.id
          break
        }
      }
      
      setActiveSection(activeSectionFound)
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

  if (!mounted || !loaderComplete) return null

  return (
    <>
      <motion.nav
        ref={navbarRef}
        variants={navVariants}
        initial="visible"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/20' 
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
                ref={logoRef}
                onClick={() => scrollToSection('home')}
                className="relative group cursor-pointer"
              >
                <motion.h1 
                  className="text-2xl font-bold text-white"
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(255, 255, 255, 0)',
                      '0 0 20px rgba(255, 255, 255, 0.8)',
                      '0 0 0px rgba(255, 255, 255, 0)'
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Sarvjeet.dev
                </motion.h1>
                
                {/* Code-style underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            <div ref={navItemsRef} className="hidden md:flex items-center space-x-1">
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
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Active indicator */}
                    {activeSection === item.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-white/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/10"
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
                  className="ml-4 px-6 py-2 bg-white text-black font-semibold rounded-full shadow-lg hover:shadow-white/25 transition-all duration-300 flex items-center space-x-2"
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
                className="p-2 rounded-full bg-white/10 text-white border border-white/20"
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
              ref={mobileMenuRef}
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl shadow-2xl z-50 md:hidden border-l border-white/20"
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
                            ? 'bg-white/10 text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
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
                      className="flex items-center justify-center space-x-2 w-full p-4 bg-white text-black font-semibold rounded-xl shadow-lg"
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