'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Sparkles } from 'lucide-react';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Handle voice recording logic
  };

  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        {/* Premium Input Container */}
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Digite ou segure para falar..."
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 text-lg relative z-10"
          />
          
          {/* Gradient Border Animation */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 blur-sm transition-opacity duration-300 ${isFocused ? 'opacity-30' : ''} -z-10`} />
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Focus Ring Enhancement */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-white/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 z-20">
          {/* Voice Record Button */}
          <motion.button
            type="button"
            onClick={handleVoiceRecord}
            className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${
              isRecording 
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 shadow-lg shadow-red-500/25' 
                : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </motion.button>

          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={!message.trim()}
            className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${
              message.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
                : 'bg-white/10 border border-white/20 text-white/30 cursor-not-allowed'
            }`}
            whileHover={message.trim() ? { scale: 1.05, y: -2 } : {}}
            whileTap={message.trim() ? { scale: 0.95 } : {}}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        {/* AI Enhancement Indicator */}
        <motion.div
          className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white/70 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center space-x-1">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.div>
            <span>AI Powered</span>
          </div>
        </motion.div>
      </form>

      {/* Floating Particles Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full"
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400/30 rounded-full"
          animate={{ 
            y: [0, -12, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </motion.div>
  );
}
