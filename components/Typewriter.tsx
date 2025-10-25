import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  titles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({
  titles,
  typingSpeed = 100,
  deletingSpeed = 50
}) => {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && displayedText === currentTitle) {
      speed = 1000; // Pause before deleting
    }

    const timer = setTimeout(() => {
      if (!isDeleting && displayedText === currentTitle) {
        setIsDeleting(true);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      } else {
        const nextText = isDeleting
          ? currentTitle.slice(0, displayedText.length - 1)
          : currentTitle.slice(0, displayedText.length + 1);
        setDisplayedText(nextText);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTitleIndex, titles, typingSpeed, deletingSpeed]);

  return (
    <motion.span
      className="font-semibold text-white relative code-typing"
      animate={{
        textShadow: [
          '0 0 0px rgba(255, 255, 255, 0)',
          '0 0 20px rgba(255, 255, 255, 0.8)',
          '0 0 0px rgba(255, 255, 255, 0)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {displayedText}
      <motion.span
        className="inline-block w-0.5 h-6 bg-white ml-1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.span>
  );
};

export default Typewriter;