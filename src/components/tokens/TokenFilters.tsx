import { memo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TokenFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TokenFilters = memo(({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: TokenFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="w-full sm:w-auto">
        <TabsList className="grid w-full sm:w-auto grid-cols-4 bg-secondary">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All Tokens
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            New Pairs
          </TabsTrigger>
          <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Trending
          </TabsTrigger>
          <TabsTrigger value="migrated" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Migrated
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-secondary border-border focus-visible:ring-primary"
        />
      </div>
    </div>
  );
});

TokenFilters.displayName = 'TokenFilters';
