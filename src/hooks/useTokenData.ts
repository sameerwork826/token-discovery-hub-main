import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Token } from '@/types/token';

// Mock data generator
const ADJECTIVES = [
  'Atomic', 'Quantum', 'Solar', 'Lunar', 'Neon', 'Hyper', 'Silent', 'Rapid', 'Crystal', 'Iron', 'Golden', 'Cyber', 'Polar', 'Apex', 'Echo'
];

const NOUNS = [
  'Tiger', 'Phoenix', 'Dragon', 'Shark', 'Wolf', 'Falcon', 'Comet', 'Nova', 'Panda', 'Raven', 'Orchid', 'Saber', 'Vortex', 'Beacon', 'Pulse'
];

const generateMockToken = (category: Token['category'], index: number): Token => {
  const generatePriceHistory = () => {
    const points = 30; // longer history
    const history: number[] = [];
    let price = Math.random() * 50 + 0.1; // ensure > 0
    for (let i = 0; i < points; i++) {
      // small correlated random walk
      price = Math.max(0.0001, price * (1 + (Math.random() - 0.45) * 0.06));
      history.push(Number(price.toFixed(6)));
    }
    return history;
  };

  // Create a distinct human-friendly name using adjective + noun + index
  const adj = ADJECTIVES[index % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(index / ADJECTIVES.length) % NOUNS.length];
  const name = `${adj} ${noun} ${index}`;

  // Symbol: up to 5 chars, uppercase, derived from name + index to ensure uniqueness
  const baseSym = (adj[0] || 'T') + (noun[0] || 'K');
  const symbol = `${baseSym}${String(index).padStart(3, '0')}`.toUpperCase().slice(0, 5);

  return {
    id: `${category}-${index}`,
    name,
    symbol,
    price: Number((Math.random() * 10).toFixed(6)),
    priceChange24h: Number(((Math.random() - 0.5) * 50).toFixed(2)),
    volume24h: Math.floor(Math.random() * 50_000_000),
    marketCap: Math.floor(Math.random() * 5_000_000_000),
    liquidity: Math.floor(Math.random() * 5_000_000),
    holders: Math.floor(Math.random() * 500_000),
    age: `${Math.floor(Math.random() * 60) + 1}m`,
    category,
    verified: Math.random() > 0.7, // fewer verified by default
    riskScore: Math.floor(Math.random() * 100),
    lastUpdated: Date.now(),
    priceHistory: generatePriceHistory(),
    txnsBuys: Math.floor(Math.random() * 5000),
    txnsSells: Math.floor(Math.random() * 3000),
    m5Change: Number(((Math.random() - 0.5) * 30).toFixed(2)),
    h1Change: Number(((Math.random() - 0.5) * 40).toFixed(2)),
    h6Change: Number(((Math.random() - 0.5) * 50).toFixed(2)),
    h24Change: Number(((Math.random() - 0.5) * 60).toFixed(2)),
  };
};

const fetchTokens = async (): Promise<Token[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const tokens: Token[] = [];
  // Configurable counts per category — increased for more rows
  const COUNTS: Record<Token['category'], number> = {
    new: 80,
    trending: 70,
    migrated: 50,
  };

  for (let i = 0; i < COUNTS.new; i++) {
    tokens.push(generateMockToken('new', i));
  }
  for (let i = 0; i < COUNTS.trending; i++) {
    tokens.push(generateMockToken('trending', i + COUNTS.new));
  }
  for (let i = 0; i < COUNTS.migrated; i++) {
    tokens.push(generateMockToken('migrated', i + COUNTS.new + COUNTS.trending));
  }
  
  return tokens;
};

export const useTokenData = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    refetchInterval: false,
  });

  // Simulate real-time price updates
  useEffect(() => {
    if (!data) return;
    
    setTokens(data);
    
    const interval = setInterval(() => {
      setTokens(prevTokens =>
        prevTokens.map(token => ({
          ...token,
          price: token.price * (1 + (Math.random() - 0.5) * 0.02),
          priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 2,
          lastUpdated: Date.now(),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [data]);

  const updateToken = useCallback((id: string, updates: Partial<Token>) => {
    setTokens(prev =>
      prev.map(token =>
        token.id === id ? { ...token, ...updates, lastUpdated: Date.now() } : token
      )
    );
  }, []);

  return {
    tokens,
    isLoading,
    error,
    refetch,
    updateToken,
  };
};
