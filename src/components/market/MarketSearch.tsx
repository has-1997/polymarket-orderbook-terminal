"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MarketSummary } from "@/lib/polymarket/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function MarketSearch() {
  const [query, setQuery] = useState("");
  const [markets, setMarkets] = useState<MarketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const searchUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    return `/api/markets/search?${params.toString()}`;
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMarkets() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(searchUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = (await response.json()) as { markets?: MarketSummary[] };
        setMarkets(data.markets ?? []);
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
          return;
        }

        setError("Could not load markets. Try again in a moment.");
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = window.setTimeout(loadMarkets, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchUrl]);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
        <label htmlFor="market-search" className="text-sm font-medium text-slate-300">
          Search Polymarket markets
        </label>

        <input
          id="market-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: bitcoin, fed, election, champions league..."
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-base text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400"
        />

        <p className="mt-3 text-sm text-slate-400">
          Search loads active public markets. Click a market to open its orderbook terminal.
        </p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-slate-300">
            Loading markets...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && markets.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-slate-300">
            No markets found. Try a broader search term.
          </div>
        ) : null}

        {markets.map((market) => (
          <Link
            key={market.slug}
            href={`/markets/${market.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/60 hover:bg-cyan-400/5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {market.active === false || market.closed ? "Closed" : "Active"}
                  </span>

                  {market.category ? (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {market.category}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-cyan-100">
                  {market.question}
                </h2>

                <p className="mt-2 text-sm text-slate-500">/{market.slug}</p>
              </div>

              <div className="grid min-w-56 grid-cols-3 gap-3 text-sm md:text-right">
                <div>
                  <p className="text-slate-500">Volume</p>
                  <p className="font-medium text-slate-200">{formatCurrency(market.volume)}</p>
                </div>

                <div>
                  <p className="text-slate-500">Liquidity</p>
                  <p className="font-medium text-slate-200">{formatCurrency(market.liquidity)}</p>
                </div>

                <div>
                  <p className="text-slate-500">Ends</p>
                  <p className="font-medium text-slate-200">{formatDate(market.endDate)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
