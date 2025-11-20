import { memo } from 'react';
import { cn } from '@/lib/utils';

interface MiniSparklineProps {
  data: number[];
  isPositive: boolean;
  className?: string;
}

export const MiniSparkline = memo(({ data, isPositive, className }: MiniSparklineProps) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg 
      viewBox="0 0 100 40" 
      className={cn('w-16 h-8 flex-shrink-0', className)}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
        strokeWidth="3"
      />
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';
