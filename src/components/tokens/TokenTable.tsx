import { memo, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Link2, Search, Shield } from 'lucide-react';
import { Token, SortConfig } from '@/types/token';
import { TokenTableSkeleton } from './TokenTableSkeleton';
import { TokenDetailsModal } from './TokenDetailsModal';
import { MiniSparkline } from './MiniSparkline';
import { cn } from '@/lib/utils';

interface TokenTableProps {
  tokens: Token[];
  isLoading: boolean;
}

export const TokenTable = memo(({ tokens, isLoading }: TokenTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'marketCap', direction: 'desc' });
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const sortedTokens = useMemo(() => {
    const sorted = [...tokens].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    return sorted;
  }, [tokens, sortConfig]);

  const handleSort = (field: keyof Token) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(change < 1 && change > -1 ? 2 : 1)}%`;
  };

  const SortButton = ({ field, children }: { field: keyof Token; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className={cn(
        'h-7 gap-1 hover:bg-secondary/50 text-xs font-medium',
        sortConfig.field === field && 'text-primary'
      )}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </Button>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs font-medium">
                Pair Info
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Market Cap
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Liquidity
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Volume
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                TXNS
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Token Info
              </TableHead>
              <TableHead className="text-right text-muted-foreground text-xs font-medium">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TokenTableSkeleton />
            ) : (
              sortedTokens.map((token) => (
                <TableRow
                  key={token.id}
                  className="border-border/50 hover:bg-secondary/20 cursor-pointer transition-colors"
                  onClick={() => setSelectedToken(token)}
                >
                  {/* Pair Info */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded border border-border/50 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-foreground font-bold text-sm flex-shrink-0">
                        {token.symbol.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm flex items-center gap-2">
                          <span>{token.name}</span>
                          <span className="text-muted-foreground text-xs">{token.symbol}</span>
                          {token.verified && <Shield className="h-3 w-3 text-primary" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-success">{token.age}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Shield className="h-2.5 w-2.5" />
                            USDC
                          </span>
                          <Link2 className="h-2.5 w-2.5 text-muted-foreground" />
                          <Search className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Market Cap */}
                  <TableCell className="py-3 w-48">
                    <div className="flex items-center gap-2 max-w-full">
                      <MiniSparkline 
                        data={token.priceHistory || []} 
                        isPositive={token.priceChange24h >= 0}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm whitespace-nowrap">{formatNumber(token.marketCap)}</div>
                        <div className={cn(
                          "text-xs font-medium whitespace-nowrap",
                          token.priceChange24h >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {formatChange(token.priceChange24h)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Liquidity */}
                  <TableCell className="py-3">
                    <span className="text-sm">{formatNumber(token.liquidity)}</span>
                  </TableCell>

                  {/* Volume */}
                  <TableCell className="py-3">
                    <span className="text-sm">{formatNumber(token.volume24h)}</span>
                  </TableCell>

                  {/* TXNS */}
                  <TableCell className="py-3">
                    <div>
                      <div className="text-sm font-medium">{token.txnsBuys + token.txnsSells}</div>
                      <div className="text-xs">
                        <span className="text-success">{token.txnsBuys}</span>
                        <span className="text-muted-foreground"> / </span>
                        <span className="text-destructive">{token.txnsSells}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Token Info */}
                  <TableCell className="py-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                      <div className="flex items-center gap-1">
                        <span className={token.m5Change >= 0 ? "text-success" : "text-destructive"}>
                          {formatChange(token.m5Change)}
                        </span>
                        <span className={token.h1Change >= 0 ? "text-success" : "text-destructive"}>
                          {formatChange(token.h1Change)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={token.h6Change >= 0 ? "text-success" : "text-destructive"}>
                          {formatChange(token.h6Change)}
                        </span>
                        <span className={token.h24Change >= 0 ? "text-success" : "text-destructive"}>
                          {formatChange(token.h24Change)}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right py-3">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedToken(token);
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 px-4 text-xs font-medium"
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <TokenDetailsModal
        token={selectedToken}
        open={!!selectedToken}
        onOpenChange={(open) => !open && setSelectedToken(null)}
      />
    </TooltipProvider>
  );
});

TokenTable.displayName = 'TokenTable';
