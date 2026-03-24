'use client';

// Animated background with gradient orbs and floating particles
// Responds to theme changes with appropriate color schemes

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export function AnimatedBackground() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base background */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-black via-gray-950 to-black'
            : 'bg-gradient-to-br from-white via-blue-50 to-purple-50'
        }`}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${
          isDark
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
            : 'bg-gradient-to-r from-blue-400 to-cyan-300'
        }`}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className={`absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30 ${
          isDark
            ? 'bg-gradient-to-r from-purple-600 to-pink-600'
            : 'bg-gradient-to-r from-purple-400 to-pink-300'
        }`}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className={`absolute -bottom-40 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark
            ? 'bg-gradient-to-r from-green-600 to-blue-600'
            : 'bg-gradient-to-r from-green-400 to-blue-400'
        }`}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 100, 0, -100],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Grid pattern overlay */}
      <motion.div
        className={`absolute inset-0 opacity-10 ${
          isDark ? 'bg-grid-dark' : 'bg-grid-light'
        }`}
        style={{
          backgroundImage: isDark
            ? 'rgba(255, 255, 255, 0.1) 1px solid'
            : 'rgba(0, 0, 0, 0.1) 1px solid',
          backgroundSize: '50px 50px',
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            isDark ? 'bg-white/30' : 'bg-black/20'
          }`}
          animate={{
            x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
            y: [Math.random() * 600 - 300, Math.random() * 600 - 300],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
