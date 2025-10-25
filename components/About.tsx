import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutSectionProps {
    id?: string; // ← Add this line
    heading: string;
    subheading: string;
    description: React.ReactNode[]; // supports JSX like <p>...</p>
    stats: {
        label: string;
        value: string;
        color: string;
    }[];
}

export const AboutSection = ({
    id = "about",
    heading,
    subheading,
    description,
    stats
}: AboutSectionProps) => {
    const aboutRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!aboutRef.current) return;

        // Simple entrance animations without ScrollTrigger
        const tl = gsap.timeline({ delay: 0.5 });

        tl.from(headingRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
        .from(contentRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.5")
        .from(statsRef.current?.children || [], {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.3");


    }, []);

    return (
        <section
            ref={aboutRef}
            id={id}
            className="py-20 bg-black relative overflow-hidden"
        >

            <div className="container mx-auto px-4 relative z-10">
                {/* Heading */}
                <motion.div
                    ref={headingRef}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold text-white mb-4">
                        {heading}
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">{subheading}</p>
                </motion.div>

                {/* Description */}
                <motion.div
                    ref={contentRef}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                >
                    <div className="flex flex-col items-center">
                        <motion.div
                            className="text-8xl mb-6 relative"
                            animate={{
                                textShadow: [
                                    "0 0 5px rgba(255, 255, 255, 0.2)",
                                    "0 0 20px rgba(255, 255, 255, 0.6)",
                                    "0 0 5px rgba(255, 255, 255, 0.2)"
                                ]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            👨‍💻
                        </motion.div>

                        <div className="w-full max-w-2xl text-center">
                            {description.map((para, i) => (
                                <div key={i}>
                                    {para}
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div ref={statsRef} className="grid grid-cols-2 gap-6 mt-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    className="text-center p-4 bg-white/5 rounded-xl border border-white/20 relative overflow-hidden"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="text-3xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-300">{stat.label}</div>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};