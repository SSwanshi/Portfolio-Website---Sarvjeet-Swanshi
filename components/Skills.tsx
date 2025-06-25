import { motion } from "framer-motion";
import { ReactNode } from "react";
import Image from "next/image";

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
      id="skills"
      className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
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
                <span className="text-cyan-400 font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
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