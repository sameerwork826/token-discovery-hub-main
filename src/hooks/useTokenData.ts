import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Token } from '@/types/token';

// Mock data generator
const generateMockToken = (category: Token['category'], index: number): Token => {
  const symbols = ['ETH', 'BTC', 'DOGE', 'PEPE', 'SHIB', 'BONK', 'WIF', 'FLOKI'];
  const names = ['Ethereum', 'Bitcoin', 'Dogecoin', 'Pepe', 'Shiba Inu', 'Bonk', 'Dogwifhat', 'Floki'];
  
  const generatePriceHistory = () => {
    const points = 20;
    const history = [];
    let price = Math.random() * 100;
    for (let i = 0; i < points; i++) {
      price = price * (1 + (Math.random() - 0.5) * 0.1);
      history.push(price);
    }
    return history;
  };
  
  return {
    id: `${category}-${index}`,
    name: names[index % names.length] || `Token ${index}`,
    symbol: symbols[index % symbols.length] || `TKN${index}`,
    price: Math.random() * 10,
    priceChange24h: (Math.random() - 0.5) * 50,
    volume24h: Math.random() * 10000000,
    marketCap: Math.random() * 100000000,
    liquidity: Math.random() * 5000000,
    holders: Math.floor(Math.random() * 50000),
    age: `${Math.floor(Math.random() * 60) + 1}m`,
    category,
    verified: Math.random() > 0.5,
    riskScore: Math.floor(Math.random() * 100),
    lastUpdated: Date.now(),
    priceHistory: generatePriceHistory(),
    txnsBuys: Math.floor(Math.random() * 500),
    txnsSells: Math.floor(Math.random() * 300),
    m5Change: (Math.random() - 0.5) * 30,
    h1Change: (Math.random() - 0.5) * 40,
    h6Change: (Math.random() - 0.5) * 50,
    h24Change: (Math.random() - 0.5) * 60,
  };
};

const fetchTokens = async (): Promise<Token[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const tokens: Token[] = [];
  for (let i = 0; i < 12; i++) {
    tokens.push(generateMockToken('new', i));
  }
  for (let i = 0; i < 8; i++) {
    tokens.push(generateMockToken('trending', i));
  }
  for (let i = 0; i < 6; i++) {
    tokens.push(generateMockToken('migrated', i));
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
