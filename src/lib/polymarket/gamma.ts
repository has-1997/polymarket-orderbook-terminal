import { normalizeMarket } from "./normalize";
import type { MarketSummary } from "./types";

const GAMMA_BASE_URL = "https://gamma-api.polymarket.com";

// This says: "API data starts unknown until we safely inspect it."
type JsonRecord = Record<string, unknown>;

// Fetch JSON from Gamma and throw a helpful error if the request fails.
async function fetchGamma(path: string): Promise<unknown> {
  const response = await fetch(`${GAMMA_BASE_URL}${path}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Pull market objects out of either a direct markets response or an events response.
function extractMarketsFromGammaResponse(data: unknown): JsonRecord[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const markets: JsonRecord[] = [];

  for (const item of data) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as JsonRecord;

    // Direct /markets responses are already market objects.
    if (typeof record.slug === "string" && typeof record.question === "string") {
      markets.push(record);
      continue;
    }

    // /events responses usually contain a markets array inside each event.
    if (Array.isArray(record.markets)) {
      for (const market of record.markets) {
        if (market && typeof market === "object") {
          markets.push(market as JsonRecord);
        }
      }
    }
  }

  return markets;
}

// Search active markets by loading high-volume active events, then filtering locally.
export async function searchMarkets(query: string): Promise<MarketSummary[]> {
  const cleanQuery = query.trim().toLowerCase();

  const data = await fetchGamma(
    "/events?active=true&closed=false&order=volume_24hr&ascending=false&limit=100"
  );

  const markets = extractMarketsFromGammaResponse(data)
    .map(normalizeMarket)
    .filter((market) => market.slug.length > 0 && market.yesTokenId && market.noTokenId);

  if (!cleanQuery) {
    return markets.slice(0, 25);
  }

  return markets
    .filter((market) => {
      const haystack = [
        market.slug,
        market.question,
        market.category ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(cleanQuery);
    })
    .slice(0, 25);
}

// Fetch one market directly by slug.
export async function getMarketBySlug(slug: string): Promise<MarketSummary | null> {
  const cleanSlug = slug.trim();

  if (!cleanSlug) {
    return null;
  }

  const marketData = await fetchGamma(`/markets?slug=${encodeURIComponent(cleanSlug)}`);
  const market = extractMarketsFromGammaResponse(marketData)
    .map(normalizeMarket)
    .find((item) => item.slug === cleanSlug);

  if (market) {
    return market;
  }

  const eventData = await fetchGamma(`/events?slug=${encodeURIComponent(cleanSlug)}`);
  return (
    extractMarketsFromGammaResponse(eventData)
      .map(normalizeMarket)
      .find((item) => item.slug === cleanSlug) ?? null
  );
}
