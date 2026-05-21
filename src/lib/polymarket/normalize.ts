import type { MarketSummary, OrderBookLevel } from "./types";

// Converts unknown values like "123.45" or 123.45 into a safe number.
export function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

// Converts unknown values into a safe string, or undefined if empty.
export function toStringValue(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

// Some Polymarket fields may be arrays, and some may be JSON strings.
// This helper safely handles both.
export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return [];
    }
  }

  return [];
}

// Finds YES and NO token IDs from common Gamma market fields.
export function extractOutcomeTokenIds(rawMarket: Record<string, unknown>) {
  const outcomes = parseStringArray(rawMarket.outcomes);
  const tokenIds =
    parseStringArray(rawMarket.clobTokenIds).length > 0
      ? parseStringArray(rawMarket.clobTokenIds)
      : parseStringArray(rawMarket.clob_token_ids);

  const yesIndex = outcomes.findIndex((outcome) => outcome.toLowerCase() === "yes");
  const noIndex = outcomes.findIndex((outcome) => outcome.toLowerCase() === "no");

  return {
    yesTokenId: yesIndex >= 0 ? tokenIds[yesIndex] : tokenIds[0],
    noTokenId: noIndex >= 0 ? tokenIds[noIndex] : tokenIds[1],
  };
}

// Converts one raw Gamma market object into the simple shape our UI wants.
export function normalizeMarket(rawMarket: Record<string, unknown>): MarketSummary {
  const { yesTokenId, noTokenId } = extractOutcomeTokenIds(rawMarket);

  return {
    slug: toStringValue(rawMarket.slug) ?? "",
    question:
      toStringValue(rawMarket.question) ??
      toStringValue(rawMarket.title) ??
      "Untitled market",
    conditionId:
      toStringValue(rawMarket.conditionId) ??
      toStringValue(rawMarket.condition_id),
    image:
      toStringValue(rawMarket.image) ??
      toStringValue(rawMarket.icon),
    category:
      toStringValue(rawMarket.category) ??
      toStringValue(rawMarket.groupItemTitle),
    active: typeof rawMarket.active === "boolean" ? rawMarket.active : undefined,
    closed: typeof rawMarket.closed === "boolean" ? rawMarket.closed : undefined,
    volume:
      toNumber(rawMarket.volume) ??
      toNumber(rawMarket.volumeNum) ??
      toNumber(rawMarket.volume24hr),
    liquidity:
      toNumber(rawMarket.liquidity) ??
      toNumber(rawMarket.liquidityNum),
    endDate:
      toStringValue(rawMarket.endDate) ??
      toStringValue(rawMarket.end_date),
    yesTokenId,
    noTokenId,
  };
}

// Converts raw CLOB price levels into safe numeric levels.
export function normalizeOrderBookLevels(value: unknown): OrderBookLevel[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((level) => {
      if (!level || typeof level !== "object") {
        return null;
      }

      const record = level as Record<string, unknown>;
      const price = toNumber(record.price);
      const size = toNumber(record.size);

      if (price === undefined || size === undefined) {
        return null;
      }

      return { price, size };
    })
    .filter((level): level is OrderBookLevel => level !== null);
}
