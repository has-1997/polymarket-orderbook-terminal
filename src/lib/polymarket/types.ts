// A simplified market shape our app will use after cleaning Polymarket API data.
export type MarketSummary = {
  slug: string;
  question: string;
  conditionId?: string;
  image?: string;
  category?: string;
  active?: boolean;
  closed?: boolean;
  volume?: number;
  liquidity?: number;
  endDate?: string;
  yesTokenId?: string;
  noTokenId?: string;
};

// One price level in an orderbook.
// Example: price 0.63, size 120 means 120 shares available at 63 cents.
export type OrderBookLevel = {
  price: number;
  size: number;
};

// A normalized orderbook for one outcome token.
export type OrderBook = {
  tokenId: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
};

// The main price numbers we show in cards.
export type MarketPrices = {
  tokenId: string;
  bestBid: number | null;
  bestAsk: number | null;
  midpoint: number | null;
  spread: number | null;
  lastTradePrice: number | null;
};

// One point on the price history chart.
export type PriceHistoryPoint = {
  time: number;
  value: number;
};
