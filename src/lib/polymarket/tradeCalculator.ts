import type { OrderBookLevel } from "./types";

export type TradeEstimate = {
  inputDollars: number;
  estimatedShares: number;
  estimatedCost: number;
  averageFillPrice: number | null;
  bestAsk: number | null;
  worstPriceTouched: number | null;
  slippage: number | null;
  levelsTouched: number;
  unfilledDollars: number;
  warningLevel: "reasonable" | "caution" | "too-large" | "unavailable";
  message: string;
};

export function estimateBuyFromAsks(
  asks: OrderBookLevel[],
  inputDollars: number
): TradeEstimate {
  const cleanDollars = Number.isFinite(inputDollars) && inputDollars > 0 ? inputDollars : 0;
  const sortedAsks = [...asks]
    .filter((level) => level.price > 0 && level.size > 0)
    .sort((a, b) => a.price - b.price);

  const bestAsk = sortedAsks[0]?.price ?? null;

  if (cleanDollars <= 0 || sortedAsks.length === 0 || bestAsk === null) {
    return {
      inputDollars: cleanDollars,
      estimatedShares: 0,
      estimatedCost: 0,
      averageFillPrice: null,
      bestAsk,
      worstPriceTouched: null,
      slippage: null,
      levelsTouched: 0,
      unfilledDollars: cleanDollars,
      warningLevel: "unavailable",
      message: "Enter a dollar amount and choose a token with available asks.",
    };
  }

  let remainingDollars = cleanDollars;
  let estimatedShares = 0;
  let estimatedCost = 0;
  let worstPriceTouched: number | null = null;
  let levelsTouched = 0;

  for (const level of sortedAsks) {
    if (remainingDollars <= 0) {
      break;
    }

    const fullLevelCost = level.price * level.size;
    levelsTouched += 1;
    worstPriceTouched = level.price;

    if (remainingDollars >= fullLevelCost) {
      estimatedShares += level.size;
      estimatedCost += fullLevelCost;
      remainingDollars -= fullLevelCost;
      continue;
    }

    const partialShares = remainingDollars / level.price;
    estimatedShares += partialShares;
    estimatedCost += remainingDollars;
    remainingDollars = 0;
    break;
  }

  const averageFillPrice = estimatedShares > 0 ? estimatedCost / estimatedShares : null;
  const slippage =
    averageFillPrice !== null && bestAsk !== null ? averageFillPrice - bestAsk : null;

  let warningLevel: TradeEstimate["warningLevel"] = "reasonable";
  let message = "Looks reasonable based on current asks.";

  if (remainingDollars > 0) {
    warningLevel = "too-large";
    message = "This amount is larger than visible ask liquidity.";
  } else if ((slippage ?? 0) >= 0.03 || levelsTouched >= 6) {
    warningLevel = "too-large";
    message = "This walks deep into the book. Size may be too large for current liquidity.";
  } else if ((slippage ?? 0) >= 0.01 || levelsTouched >= 3) {
    warningLevel = "caution";
    message = "This touches multiple price levels. Use caution.";
  }

  return {
    inputDollars: cleanDollars,
    estimatedShares,
    estimatedCost,
    averageFillPrice,
    bestAsk,
    worstPriceTouched,
    slippage,
    levelsTouched,
    unfilledDollars: remainingDollars,
    warningLevel,
    message,
  };
}
