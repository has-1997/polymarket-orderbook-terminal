"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderBookTable } from "@/components/market/OrderBookTable";
import { OutcomeSelector } from "@/components/market/OutcomeSelector";
import { PriceCards } from "@/components/market/PriceCards";
import { PriceHistoryChart } from "@/components/market/PriceHistoryChart";
import { TradeSizeCalculator } from "@/components/market/TradeSizeCalculator";
import type {
  MarketPrices,
  MarketPricesResponse,
  MarketSummary,
  OrderBook,
  PriceHistoryPoint,
} from "@/lib/polymarket/types";

type Outcome = "YES" | "NO";

type MarketTerminalProps = {
  market: MarketSummary;
};

export function MarketTerminal({ market }: MarketTerminalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>("YES");
  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [history, setHistory] = useState<PriceHistoryPoint[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const selectedTokenId = useMemo(() => {
    return selectedOutcome === "YES" ? market.yesTokenId : market.noTokenId;
  }, [market.noTokenId, market.yesTokenId, selectedOutcome]);

  useEffect(() => {
    if (!selectedTokenId) {
      setPrices(null);
      setOrderBook(null);
      setPriceError("No token ID found for this outcome.");
      return;
    }

    const controller = new AbortController();

    async function loadPrices() {
      setIsLoadingPrices(true);
      setPriceError("");

      try {
        const params = new URLSearchParams({ tokenId: selectedTokenId ?? "" });
        const response = await fetch(`/api/markets/${market.slug}/prices?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Price request failed");
        }

        const data = (await response.json()) as MarketPricesResponse;
        setPrices(data.prices ?? null);
        setOrderBook(data.orderBook ?? null);
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
          return;
        }

        setPrices(null);
        setOrderBook(null);
        setPriceError("Could not load price data for this token.");
      } finally {
        setIsLoadingPrices(false);
      }
    }

    loadPrices();

    return () => {
      controller.abort();
    };
  }, [market.slug, selectedTokenId]);

  useEffect(() => {
    if (!selectedTokenId) {
      setHistory([]);
      setHistoryError("No token ID found for this outcome.");
      return;
    }

    const controller = new AbortController();

    async function loadHistory() {
      setIsLoadingHistory(true);
      setHistoryError("");

      try {
        const params = new URLSearchParams({ tokenId: selectedTokenId ?? "" });
        const response = await fetch(`/api/markets/${market.slug}/history?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("History request failed");
        }

        const data = (await response.json()) as { history?: PriceHistoryPoint[] };
        setHistory(data.history ?? []);
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
          return;
        }

        setHistory([]);
        setHistoryError("Could not load price history for this token.");
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadHistory();

    return () => {
      controller.abort();
    };
  }, [market.slug, selectedTokenId]);

  return (
    <div className="grid gap-6">
      <OutcomeSelector
        selectedOutcome={selectedOutcome}
        onChange={setSelectedOutcome}
        yesTokenId={market.yesTokenId}
        noTokenId={market.noTokenId}
      />

      {priceError ? (
        <section className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {priceError}
        </section>
      ) : null}

      <PriceCards prices={prices} isLoading={isLoadingPrices} />

      {historyError ? (
        <section className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {historyError}
        </section>
      ) : null}

      <PriceHistoryChart history={history} isLoading={isLoadingHistory} />

      <TradeSizeCalculator asks={orderBook?.asks ?? []} />

      <OrderBookTable
        bids={orderBook?.bids ?? []}
        asks={orderBook?.asks ?? []}
        isLoading={isLoadingPrices}
      />
    </div>
  );
}
