import { useState, useMemo } from 'react';
import { TokenTable } from '@/components/tokens/TokenTable';
import { TokenFilters } from '@/components/tokens/TokenFilters';
import { useTokenData } from '@/hooks/useTokenData';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const { tokens, isLoading, refetch } = useTokenData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    let filtered = tokens;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(token => token.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        token =>
          token.name.toLowerCase().includes(query) ||
          token.symbol.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tokens, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Token Discovery
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time token tracking with advanced analytics
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <TokenFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="text-sm text-muted-foreground">Total Tokens</div>
            <div className="text-3xl font-bold mt-2">{filteredTokens.length}</div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="text-3xl font-bold mt-2 text-success">
              ${(filteredTokens.reduce((acc, t) => acc + t.volume24h, 0) / 1e6).toFixed(2)}M
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border shadow-card">
            <div className="text-sm text-muted-foreground">Total Market Cap</div>
            <div className="text-3xl font-bold mt-2">
              ${(filteredTokens.reduce((acc, t) => acc + t.marketCap, 0) / 1e9).toFixed(2)}B
            </div>
          </div>
        </div>

        {/* Table */}
        <TokenTable tokens={filteredTokens} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
