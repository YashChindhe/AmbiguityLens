'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MockDataButton } from '@/components/MockDataButton';

interface AuditResult {
  status: 'PASS' | 'FAIL';
  reasoning: string;
  confidence: number;
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          command,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to audit command');
      }

      const data: AuditResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFillMockData = (data: { imageUrl: string; command: string }) => {
    setImageUrl(data.imageUrl);
    setCommand(data.command);
    setResult(null);
    setError('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.main
      className="min-h-screen w-full px-4 py-12 flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ThemeToggle />
      <div className="w-full max-w-4xl">
        {/* Header with centered title and navigation */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="mb-4 flex items-center justify-center gap-3">
            <a
              href="/history"
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors glass rounded-lg"
            >
              View History
            </a>
            <MockDataButton onFillForm={handleFillMockData} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-950 dark:text-white">
            AmbiguityLens
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Audit robotics commands for ambiguity and executability
          </p>
        </motion.div>

        {/* Main Glass Card - Audit form container */}
        <motion.div
          className="glass-lg p-6 md:p-12 mb-8 transition-all duration-300 hover:shadow-lg"
          variants={itemVariants}
        >
          <form onSubmit={handleAudit} className="space-y-6">
            {/* Image URL Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/robot.jpg"
                className="w-full px-4 py-3 bg-white/90 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-white/50 transition-colors text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                required
              />
            </div>

            {/* Command Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                Robot Command
              </label>
              <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Describe the robot command to be executed..."
                rows={4}
                className="w-full px-4 py-3 bg-white/90 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-white/50 transition-colors text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sky-600 dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Auditing...' : 'Audit Command'}
            </motion.button>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="glass-lg p-4 mb-8 border-red-500/50 bg-red-500/10 dark:bg-red-500/10 text-red-700 dark:text-red-200"
            variants={itemVariants}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            className="glass-lg p-8 md:p-12 space-y-6"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Audit Result</h2>
              <motion.div
                className={`px-4 py-2 rounded-full font-semibold ${
                  result.status === 'PASS'
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/50'
                    : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/50'
                }`}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {result.status}
              </motion.div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Reasoning</h3>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">{result.reasoning}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Confidence</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-300 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
