/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typewriter from './Typewriter';
import AnimatedButton from './viewProject';
import ResumeButton from './viewResume';
import { FloatingAvatar } from './FloatingAvatar';
import { ScrollIndicator } from './ScrollIndicator';
import CursorLightEffect from './CursorLightEffect';
import { TechLoader } from './TechLoader';
import { NetworkThreeScene } from './NetworkThreeScene';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Floating Balls Component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FloatingBalls = ({ mouseXSpring, mouseYSpring, ballsData }: { 
    mouseXSpring: any, 
    mouseYSpring: any,
    ballsData: Array<{
        id: number;
        size: number;
        initialX: number;
        initialY: number;
        color: string;
        duration: number;
        delay: number;
        mouseX: any;
        mouseY: any;
    }>
}) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {ballsData.map((ball) => (
                <motion.div
  key={ball.id}
  className={`absolute rounded-full bg-gradient-to-br ${ball.color} backdrop-blur-sm border border-white/10`}
  style={{
    width: ball.size,
    height: ball.size,
    left: `${ball.initialX}%`,
    top: `${ball.initialY}%`,
  }}
  initial={{
    x: ball.mouseX,
    y: ball.mouseY,
  }}
  animate={{
    x: [0, 100, -50, 150, 0],
    y: [0, -80, 120, -60, 0],
    scale: [1, 1.2, 0.8, 1.1, 1],
    opacity: [0.3, 0.7, 0.2, 0.6, 0.3],
  }}
  transition={{
    duration: ball.duration,
    repeat: Infinity,
    ease: "linear",
    delay: ball.delay,
  }}
/>
            ))}
        </div>
    );
};

