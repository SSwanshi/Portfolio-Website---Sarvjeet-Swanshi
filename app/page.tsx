"use client"

import { Hero } from "../components/Hero";
import { SkillsSection, Skill } from "../components/Skills";
import ContactSection from "../components/Contact";
import { Navbar } from "../components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Zap, GitBranch } from "lucide-react";
import { ProjectsSection } from "@/components/ProjectSection";
import { AboutSection } from "@/components/About";
import '../styles/animations.css';
import { Footer } from "@/components/Footer";


const mySkills: Skill[] = [
  {
    name: "React",
    level: 90,
    color: "from-blue-400 to-cyan-500",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  {
    name: "Next.js",
    level: 80,
    color: "from-gray-700 to-gray-900",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
  },
  {
    name: "MongoDB",
    level: 95,
    color: "from-green-500 to-emerald-600",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
  },
  {
    name: "PostgreSQL",
    level: 85,
    color: "from-blue-800 to-indigo-900",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
  },
  {
    name: "REST API",
    level: 88,
    color: "from-yellow-400 to-orange-500",
    logo: <Zap className="w-full h-full text-yellow-400" />
  },
  {
    name: "Prisma ORM",
    level: 82,
    color: "from-indigo-400 to-purple-600",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg"
  },
  {
    name: "NodeJS",
    level: 90,
    color: "from-green-500 to-emerald-600",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
  },
  {
    name: "Express",
    level: 95,
    color: "from-yellow-400 to-orange-500",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
  },
  {
    name: "C++",
    level: 85,
    color: "from-slate-600 to-slate-800",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
  },
  {
    name: "DS & Algo",
    level: 75,
    color: "from-pink-500 to-rose-600",
    logo: <GitBranch className="w-full h-full text-pink-400" />
  },
];


const projects = [
    {
      title: "LMS Platform - CloudClass",
      description: "A fully functional app designed for both students and instructors to delivers a smooth and scalable online learning experience.",
      image: "🎓",
      tags: ["React", "Next.js", "Prisma", "Stripe", "Typescript", "Railway", "Mux", "Clerk", "Tailwind"],
      color: "from-purple-500 to-pink-500",
      liveUrl: "https://cloud-class-theta.vercel.app/", // Add your deployed URL here
      githubUrl: "https://github.com/SSwanshi/CloudClass.git" // Optional: GitHub repository
    },
    {
      title: "Web Chat Application - Chatify",
      description: "An Online chatting application for seamless and secure communication between users with features of file and media sharing.",
      image: "💬",
      tags: ["React", "Node.js", "MongoDB", "Socket.io", "Express", "Tailwind", "O Auth"],
      color: "from-blue-500 to-cyan-500",
      liveUrl: "https://chatify-one-rho.vercel.app",
      githubUrl: "https://github.com/SSwanshi/Chatify_server.git"
    },
    {
      title: "Job Portal - GoHire",
      description: "A dynamic job portal where recruiters can post job and internship opportunities, and applicants can explore and apply with ease.",
      image: "📱",
      tags: ["Embedded JS", "Rest APIs", "Express", "Node JS", "Tailwind CSS", "MongoDB"],
      color: "from-green-500 to-teal-500",
    }
  ];



// Footer


export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main ref={ref} className="min-h-screen transition-colors duration-300 relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.3), transparent 50%)',
          y: backgroundY,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section - wrapped with home id */}
        <section id="home">
          <Hero />
        </section>


        {/* Other Sections */}
<AboutSection
  heading="About Me"
  subheading="Crafting digital experiences with cutting-edge technologies"
  description={[
    <div key="1" className="text-xl text-gray-300 mb-6 leading-relaxed relative">
      I&apos;m a 3rd year undergraduate student at IIIT Sricity, Chittoor, deeply passionate about
      building full-stack web applications that solve real-world problems. I specialize in modern
      technologies like React, Next.js, and Node.js, and I enjoy crafting clean, scalable digital solutions.
      <span
        className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-[shine_3s_ease-in-out_infinite]"
        style={{ animation: "shine 3s ease-in-out infinite" }}
      />
    </div>,
    <div key="2" className="text-lg text-gray-400 mb-8 leading-relaxed relative">
      Beyond coding, I love exploring tech trends, practicing DSA to sharpen my logic-building skills,
      and contributing to meaningful projects. Whether it&apos;s improving user experience or writing better code,
      I strive to grow as a developer every day.
      <span
        className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-[shine_3s_ease-in-out_infinite_reverse] opacity-50"
        style={{ animation: "shine 3s ease-in-out infinite reverse" }}
      />
    </div>
  ]}
  stats={[
    { label: "Projects Completed", value: "10+", color: "cyan-400" },
    { label: "Years Experience", value: "2+", color: "purple-400" }
  ]}
/>
        <ProjectsSection projects={projects} />
        <SkillsSection skills={mySkills} />
        <ContactSection
          heading="Let’s Work Together"
          description="Ready to bring your ideas to life? Let’s create something amazing together."
          buttons={[
            { label: "Get In Touch", variant: "primary", onClick: () => console.log("Contact clicked") },
          ]}
        />
        <Footer
  name="Sarvjeet Swanshi"
  title="Full-Stack Developer"
  socialLinks={[
    { label: 'GitHub', url: 'https://github.com/SSwanshi' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sarvjeet-swanshi-6b6b0b296' },
    { label: 'Leetcode', url: 'https://leetcode.com/u/Daboia_russelii/' },
    { label: 'Email', url: 'mailto:sarvjeetswanshi25@gmail.com' },
  ]}
/>
      </div>
    </main>
  );
}