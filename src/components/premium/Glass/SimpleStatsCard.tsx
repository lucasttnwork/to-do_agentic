'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SimpleStatsCardProps {
  title: string;
  value: number | string | ReactNode;
  icon: ReactNode;
  gradient: string;
}

export const SimpleStatsCard = ({
  title,
  value,
  icon,
  gradient
}: SimpleStatsCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl cursor-pointer min-h-[88px] md:min-h-[100px] bg-white/10 backdrop-blur-[16px] border border-white/15"
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15 group-hover:opacity-25 transition-opacity duration-500 rounded-2xl`} />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 px-4 py-3 md:px-5 md:py-4">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Icon */}
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shrink-0">
            {icon}
          </div>
          {/* Value and title inline */}
          <div className="flex items-baseline gap-3 min-w-0">
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-none">
              {value}
            </h3>
            <p className="text-white/75 text-xs md:text-sm font-medium truncate">
              {title}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
