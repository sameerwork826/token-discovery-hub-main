import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TokenPriceProps {
  price: number;
  lastUpdated: number;
  className?: string;
}

export const TokenPrice = memo(({ price, lastUpdated, className }: TokenPriceProps) => {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const [prevPrice, setPrevPrice] = useState(price);

  useEffect(() => {
    if (price !== prevPrice) {
      setFlash(price > prevPrice ? 'up' : 'down');
      setPrevPrice(price);
      
      const timeout = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timeout);
    }
  }, [price, prevPrice]);

  return (
    <span
      className={cn(
        'font-mono transition-colors duration-300',
        flash === 'up' && 'text-success',
        flash === 'down' && 'text-destructive',
        !flash && 'text-foreground',
        className
      )}
    >
      ${price.toFixed(4)}
    </span>
  );
});

TokenPrice.displayName = 'TokenPrice';
