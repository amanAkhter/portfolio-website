import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Rocket, Star, Zap, Heart, Code } from 'lucide-react';
import {
  useTripleClickEasterEgg,
  useSecretCodeEasterEgg,
  useScrollEasterEgg,
  useTimeBasedEasterEgg,
  useKonamiCodeEasterEgg,
  useShakeEasterEgg,
  useDoubleTapEasterEgg
} from '../../hooks/useEasterEggs';

// Security: Generate a signature for achievement data to prevent tampering
const EASTER_EGG_SECRET = 'portfolio-easter-egg-2025-secure-key';

const generateSignature = (data: string[]): string => {
  const sortedData = [...data].sort().join('|');
  const combined = `${sortedData}:${EASTER_EGG_SECRET}`;
  
  // Simple but effective hash function
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

const verifySignature = (data: string[], signature: string): boolean => {
  return generateSignature(data) === signature;
};

// Additional security: Track achievement timestamps to detect suspicious patterns
interface AchievementTimestamp {
  id: string;
  timestamp: number;
}

const validateTimestamps = (timestamps: AchievementTimestamp[]): boolean => {
  if (timestamps.length === 0) return true;
  
  // Check if all achievements were unlocked in less than 1 second (suspicious)
  const times = timestamps.map(t => t.timestamp).sort((a, b) => a - b);
  const firstTime = times[0];
  const lastTime = times[times.length - 1];
  
  // If 7 achievements unlocked in less than 10 seconds, it's likely cheating
  if (timestamps.length >= 7 && (lastTime - firstTime) < 10000) {
    return false;
  }
  
  // Check for timestamps in the future or way in the past
  const now = Date.now();
  for (const t of timestamps) {
    if (t.timestamp > now + 60000 || t.timestamp < now - 31536000000) { // 1 year ago
      return false;
    }
  }
  
  return true;
};

const saveAchievements = (achievementIds: string[]): void => {
  const signature = generateSignature(achievementIds);
  localStorage.setItem('unlockedAchievements', JSON.stringify(achievementIds));
  localStorage.setItem('achievementSignature', signature);
};

const saveAchievementTimestamp = (id: string): void => {
  try {
    const stored = localStorage.getItem('achievementTimestamps');
    const timestamps: AchievementTimestamp[] = stored ? JSON.parse(stored) : [];
    
    // Add new timestamp
    timestamps.push({ id, timestamp: Date.now() });
    
    localStorage.setItem('achievementTimestamps', JSON.stringify(timestamps));
  } catch {
    // If error, reset
    localStorage.setItem('achievementTimestamps', JSON.stringify([{ id, timestamp: Date.now() }]));
  }
};

const loadAchievements = (): string[] => {
  try {
    const stored = localStorage.getItem('unlockedAchievements');
    const signature = localStorage.getItem('achievementSignature');
    const timestampsStored = localStorage.getItem('achievementTimestamps');
    
    if (!stored || !signature) {
      return [];
    }
    
    const achievements = JSON.parse(stored);
    
    // Verify signature
    if (!Array.isArray(achievements) || !verifySignature(achievements, signature)) {
      // Tampering detected! Clear everything
      console.warn('Achievement data tampering detected. Resetting achievements.');
      localStorage.removeItem('unlockedAchievements');
      localStorage.removeItem('achievementSignature');
      localStorage.removeItem('achievementTimestamps');
      localStorage.removeItem('allAchievementsCompleted');
      return [];
    }
    
    // Verify timestamps if they exist
    if (timestampsStored) {
      try {
        const timestamps: AchievementTimestamp[] = JSON.parse(timestampsStored);
        if (!validateTimestamps(timestamps)) {
          console.warn('Suspicious achievement pattern detected. Resetting achievements.');
          localStorage.removeItem('unlockedAchievements');
          localStorage.removeItem('achievementSignature');
          localStorage.removeItem('achievementTimestamps');
          localStorage.removeItem('allAchievementsCompleted');
          return [];
        }
        
        // Verify timestamp count matches achievement count
        if (timestamps.length !== achievements.length) {
          console.warn('Achievement count mismatch. Resetting achievements.');
          localStorage.removeItem('unlockedAchievements');
          localStorage.removeItem('achievementSignature');
          localStorage.removeItem('achievementTimestamps');
          localStorage.removeItem('allAchievementsCompleted');
          return [];
        }
      } catch {
        // Invalid timestamp data
        console.warn('Invalid timestamp data. Resetting achievements.');
        localStorage.removeItem('unlockedAchievements');
        localStorage.removeItem('achievementSignature');
        localStorage.removeItem('achievementTimestamps');
        localStorage.removeItem('allAchievementsCompleted');
        return [];
      }
    }
    
    return achievements;
  } catch {
    // Invalid data, clear it
    localStorage.removeItem('unlockedAchievements');
    localStorage.removeItem('achievementSignature');
    localStorage.removeItem('achievementTimestamps');
    localStorage.removeItem('allAchievementsCompleted');
    return [];
  }
};

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

// Achievement notification component
interface AchievementNotificationProps {
  show: boolean;
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  show,
  title,
  description,
  icon,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed top-20 right-4 z-[100] max-w-sm"
        >
          <div className="bg-gradient-to-r from-tokyo-purple via-tokyo-blue to-tokyo-cyan p-[2px] rounded-lg shadow-2xl">
            <div className="bg-tokyo-bg-dark p-4 rounded-lg backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-tokyo-yellow/20">
                  {icon || <Sparkles className="text-tokyo-yellow" size={24} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-tokyo-fg flex items-center gap-2">
                    <Sparkles size={16} className="text-tokyo-yellow" />
                    {title}
                  </h4>
                  <p className="text-sm text-tokyo-fg-dark mt-1">{description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-tokyo-comment hover:text-tokyo-fg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Easter Egg Manager Component
export const EasterEggManager: React.FC = () => {
  const [achievements, setAchievements] = useState<EasterEgg[]>([
    {
      id: 'konami',
      name: 'Konami Code Master',
      // description: 'Unlocked the legendary code',
      description: 'Classic gamer!',
      unlocked: false,
      icon: <Rocket className="text-tokyo-blue" size={20} />,
    },
    {
      id: 'explorer',
      name: 'Space Explorer',
      description: 'Scrolled through the entire portfolio',
      unlocked: false,
      icon: <Star className="text-tokyo-yellow" size={20} />,
    },
    {
      id: 'speedster',
      name: 'Speed Demon',
      description: 'Triple-clicked like a pro',
      unlocked: false,
      icon: <Zap className="text-tokyo-cyan" size={20} />,
    },
    {
      id: 'patient',
      name: 'Patient Visitor',
      description: 'Spent quality time exploring',
      unlocked: false,
      icon: <Heart className="text-tokyo-red" size={20} />,
    },
    {
      id: 'hacker',
      name: 'Secret Hacker',
      description: 'Discover the hidden secret through exploration',
      unlocked: false,
      icon: <Code className="text-tokyo-green" size={20} />,
    },
    {
      id: 'shaker',
      name: 'Shake Master',
      description: 'Shake device or press S 5 times quickly',
      unlocked: false,
      icon: <Zap className="text-tokyo-orange" size={20} />,
    },
    {
      id: 'tapper',
      name: 'Quick Tapper',
      description: 'Double-tap (mobile) or double-click (PC)',
      unlocked: false,
      icon: <Star className="text-tokyo-magenta" size={20} />,
    },
  ]);

  const [currentNotification, setCurrentNotification] = useState<{
    show: boolean;
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>({
    show: false,
    title: '',
    description: '',
  });

  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.id === id && !achievement.unlocked) {
          setCurrentNotification({
            show: true,
            title: `🎉 Achievement Unlocked: ${achievement.name}`,
            description: achievement.description,
            icon: achievement.icon,
          });
          
          // Save to localStorage with security signature and timestamp
          const unlockedAchievements = loadAchievements();
          if (!unlockedAchievements.includes(id)) {
            unlockedAchievements.push(id);
            saveAchievements(unlockedAchievements);
            saveAchievementTimestamp(id); // Track when achievement was unlocked
          }

          // Special effects for certain achievements
          if (id === 'konami') {
            document.body.style.animation = 'rainbow 3s ease-in-out';
            setTimeout(() => {
              document.body.style.animation = '';
            }, 3000);
          }

          // Check if all achievements are unlocked
          const updatedAchievements = prev.map((a) => 
            a.id === id ? { ...a, unlocked: true } : a
          );
          const allUnlocked = updatedAchievements.every((a) => a.unlocked);
          
          if (allUnlocked) {
            // Save completion flag
            localStorage.setItem('allAchievementsCompleted', 'true');
            
            // Trigger completion animation after a short delay
            setTimeout(() => {
              setShowCompletionAnimation(true);
              // Hide after animation completes
              setTimeout(() => {
                setShowCompletionAnimation(false);
              }, 8000);
            }, 1000);
          }

          return { ...achievement, unlocked: true };
        }
        return achievement;
      })
    );
  };

  // Load unlocked achievements from localStorage with security verification
  useEffect(() => {
    const unlockedAchievements = loadAchievements();
    
    setAchievements((prev) =>
      prev.map((achievement) => ({
        ...achievement,
        unlocked: unlockedAchievements.includes(achievement.id),
      }))
    );

    // Check if user has already completed all achievements (for visual indicator)
    const hasCompletedAll = localStorage.getItem('allAchievementsCompleted') === 'true';
    if (hasCompletedAll && unlockedAchievements.length === 7) {
      // User has completed all before, just set the flag without animation
      setShowCompletionAnimation(false);
    } else if (unlockedAchievements.length !== 7) {
      // Clear the flag if not all achievements are unlocked
      localStorage.removeItem('allAchievementsCompleted');
    }
  }, []);

  // Konami Code easter egg
  useKonamiCodeEasterEgg(() => {
    unlockAchievement('konami');
  });

  // Triple click easter egg
  useTripleClickEasterEgg(() => {
    unlockAchievement('speedster');
  });

  // Scroll distance easter egg (20000px total scroll)
  useScrollEasterEgg(20000, () => {
    unlockAchievement('explorer');
  });

  // Time-based easter egg (3 minutes)
  useTimeBasedEasterEgg(180, () => {
    unlockAchievement('patient');
  });

  // Secret code easter egg (type "space")
  useSecretCodeEasterEgg('space', () => {
    unlockAchievement('hacker');
    
    // Fun visual effect
    document.body.style.animation = 'rainbow 2s ease-in-out';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 2000);
  });

  // Shake easter egg (mobile)
  useShakeEasterEgg(() => {
    unlockAchievement('shaker');
  });

  // Double tap easter egg (mobile)
  useDoubleTapEasterEgg(() => {
    unlockAchievement('tapper');
  });

  return (
    <>
      <AchievementNotification
        show={currentNotification.show}
        title={currentNotification.title}
        description={currentNotification.description}
        icon={currentNotification.icon}
        onClose={() => setCurrentNotification({ ...currentNotification, show: false })}
      />

      {/* Achievement Counter (hidden by default, shows on hover) */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="relative group">
          <motion.div
            className={`backdrop-blur-md border rounded-full px-4 py-2 cursor-pointer ${
              achievements.every((a) => a.unlocked)
                ? 'bg-gradient-to-r from-tokyo-yellow/20 via-tokyo-orange/20 to-tokyo-red/20 border-tokyo-yellow'
                : 'bg-tokyo-bg-dark/80 border-tokyo-blue/30'
            }`}
            whileHover={{ scale: 1.05 }}
            animate={
              achievements.every((a) => a.unlocked)
                ? {
                    boxShadow: [
                      '0 0 0px rgba(224, 175, 104, 0.5)',
                      '0 0 20px rgba(224, 175, 104, 0.8)',
                      '0 0 0px rgba(224, 175, 104, 0.5)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 text-sm text-tokyo-fg">
              {achievements.every((a) => a.unlocked) ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    🏆
                  </motion.span>
                  <span className="font-bold bg-gradient-to-r from-tokyo-yellow via-tokyo-orange to-tokyo-red bg-clip-text text-transparent">
                    {achievements.filter((a) => a.unlocked).length}/{achievements.length}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-tokyo-yellow" />
                  <span className="font-semibold">
                    {achievements.filter((a) => a.unlocked).length}/{achievements.length}
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Achievement List Popup */}
          <div
            className="absolute bottom-full left-0 mb-2 bg-tokyo-bg-dark/95 backdrop-blur-md border border-tokyo-blue/30 rounded-lg p-4 min-w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto"
          >
            <h3 className="font-bold text-tokyo-fg mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-tokyo-yellow" />
              Achievements
            </h3>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    achievement.unlocked
                      ? 'bg-tokyo-green/10 border border-tokyo-green/30'
                      : 'bg-tokyo-bg-light border border-tokyo-comment/20 opacity-50'
                  }`}
                >
                  <div className="flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-tokyo-fg truncate">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-tokyo-fg-dark truncate">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <div className="flex-shrink-0 text-tokyo-green">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Achievements Completed Animation */}
      <AnimatePresence>
        {showCompletionAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md"
            style={{ pointerEvents: 'none' }}
          >
            {/* Fireworks/Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: [
                      '#7aa2f7',
                      '#bb9af7',
                      '#7dcfff',
                      '#9ece6a',
                      '#e0af68',
                      '#f7768e',
                    ][Math.floor(Math.random() * 6)],
                    left: `${Math.random() * 100}%`,
                    top: '50%',
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 800],
                    y: [0, (Math.random() - 0.5) * 800],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            {/* Central Achievement Message */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.3,
              }}
              className="relative z-10 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="text-8xl mb-4"
              >
                🏆
              </motion.div>

              <motion.h2
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-6xl font-bold mb-4 bg-gradient-to-r from-tokyo-yellow via-tokyo-orange to-tokyo-red bg-clip-text text-transparent"
              >
                Master Achieved!
              </motion.h2>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-2xl text-tokyo-cyan mb-6"
              >
                You've unlocked all 7 achievements! 🎉
              </motion.p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="flex justify-center gap-4 flex-wrap"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center gap-2 bg-tokyo-bg-dark/90 border border-tokyo-blue/50 rounded-full px-4 py-2"
                  >
                    {achievement.icon}
                    <span className="text-sm text-tokyo-fg font-medium">
                      {achievement.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="text-tokyo-comment mt-8 text-lg"
              >
                You are a true explorer! 🚀✨
              </motion.p>
            </motion.div>

            {/* Rotating Stars */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  rotate: 360,
                  x: Math.cos((i * Math.PI * 2) / 8) * 300,
                  y: Math.sin((i * Math.PI * 2) / 8) * 300,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.1,
                }}
              >
                <Sparkles className="text-tokyo-yellow" size={24} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
