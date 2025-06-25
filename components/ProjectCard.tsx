'use client';

import { motion } from 'framer-motion';

type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
  liveUrl?: string;
  githubUrl?: string;
};

type Props = {
  project: Project;
  index: number;
};

export const ProjectCard = ({ project, index }: Props) => {
  const handleClick = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative z-10">
        <div className="text-6xl mb-4">{project.image}</div>
        <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/10 text-cyan-400 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {project.liveUrl && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(project.liveUrl)}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              Live Demo
            </motion.button>
          )}
          {project.githubUrl && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(project.githubUrl)}
              className="px-4 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              title="View Source Code"
            >
              💻
            </motion.button>
          )}
        </div>

        {!project.liveUrl && !project.githubUrl && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg cursor-not-allowed opacity-60"
            disabled
          >
            Coming Soon
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};