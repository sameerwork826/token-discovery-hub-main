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

// Read API key from Vite env (see .env.example). Falls back to empty string.
const API_KEY = ((import.meta as any)?.env?.VITE_FREECRYPTO_API_KEY as string) || '';

const SYMBOL_LIST: { symbol: string; id: string; name: string }[] = [
  { symbol: 'BTC', id: 'bitcoin', name: 'Bitcoin' },
  { symbol: 'ETH', id: 'ethereum', name: 'Ethereum' },
  { symbol: 'USDT', id: 'tether', name: 'Tether' },
  { symbol: 'BNB', id: 'binancecoin', name: 'BNB' },
  { symbol: 'ADA', id: 'cardano', name: 'Cardano' },
  { symbol: 'SOL', id: 'solana', name: 'Solana' },
  { symbol: 'XRP', id: 'ripple', name: 'XRP' },
  { symbol: 'DOGE', id: 'dogecoin', name: 'Dogecoin' },
  { symbol: 'LTC', id: 'litecoin', name: 'Litecoin' },
  { symbol: 'DOT', id: 'polkadot', name: 'Polkadot' },
  { symbol: 'MATIC', id: 'matic-network', name: 'Polygon' },
  { symbol: 'SHIB', id: 'shiba-inu', name: 'Shiba Inu' },
  { symbol: 'AVAX', id: 'avalanche-2', name: 'Avalanche' },
  { symbol: 'LINK', id: 'chainlink', name: 'Chainlink' },
  { symbol: 'TRX', id: 'tron', name: 'Tron' },
  { symbol: 'UNI', id: 'uniswap', name: 'Uniswap' },
];

// Attempt to fetch prices from FreeCryptoAPI, fallback to CoinGecko
const fetchTokens = async (): Promise<Token[]> => {
  // try FreeCryptoAPI first
  try {
    const symbols = SYMBOL_LIST.map(s => s.symbol).join(',');
    const url = `https://freecryptoapi.com/api/v1/market?symbols=${encodeURIComponent(symbols)}`;
    const resp = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (resp.ok) {
      const json = await resp.json();
      // FreeCryptoAPI response structures vary; try to map common shapes
      // Expecting json.data or json.result keyed by symbol
      const tokens: Token[] = [];
      for (let i = 0; i < SYMBOL_LIST.length; i++) {
        const s = SYMBOL_LIST[i];
        // read conservative paths
        const entry = (json.data && json.data[s.symbol]) || (json.result && json.result[s.symbol]) || json[s.symbol] || {};
        const price = Number(entry.price || entry.quotes?.USD?.price || entry.last_price || 0) || 0;
        const change24 = Number(entry.percent_change_24h || entry.change24h || entry.quotes?.USD?.percent_change_24h || 0) || 0;
        const volume24 = Number(entry.volume_24h || entry.quotes?.USD?.volume_24h || 0) || 0;
        const marketCap = Number(entry.market_cap || entry.quotes?.USD?.market_cap || 0) || 0;

        tokens.push({
          id: `${s.symbol}`,
          name: s.name,
          symbol: s.symbol,
          price,
          priceChange24h: change24,
          volume24h: volume24,
          marketCap,
          liquidity: 0,
          holders: 0,
          age: 'N/A',
          category: 'trending',
          verified: true,
          riskScore: Math.floor(Math.random() * 100),
          lastUpdated: Date.now(),
          priceHistory: undefined,
          txnsBuys: 0,
          txnsSells: 0,
          m5Change: 0,
          h1Change: 0,
          h6Change: 0,
          h24Change: change24,
        });
      }

      // Attempt to populate priceHistory from CoinGecko (historical data)
      try {
        const historyMap = await fetchHistoricalForSymbols(SYMBOL_LIST.map(s => s.id));
        return tokens.map((t, idx) => ({ ...t, priceHistory: historyMap[SYMBOL_LIST[idx].symbol] }));
      } catch (e) {
        return tokens;
      }
    }
  } catch (e) {
    // ignore and fallback
    // console.warn('FreeCryptoAPI failed', e);
  }

  // Fallback: CoinGecko (no API key required)
  try {
    // map ids
    const ids = SYMBOL_LIST.map(s => s.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
    const resp = await fetch(url);
    const json = await resp.json();

    const tokens: Token[] = SYMBOL_LIST.map(s => {
      const v = json[s.id] || {};
      const price = Number(v.usd || 0);
      const change24 = Number(v.usd_24h_change || 0);
      const marketCap = Number(v.usd_market_cap || 0);
      const volume24 = Number(v.usd_24h_vol || 0);

      return {
        id: s.symbol,
        name: s.name,
        symbol: s.symbol,
        price,
        priceChange24h: change24,
        volume24h: volume24,
        marketCap,
        liquidity: 0,
        holders: 0,
        age: 'N/A',
        category: 'trending',
        verified: true,
        riskScore: Math.floor(Math.random() * 100),
        lastUpdated: Date.now(),
        priceHistory: undefined,
        txnsBuys: 0,
        txnsSells: 0,
        m5Change: 0,
        h1Change: 0,
        h6Change: 0,
        h24Change: change24,
      };
    });

    // Fetch historical data and attach priceHistory
    try {
      const historyMap = await fetchHistoricalForSymbols(SYMBOL_LIST.map(s => s.id));
      return tokens.map((t, idx) => ({ ...t, priceHistory: historyMap[SYMBOL_LIST[idx].symbol] }));
    } catch (e) {
      return tokens;
    }
  } catch (e) {
    // Last resort: return a small set of mock tokens
    const fallback: Token[] = [];
    for (let i = 0; i < 10; i++) fallback.push(generateMockToken('trending', i));
    return fallback;
  }
};

// Fetch historical prices for a list of CoinGecko ids. Returns a map symbol->number[] (or undefined when unavailable)
const fetchHistoricalForSymbols = async (
  ids: string[],
  points = 30,
): Promise<Record<string, number[] | undefined>> => {
  const result: Record<string, number[]> = {};

  // Helpers
  const fetchForId = async (id: string) => {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=1`;
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const json = await resp.json();
      const prices: number[] = Array.isArray(json.prices) ? json.prices.map((p: any) => Number(p[1] || 0)) : [];
      if (!prices.length) return null;

      // If there are more points than desired, sample evenly
      if (prices.length > points) {
        const step = prices.length / points;
        const sampled: number[] = [];
        for (let i = 0; i < points; i++) {
          sampled.push(Number(prices[Math.floor(i * step)].toFixed(6)));
        }
        return sampled;
      }

      // If fewer points, pad by repeating last
      const padded = prices.slice();
      while (padded.length < points) padded.push(padded[padded.length - 1]);
      return padded.map(p => Number(p.toFixed(6)));
    } catch (e) {
      return null;
    }
  };

  // Run requests in parallel (reasonable for small symbol list)
  const promises = ids.map(id => fetchForId(id));
  const responses = await Promise.all(promises);

  // adjust result typing
  const resultAny: Record<string, number[] | undefined> = {};
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const symbol = SYMBOL_LIST.find(s => s.id === id)?.symbol || id;
    const history = responses[i];
    if (history && history.length) resultAny[symbol] = history;
    else resultAny[symbol] = undefined;
  }

  return resultAny;
};

export const useTokenData = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    // refetch every 10s to get near-real-time prices
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (!data) return;
    setTokens(data);
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
