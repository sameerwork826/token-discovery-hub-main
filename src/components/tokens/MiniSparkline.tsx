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
  const range = max - min;

  const width = 100;
  const height = 40; // match previous viewBox height

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      // If all values are identical, center the line vertically
      const y = range === 0 ? height / 2 : height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-16 h-8 flex-shrink-0', className)}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';
