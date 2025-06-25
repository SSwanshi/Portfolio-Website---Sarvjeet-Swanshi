/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import Typewriter from './Typewriter';
import AnimatedButton from './viewProject';
import ResumeButton from './viewResume';
import { FloatingAvatar } from './FloatingAvatar';
import { ScrollIndicator } from './ScrollIndicator';
import CursorLightEffect from './CursorLightEffect';

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

export const Hero = () => {
    
    const [mounted, setMounted] = useState(false);
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

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

    // Create balls data with transform values
    const ballsData = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 40 + 20, // 20-60px
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        color: [
            'from-cyan-400/20 to-blue-500/20',
            'from-purple-400/20 to-pink-500/20',
            'from-emerald-400/20 to-teal-500/20',
            'from-amber-400/20 to-orange-500/20',
            'from-indigo-400/20 to-violet-500/20',
        ][Math.floor(Math.random() * 5)],
        duration: Math.random() * 10 + 15, // 15-25s
        delay: Math.random() * 5,
        mouseX: ballMouseX,
        mouseY: ballMouseY,
    }));

    // Create particles data with transform values
    const particlesData = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        size: Math.random() * 6 + 2, // 2-8px
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 20 + 20, // 20-40s
        delay: Math.random() * 10,
        mouseX: particleMouseX,
        mouseY: particleMouseY,
    }));

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX.set((clientX - innerWidth / 2) / innerWidth);
            mouseY.set((clientY - innerHeight / 2) / innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
                duration: 0.8
            }
        }
    };

    const itemVariants = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 200
            }
        }
    };

    const imageVariants = {
        hidden: { x: 100, opacity: 0, scale: 0.8 },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                damping: 15,
                stiffness: 100,
                delay: 0.5
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
            <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-black" style={{ opacity: mounted ? 1 : 0 }}>
                
                {/* Animated Background Elements */}
                <FloatingBalls 
                    mouseXSpring={mouseXSpring} 
                    mouseYSpring={mouseYSpring} 
                    ballsData={ballsData}
                />
                <ParticleSystem particlesData={particlesData} />
                
                {/* Animated Grid Pattern */}
                <motion.div 
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
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
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">

                        {/* Left Side - Text Content */}
                        <motion.div
                            className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1"
                            variants={itemVariants}
                        >
                            {/* Enhanced Glowing Frame */}
                            <motion.div
                                className="inset-0 rounded-3xl opacity-40 mt-5 sm:mt-0 sm:absolute"
                                style={{
                                    background:
                                        'linear-gradient(45deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))',
                                    filter: 'blur(40px)',
                                    x: useTransform(mouseXSpring, [-1, 1], [-5, 5]),
                                    y: useTransform(mouseYSpring, [-1, 1], [-5, 5]),
                                }}
                                animate={pulseAnimation}
                            />

                            <motion.div
                                className="relative p-8 lg:p-12 rounded-3xl backdrop-blur-lg bg-slate-900/30 border border-slate-600/40 shadow-2xl"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                style={{
                                    x: useTransform(mouseXSpring, [-1, 1], [-2, 2]),
                                    y: useTransform(mouseYSpring, [-1, 1], [-2, 2]),
                                }}
                            >
                                {/* Animated Title */}
                                <motion.div
                                    variants={itemVariants}
                                    className="relative"
                                >
                                    <motion.h1
                                        className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear" as const
                                        }}
                                        style={{
                                            backgroundSize: '200% 200%',
                                        }}
                                    >
                                        Hi, I&apos;m Sarvjeet Swanshi
                                    </motion.h1>

                                    {/* Enhanced glowing underline */}
                                    <motion.div
                                        className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mx-auto lg:mx-0 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "80%" }}
                                        transition={{ duration: 1, delay: 1 }}
                                        style={{
                                            boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)',
                                        }}
                                    />
                                </motion.div>

                                {/* Animated Subtitle */}
                                <motion.p
                                    variants={itemVariants}
                                    className="mt-8 text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl leading-relaxed"
                                >
                                    A passionate{' '}
                                    <Typewriter titles={['full-stack web developer', 'problem solver', 'tech enthusiast']} />
                                    <br />
                                    crafting modern, responsive websites & apps that push the boundaries of user experience.
                                </motion.p>

                                {/* Enhanced Interactive Buttons */}
                                <motion.div
                                    className="mt-10 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                                    variants={itemVariants}
                                >
                                    {/* View Projects Button - Updated with scroll function */}
                                    <AnimatedButton onClick={scrollToProjects} label="View Projects" />
                                    {/* Get Resume Button */}
                                    <ResumeButton />

                                </motion.div>

                                {/* Enhanced Floating Tech Icons */}
                                <motion.div
                                    className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-2xl border border-slate-500/40 backdrop-blur-sm"
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
                                    className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-2xl border border-slate-500/40 backdrop-blur-sm"
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
                                    className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-2xl border border-slate-500/40 backdrop-blur-sm"
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
                        <FloatingAvatar
                            mouseXSpring={mouseXSpring}
                            mouseYSpring={mouseYSpring}
                            variants={imageVariants}
                            className="order-1 lg:order-2 mt-12 lg:mt-0"
                        />
                    </div>

                    {/* Enhanced Scroll Indicator */}
                    <ScrollIndicator mouseXSpring={mouseXSpring} />

                </motion.div>
            </section>
        </div>
    );
};