// Particle System Component
const ParticleSystem = ({ particlesData }: { 
    particlesData: Array<{
        id: number;
        size: number;
        initialX: number;
        initialY: number;
        duration: number;
        delay: number;
        mouseX: any;
        mouseY: any;
    }>
}) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particlesData.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.initialX}%`,
                        top: `${particle.initialY}%`,
                        x: particle.mouseX,
                        y: particle.mouseY,
                    }}
                    animate={{
                        x: [0, 50, -30, 80, 0],
                        y: [0, -100, 150, -80, 0],
                        opacity: [0, 0.6, 0.2, 0.8, 0],
                        scale: [0, 1, 0.5, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                />
            ))}
        </div>
    );
};

interface HeroProps {
  onLoaderComplete?: (complete: boolean) => void;
}

export const Hero = ({ onLoaderComplete }: HeroProps) => {
    const [mounted, setMounted] = useState(false);
    const [loaderComplete, setLoaderComplete] = useState(false);
    // Mouse position is handled internally by NetworkThreeScene
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    // Refs for GSAP animations
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const binaryRainRef = useRef<HTMLDivElement>(null);

    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 700 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    // Transform values for animated background elements
    const gridX = useTransform(mouseXSpring, [-1, 1], [-5, 5]);
    const gridY = useTransform(mouseYSpring, [-1, 1], [-5, 5]);
    
    // Transform values for balls and particles
    const ballMouseX = useTransform(mouseXSpring, [-1, 1], [-30, 30]);
    const ballMouseY = useTransform(mouseYSpring, [-1, 1], [-20, 20]);
    const particleMouseX = useTransform(mouseXSpring, [-1, 1], [-10, 10]);
    const particleMouseY = useTransform(mouseYSpring, [-1, 1], [-10, 10]);

    // Scroll to projects section function
    const scrollToProjects = () => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Create balls data with transform values - use deterministic values for SSR
    const ballsData = Array.from({ length: 15 }, (_, i) => {
        // Use deterministic seed based on index for SSR consistency
        const seed = i * 0.1;
        const size = (Math.sin(seed) * 0.5 + 0.5) * 40 + 20; // 20-60px
        const initialX = (Math.sin(seed * 2) * 0.5 + 0.5) * 100;
        const initialY = (Math.sin(seed * 3) * 0.5 + 0.5) * 100;
        const colorIndex = Math.floor((Math.sin(seed * 4) * 0.5 + 0.5) * 5);
        const duration = (Math.sin(seed * 5) * 0.5 + 0.5) * 10 + 15; // 15-25s
        const delay = (Math.sin(seed * 6) * 0.5 + 0.5) * 5;
        
        return {
            id: i,
            size,
            initialX,
            initialY,
            color: [
                'from-cyan-400/20 to-blue-500/20',
                'from-purple-400/20 to-pink-500/20',
                'from-emerald-400/20 to-teal-500/20',
                'from-amber-400/20 to-orange-500/20',
                'from-indigo-400/20 to-violet-500/20',
            ][colorIndex],
            duration,
            delay,
            mouseX: ballMouseX,
            mouseY: ballMouseY,
        };
    });

    // Create particles data with transform values - use deterministic values for SSR
    const particlesData = Array.from({ length: 25 }, (_, i) => {
        // Use deterministic seed based on index for SSR consistency
        const seed = i * 0.15;
        const size = (Math.sin(seed) * 0.5 + 0.5) * 6 + 2; // 2-8px
        const initialX = (Math.sin(seed * 2) * 0.5 + 0.5) * 100;
        const initialY = (Math.sin(seed * 3) * 0.5 + 0.5) * 100;
        const duration = (Math.sin(seed * 4) * 0.5 + 0.5) * 20 + 20; // 20-40s
        const delay = (Math.sin(seed * 5) * 0.5 + 0.5) * 10;
        
        return {
            id: i,
            size,
            initialX,
            initialY,
            duration,
            delay,
            mouseX: particleMouseX,
            mouseY: particleMouseY,
        };
    });

    // Binary rain effect - deterministic for SSR
    const createBinaryRain = () => {
        if (!binaryRainRef.current) return;
        
        const binaryChars = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F'];
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'binary-rain';
            column.style.left = `${i * 20}px`;
            column.style.top = '-100px';
            
            // Use deterministic values based on column index
            const seed = i * 0.1;
            const delay = (Math.sin(seed) * 0.5 + 0.5) * 5;
            const duration = 3 + (Math.sin(seed * 2) * 0.5 + 0.5) * 4;
            
            column.style.animationDelay = `${delay}s`;
            column.style.animationDuration = `${duration}s`;
            
            let binaryString = '';
            for (let j = 0; j < 20; j++) {
                const charSeed = (i + j) * 0.1;
                const charIndex = Math.floor((Math.sin(charSeed) * 0.5 + 0.5) * binaryChars.length);
                binaryString += binaryChars[charIndex] + '\n';
            }
            column.textContent = binaryString;
            
            binaryRainRef.current.appendChild(column);
        }
    };

    useEffect(() => {
        // Start the loader sequence
        const timer = setTimeout(() => {
            setMounted(true);
        }, 1000);

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX.set((clientX - innerWidth / 2) / innerWidth);
            mouseY.set((clientY - innerHeight / 2) / innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseX, mouseY]);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Only create binary rain on client side
        if (typeof window !== 'undefined') {
            createBinaryRain();
        }
    }, []);

    // GSAP Animations
    useEffect(() => {
        if (!mounted) return;

        // Smooth loading animation
        const tl = gsap.timeline({ 
            delay: 0.2,
            onStart: () => {
                // Ensure smooth transition from loading state
                gsap.set(heroRef.current, { opacity: 1 });
            }
        });

        // Hero entrance animation with smoother easing
        tl.from(titleRef.current, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        })
        .from(subtitleRef.current, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")
        .from(buttonsRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6")
        .from(avatarRef.current, {
            x: 80,
            opacity: 0,
            scale: 0.8,
            duration: 1.4,
            ease: "back.out(1.2)"
        }, "-=1");

        // Floating elements animation - smoother
        gsap.to(".floating-element", {
            y: "random(-15, 15)",
            x: "random(-8, 8)",
            rotation: "random(-3, 3)",
            duration: "random(3, 6)",
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.3
        });

        // Code typing effect
        gsap.to(".code-typing", {
            borderColor: "transparent",
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });

        // Matrix sweep effect
        gsap.to(".matrix-effect", {
            backgroundPosition: "200% 200%",
            duration: 3,
            ease: "none",
            repeat: -1
        });

    }, [mounted]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.15,
                duration: 1.2,
                ease: "easeOut" as const
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 100,
                duration: 0.8
            }
        }
    };

    const imageVariants = {
        hidden: { x: 80, opacity: 0, scale: 0.8 },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                damping: 25,
                stiffness: 80,
                delay: 0.3,
                duration: 1.2
            }
        }
    };

    const pulseAnimation = {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    };

    return (
        <div className="relative">
            <CursorLightEffect />
            
            {/* Techy Loader */}
            {!loaderComplete && (
                <TechLoader onComplete={() => {
                    setLoaderComplete(true);
                    onLoaderComplete?.(true);
                }} />
            )}
            
            <section 
                ref={heroRef}
                className="relative min-h-screen overflow-hidden bg-black transition-opacity duration-1000" 
                style={{ opacity: mounted && loaderComplete ? 1 : 0 }}
            >
                {/* Three.js Network 3D Scene */}
                <NetworkThreeScene />
                
                {/* Binary Rain Effect */}
                <div ref={binaryRainRef} className="absolute inset-0 pointer-events-none" />
                
                {/* Animated Background Elements */}
                <FloatingBalls 
                    mouseXSpring={mouseXSpring} 
                    mouseYSpring={mouseYSpring} 
                    ballsData={ballsData}
                />
                <ParticleSystem particlesData={particlesData} />
                
                {/* Developer Grid Pattern */}
                <motion.div 
                    className="absolute inset-0 opacity-20 matrix-effect"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        x: gridX,
                        y: gridY,
                    }}
                    animate={{
                        backgroundPosition: ['0px 0px', '50px 50px'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Main Content */}
                <motion.div
                    className="relative z-10 min-h-screen px-4 py-8"
                    style={{ y, opacity }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">

                        {/* Left Side - Text Content */}
                        <motion.div
                            className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1"
                            variants={itemVariants}
                        >
                            {/* Developer Code Frame */}
                            <motion.div
                                className="inset-0 rounded-3xl opacity-30 mt-5 sm:mt-0 sm:absolute"
                                style={{
                                    background:
                                        'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(102, 102, 102, 0.1), rgba(255, 255, 255, 0.1))',
                                    filter: 'blur(40px)',
                                    x: useTransform(mouseXSpring, [-1, 1], [-5, 5]),
                                    y: useTransform(mouseYSpring, [-1, 1], [-5, 5]),
                                }}
                                animate={pulseAnimation}
                            />

                            <motion.div
                                className="relative p-6 lg:p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/20 shadow-2xl floating-element max-w-lg mx-auto lg:mx-0"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                style={{
                                    x: useTransform(mouseXSpring, [-1, 1], [-2, 2]),
                                    y: useTransform(mouseYSpring, [-1, 1], [-2, 2]),
                                }}
                            >
                                {/* Developer Title */}
                                <motion.div
                                    ref={titleRef}
                                    className="relative"
                                >
                                    <motion.h1
                                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 code-typing"
                                        animate={{
                                            textShadow: [
                                                '0 0 0px rgba(255, 255, 255, 0)',
                                                '0 0 15px rgba(255, 255, 255, 0.6)',
                                                '0 0 0px rgba(255, 255, 255, 0)'
                                            ],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear" as const
                                        }}
                                    >
                                        Hi, I&apos;m Sarvjeet Swanshi
                                    </motion.h1>

                                    {/* Code-style underline */}
                                    <motion.div
                                        className="h-1 bg-white mx-auto lg:mx-0 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "80%" }}
                                        transition={{ duration: 1, delay: 1 }}
                                        style={{
                                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
                                        }}
                                    />
                                </motion.div>

                                {/* Developer Subtitle */}
                                <motion.p
                                    ref={subtitleRef}
                                    className="mt-4 text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed"
                                >
                                    A passionate{' '}
                                    <Typewriter titles={['full-stack web developer', 'problem solver', 'tech enthusiast']} />
                                    <br />
                                    crafting modern, responsive websites & apps that push the boundaries of user experience.
                                </motion.p>

                                {/* Developer Action Buttons */}
                                <motion.div
                                    ref={buttonsRef}
                                    className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                                    variants={itemVariants}
                                >
                                    {/* View Projects Button - Updated with scroll function */}
                                    <AnimatedButton onClick={scrollToProjects} label="View Projects" />
                                    {/* Get Resume Button */}
                                    <ResumeButton />
                                </motion.div>

                                {/* Floating Developer Icons */}
                                <motion.div
                                    className="absolute -top-6 -left-6 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold shadow-xl border border-white/20 backdrop-blur-sm floating-element"
                                    animate={{
                                        y: [-10, 10, -10],
                                        rotate: [0, 10, -10, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut" as const
                                    }}
                                    style={{
                                        x: useTransform(mouseXSpring, [-1, 1], [-3, 3]),
                                        y: useTransform(mouseYSpring, [-1, 1], [-3, 3]),
                                    }}
                                >
                                    JS
                                </motion.div>

                                <motion.div
                                    className="absolute -top-3 -right-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-lg shadow-xl border border-white/20 backdrop-blur-sm floating-element"
                                    animate={{
                                        y: [10, -10, 10],
                                        x: [5, -5, 5],
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut" as const,
                                        delay: 1
                                    }}
                                    style={{
                                        x: useTransform(mouseXSpring, [-1, 1], [2, -2]),
                                        y: useTransform(mouseYSpring, [-1, 1], [2, -2]),
                                    }}
                                >
                                    ⚛
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white text-lg shadow-xl border border-white/20 backdrop-blur-sm floating-element"
                                    animate={{
                                        rotate: [0, 360],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut" as const
                                    }}
                                    style={{
                                        x: useTransform(mouseXSpring, [-1, 1], [4, -4]),
                                        y: useTransform(mouseYSpring, [-1, 1], [4, -4]),
                                    }}
                                >
                                    🔥
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Right Side - Enhanced Image */}
                        <div ref={avatarRef} className="order-1 lg:order-2 mt-16 lg:mt-0 lg:ml-8">
                            <FloatingAvatar
                                mouseXSpring={mouseXSpring}
                                mouseYSpring={mouseYSpring}
                                variants={imageVariants}
                            />
                        </div>
                    </div>

                    {/* Enhanced Scroll Indicator */}
                    <ScrollIndicator mouseXSpring={mouseXSpring} />

                </motion.div>
            </section>
        </div>
    );
};