import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-lg',
        'hover:bg-white/8 hover:border-white/20 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
