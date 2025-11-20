export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  age: string;
  category: 'new' | 'trending' | 'migrated';
  verified: boolean;
  riskScore: number;
  lastUpdated: number;
  priceHistory?: number[];
  txnsBuys: number;
  txnsSells: number;
  m5Change: number;
  h1Change: number;
  h6Change: number;
  h24Change: number;
}

export type SortField = keyof Token;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
