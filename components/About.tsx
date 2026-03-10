"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LEETCODE_API = "https://alfa-leetcode-api.onrender.com";

export type CodingProfile = {
  label: string;
  url: string;
  icon: string;
  statText?: string;
};

export type SocialLink = {
  label: string;
  url: string;
  icon: string;
};

interface AboutSectionProps {
    id?: string;
    heading: string;
    subheading: string;
    description: React.ReactNode[];
    stats: {
        label: string;
        value: string;
        color: string;
    }[];
    codingProfiles?: CodingProfile[];
    socialLinks?: SocialLink[];
    leetcodeUsername?: string;
}

export const AboutSection = ({
    id = "about",
    heading,
    subheading,
    description,
    stats,
    codingProfiles = [],
    socialLinks = [],
    leetcodeUsername
}: AboutSectionProps) => {
    const aboutRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const [leetcodeStats, setLeetcodeStats] = useState<{ totalSolved: number | null; contestRating: number | null }>({ totalSolved: null, contestRating: null });

    useEffect(() => {
        if (!leetcodeUsername) return;
        let cancelled = false;
        const retryDelays = [0, 8000, 20000]; // Immediate, 8s, 20s (handles Render cold start)
        let retryIndex = 0;
        let retryId: ReturnType<typeof setTimeout>;
        const doFetch = async () => {
            try {
                const [solvedRes, contestRes] = await Promise.all([
                    fetch(`${LEETCODE_API}/${leetcodeUsername}/solved`),
                    fetch(`${LEETCODE_API}/${leetcodeUsername}/contest`)
                ]);
                if (!solvedRes.ok || !contestRes.ok) throw new Error("API not ready");
                const [solvedData, contestData] = await Promise.all([
                    solvedRes.json().catch(() => null),
                    contestRes.json().catch(() => null)
                ]);
                if (!cancelled && (solvedData?.solvedProblem != null || contestData?.contestRating != null)) {
                    setLeetcodeStats({
                        totalSolved: solvedData?.solvedProblem ?? null,
                        contestRating: contestData?.contestRating != null ? Math.round(contestData.contestRating) : null
                    });
                    return;
                }
            } catch {
                // Fall through to retry (handles cold start, timeouts, 5xx)
            }
            retryIndex++;
            if (retryIndex < retryDelays.length && !cancelled) {
                retryId = setTimeout(doFetch, retryDelays[retryIndex]);
            }
        };
        retryId = setTimeout(doFetch, retryDelays[0]);
        return () => {
            cancelled = true;
            clearTimeout(retryId);
        };
    }, [leetcodeUsername]);

    useEffect(() => {
        if (!aboutRef.current) return;

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
        .from(rightRef.current?.children || [], {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        }, "-=0.6")
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

                {/* Main content: Left (About) + Right (Education + Coding) */}
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Left: About Me content */}
                    <motion.div
                        ref={contentRef}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
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

                    {/* Right: Education + Coding profiles */}
                    <div ref={rightRef} className="lg:w-80 flex flex-col gap-6">
                        {/* Education card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-16 h-16 mb-4 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-2">
                                    <Image
                                        src="/iiits.png"
                                        alt="IIIT SriCity"
                                        fill
                                        className="object-contain p-1 rounded-2xl"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">BTech in Computer Science Engineering</h3>
                                <p className="text-gray-400 text-sm mb-1">2023 – 2027</p>
                                <p className="text-gray-300 font-medium">CGPA: 7.94</p>
                            </div>
                        </motion.div>

                        {/* Coding profiles card - stacked rows: icon left, stats right */}
                        {codingProfiles.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                            >
                                <div className="flex flex-col gap-5">
                                    {codingProfiles.map((profile) => (
                                        <div key={profile.label} className="flex flex-row items-center gap-8">
                                            <motion.a
                                                href={profile.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.15, y: -2 }}
                                                className="flex-shrink-0"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={profile.icon}
                                                    alt={profile.label}
                                                    className="w-10 h-10 object-contain"
                                                    style={{ filter: "none" }}
                                                />
                                            </motion.a>
                                            <div className="flex-1 text-sm text-gray-300">
                                                {profile.label === "LeetCode" && (leetcodeStats.totalSolved != null || leetcodeStats.contestRating != null) ? (
                                                    <>
                                                        {leetcodeStats.totalSolved != null && (
                                                            <p className="text-white font-medium">{leetcodeStats.totalSolved} solved</p>
                                                        )}
                                                        {leetcodeStats.contestRating != null && (
                                                            <p className="text-gray-400">Rating: {leetcodeStats.contestRating}</p>
                                                        )}
                                                    </>
                                                ) : profile.statText ? (
                                                    <p className="text-white font-medium">{profile.statText}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Social links: LinkedIn, GitHub, Codolio */}
                        {socialLinks.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.15 }}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                            >
                                <div className="flex flex-row justify-center items-center gap-10">
                                    {socialLinks.map((link) => (
                                        <motion.a
                                            key={link.label}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.2, y: -2 }}
                                            className="block"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={link.icon}
                                                alt={link.label}
                                                className="w-8 h-8 object-contain"
                                                style={{ filter: "none" }}
                                            />
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};