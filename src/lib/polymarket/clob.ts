import { normalizeOrderBookLevels, toNumber } from "./normalize";
import type { MarketPrices, OrderBook, PriceHistoryPoint } from "./types";

const CLOB_BASE_URL = "https://clob.polymarket.com";

type JsonRecord = Record<string, unknown>;

async function fetchClob(path: string): Promise<unknown> {
  const response = await fetch(`${CLOB_BASE_URL}${path}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`CLOB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Gets the full orderbook for one outcome token.
export async function getOrderBook(tokenId: string): Promise<OrderBook> {
  const params = new URLSearchParams({ token_id: tokenId });
  const data = await fetchClob(`/book?${params.toString()}`);

  if (!data || typeof data !== "object") {
    return { tokenId, bids: [], asks: [] };
  }

  const record = data as JsonRecord;

  return {
    tokenId,
    bids: normalizeOrderBookLevels(record.bids).sort((a, b) => b.price - a.price),
    asks: normalizeOrderBookLevels(record.asks).sort((a, b) => a.price - b.price),
  };
}

// Gets one small numeric value from CLOB endpoints like /midpoint and /spread.
async function getNumericField(path: string, fieldName: string): Promise<number | null> {
  const data = await fetchClob(path);

  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as JsonRecord;
  return toNumber(record[fieldName]) ?? null;
}

// Gets price cards for one outcome token.
export async function getMarketPrices(tokenId: string): Promise<MarketPrices> {
  const params = new URLSearchParams({ token_id: tokenId });
  const sideParams = new URLSearchParams({ token_id: tokenId, side: "BUY" });

  const [book, midpoint, spread, lastTradePrice] = await Promise.all([
    getOrderBook(tokenId),
    getNumericField(`/midpoint?${params.toString()}`, "mid"),
    getNumericField(`/spread?${params.toString()}`, "spread"),
    getNumericField(`/price?${sideParams.toString()}`, "price"),
  ]);

  return {
    tokenId,
    bestBid: book.bids[0]?.price ?? null,
    bestAsk: book.asks[0]?.price ?? null,
    midpoint,
    spread,
    lastTradePrice,
  };
}

// Gets chart points for one outcome token.
export async function getPriceHistory(tokenId: string): Promise<PriceHistoryPoint[]> {
  const params = new URLSearchParams({
    market: tokenId,
    interval: "1d",
    fidelity: "60",
  });

  const data = await fetchClob(`/prices-history?${params.toString()}`);

  if (!data || typeof data !== "object") {
    return [];
  }

  const history = (data as JsonRecord).history;

  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((point) => {
      if (!point || typeof point !== "object") {
        return null;
      }

      const record = point as JsonRecord;
      const time = toNumber(record.t);
      const value = toNumber(record.p);

      if (time === undefined || value === undefined) {
        return null;
      }

      return { time, value };
    })
    .filter((point): point is PriceHistoryPoint => point !== null);
}
