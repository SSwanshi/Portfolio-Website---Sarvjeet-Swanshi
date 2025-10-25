"use client";

import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  label: string;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  href,
  onClick,
  label,
  className = "",
}) => {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className={`relative group ${className}`}
    >
      <div className="relative px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-full hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-white/25">
        <div className="flex items-center gap-3">
          <span className="text-lg">🚀</span>
          {label}
          <span className="text-xl">→</span>
        </div>
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
      >
        {buttonContent}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <div className="focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full">
      {buttonContent}
    </div>
  );
};

export default AnimatedButton;