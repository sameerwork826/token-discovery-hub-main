import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Token } from '@/types/token';
import { TokenPrice } from './TokenPrice';
import { TokenChange } from './TokenChange';
import { Separator } from '@/components/ui/separator';

interface TokenDetailsModalProps {
  token: Token | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TokenDetailsModal = ({ token, open, onOpenChange }: TokenDetailsModalProps) => {
  if (!token) return null;

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
              {token.symbol.charAt(0)}
            </div>
            <div>
              <div>{token.name}</div>
              <div className="text-sm text-muted-foreground font-normal">{token.symbol}</div>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-3 text-lg pt-2">
            <TokenPrice price={token.price} lastUpdated={token.lastUpdated} className="text-2xl" />
            <TokenChange change={token.priceChange24h} />
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="text-lg font-semibold">{formatNumber(token.marketCap)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">24h Volume</div>
              <div className="text-lg font-semibold">{formatNumber(token.volume24h)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Liquidity</div>
              <div className="text-lg font-semibold">{formatNumber(token.liquidity)}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Holders</div>
              <div className="text-lg font-semibold">{token.holders.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Age</div>
              <div className="text-lg font-semibold">{token.age}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <div className="text-lg font-semibold">
                <span className={token.riskScore < 30 ? 'text-success' : token.riskScore < 70 ? 'text-warning' : 'text-destructive'}>
                  {token.riskScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
