'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Audit {
  id: string;
  createdAt: string;
  imageUrl: string;
  command: string;
  status: 'PASS' | 'FAIL';
  reasoning: string;
  confidence: number;
}

export default function HistoryPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await fetch('/api/audits');
        if (!response.ok) throw new Error('Failed to fetch audits');
        const data = await response.json();
        setAudits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
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
      <div className="w-full max-w-6xl">
        {/* Header with back button and title */}
        <motion.div className="mb-12 pt-12 md:pt-0" variants={itemVariants}>
          <Link
            href="/"
            className="inline-block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            ← Back to Audit
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-950 dark:text-white">Audit History</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">Review previous robotics command audits</p>
        </motion.div>

        {error && (
          <motion.div
            className="glass-lg p-4 mb-8 border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-200"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <motion.div
            className="glass-lg p-12 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-600 dark:text-gray-400">Loading audits...</p>
          </motion.div>
        ) : audits.length === 0 ? (
          <motion.div
            className="glass-lg p-12 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-600 dark:text-gray-400">No audits found. Start by auditing a command!</p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
          >
            {audits.map((audit) => (
              <motion.div
                key={audit.id}
                className="glass-lg p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all cursor-pointer group"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="md:w-32 md:h-32 flex-shrink-0">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-300 dark:bg-white/5">
                      <img
                        src={audit.imageUrl}
                        alt="Audit image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(audit.createdAt).toLocaleDateString()} at{' '}
                          {new Date(audit.createdAt).toLocaleTimeString()}
                        </p>
                        <h3 className="text-lg font-semibold mt-1 line-clamp-2 text-gray-950 dark:text-gray-100">
                          {audit.command}
                        </h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                          audit.status === 'PASS'
                            ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                            : 'bg-red-500/20 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {audit.status}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                      {audit.reasoning}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-xs h-1.5 bg-gray-300 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{
                            width: `${audit.confidence * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {(audit.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
