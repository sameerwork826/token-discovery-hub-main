import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Flame } from 'lucide-react';

interface TokenBadgeProps {
  verified?: boolean;
  category: 'new' | 'trending' | 'migrated';
}

export const TokenBadge = ({ verified, category }: TokenBadgeProps) => {
  return (
    <div className="flex items-center gap-1.5">
      {verified && (
        <CheckCircle2 className="h-4 w-4 text-success" />
      )}
      {category === 'new' && (
        <Badge variant="secondary" className="text-xs gap-1">
          <Flame className="h-3 w-3" />
          New
        </Badge>
      )}
      {category === 'trending' && (
        <Badge variant="default" className="text-xs gap-1">
          <TrendingUp className="h-3 w-3" />
          Hot
        </Badge>
      )}
      {category === 'migrated' && (
        <Badge variant="outline" className="text-xs">
          Migrated
        </Badge>
      )}
    </div>
  );
};

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
