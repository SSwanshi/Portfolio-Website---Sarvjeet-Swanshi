import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type Skill = {
  name: string;
  level: number;
  color: string;
  logo?: ReactNode | string; 
};

type SkillsSectionProps = {
  title?: string;
  description?: string;
  skills: Skill[];
};

export const SkillsSection = ({
  title = "Skills & Expertise",
  description = "Crafting digital experiences with cutting-edge technologies",
  skills,
}: SkillsSectionProps) => {
  const skillsRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!skillsRef.current) return;

    // Simple entrance animations without ScrollTrigger
    const tl = gsap.timeline({ delay: 0.4 });

    tl.from(headingRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    .from(skillsGridRef.current?.children || [], {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.5");

    // Progress bars animation
    gsap.from(".skill-progress", {
      width: 0,
      duration: 2,
      ease: "power2.out",
      stagger: 0.2,
      delay: 1
    });


  }, []);

  const renderLogo = (logo: ReactNode | string | undefined, skillName: string) => {
    if (!logo) return null;
    
    if (typeof logo === "string") {
      // If logo is a string, treat it as an image URL
      return (
        <Image 
          src={logo} 
          alt={`${skillName} logo`}
          width={32}
          height={32}
          className="object-contain"
          priority={false}
          loading="lazy"
        />
      );
    }
    
    // If logo is a React component/icon
    return <div className="w-8 h-8 flex items-center justify-center">{logo}</div>;
  };

  return (
    <section
      ref={skillsRef}
      id="skills"
      className="py-20 bg-black relative overflow-hidden"
    >

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        <div ref={skillsGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  {skill.logo && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                      {renderLogo(skill.logo, skill.name)}
                    </motion.div>
                  )}
                  <span className="text-white font-semibold text-lg">{skill.name}</span>
                </div>
                <span className="text-white font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full skill-progress"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};