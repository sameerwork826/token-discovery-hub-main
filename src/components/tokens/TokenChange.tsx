import { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TokenChangeProps {
  change: number;
  className?: string;
}

export const TokenChange = memo(({ change, className }: TokenChangeProps) => {
  const isPositive = change >= 0;
  
  return (
    <div
      className={cn(
        'flex items-center gap-1 font-medium',
        isPositive ? 'text-success' : 'text-destructive',
        className
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
    </div>
  );
});

TokenChange.displayName = 'TokenChange';
