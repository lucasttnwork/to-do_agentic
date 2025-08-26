import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-transparent',
          'border-t-blue-500 border-r-purple-500 border-b-blue-500 border-l-purple-500',
          sizeClasses[size]
        )}
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
        }}
      />
    </div>
  );
}
