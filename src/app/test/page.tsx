'use client';

import { motion } from 'framer-motion';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Teste Glassmorphism</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Test Card 1 */}
        <motion.div
          className="group relative overflow-hidden rounded-3xl cursor-pointer min-h-[200px] bg-white/10 backdrop-blur-[20px] border border-white/20"
          whileHover={{ scale: 1.02, y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent rounded-3xl" />
          <div className="relative z-10 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">24</h3>
            <p className="text-white/70">Total Tasks</p>
          </div>
        </motion.div>

        {/* Test Card 2 */}
        <motion.div
          className="group relative overflow-hidden rounded-3xl cursor-pointer min-h-[200px] bg-white/10 backdrop-blur-[20px] border border-white/20"
          whileHover={{ scale: 1.02, y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-cyan-400/20 rounded-3xl" />
          <div className="relative z-10 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">18</h3>
            <p className="text-white/70">Completed</p>
          </div>
        </motion.div>

        {/* Test Card 3 */}
        <motion.div
          className="group relative overflow-hidden rounded-3xl cursor-pointer min-h-[200px] bg-white/10 backdrop-blur-[20px] border border-white/20"
          whileHover={{ scale: 1.02, y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 rounded-3xl" />
          <div className="relative z-10 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">4</h3>
            <p className="text-white/70">In Progress</p>
          </div>
        </motion.div>
      </div>

      {/* Test Input */}
      <div className="mt-8">
        <input
          type="text"
          placeholder="Teste Input Premium"
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
        />
      </div>
    </div>
  );
}
