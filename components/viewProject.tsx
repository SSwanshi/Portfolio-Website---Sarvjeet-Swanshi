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
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold rounded-full overflow-hidden shadow-lg border border-cyan-500/30">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
        <div className="relative z-10 flex items-center gap-3">
          <motion.span
            className="text-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🚀
          </motion.span>
          {label}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl"
          >
            →
          </motion.span>
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