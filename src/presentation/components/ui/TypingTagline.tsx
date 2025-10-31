import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypingTaglineProps {
  taglines: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const TypingTagline: React.FC<TypingTaglineProps> = ({
  taglines,
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}) => {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (taglines.length === 0) return;
    if (taglines.length === 1) {
      setCurrentText(taglines[0]);
      return;
    }

    const currentFullText = taglines[currentTaglineIndex];

    const handleTyping = () => {
      if (isPaused) {
        // Pause after completing a tagline
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
        return;
      }

      if (!isDeleting) {
        // Typing forward
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        } else {
          // Finished typing, pause before deleting
          setIsPaused(true);
        }
      } else {
        // Deleting backward
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next tagline
          setIsDeleting(false);
          setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
        }
      }
    };

    const timeout = setTimeout(
      handleTyping,
      isPaused ? 0 : isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentTaglineIndex,
    isDeleting,
    isPaused,
    taglines,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <div className={`flex items-center min-h-[3rem] ${className}`}>
      <span className="bg-gradient-to-r from-tokyo-blue via-tokyo-purple to-tokyo-cyan bg-clip-text text-transparent">
        {currentText || '\u00A0'}
      </span>
      <motion.span
        className="ml-1 w-0.5 h-8 bg-tokyo-cyan inline-block"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};
