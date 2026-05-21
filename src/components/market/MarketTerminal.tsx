"use client";

import { useMemo, useState } from "react";
import { OutcomeSelector } from "@/components/market/OutcomeSelector";
import type { MarketSummary } from "@/lib/polymarket/types";

type Outcome = "YES" | "NO";

type MarketTerminalProps = {
  market: MarketSummary;
};

export function MarketTerminal({ market }: MarketTerminalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>("YES");

  const selectedTokenId = useMemo(() => {
    return selectedOutcome === "YES" ? market.yesTokenId : market.noTokenId;
  }, [market.noTokenId, market.yesTokenId, selectedOutcome]);

  return (
    <div className="grid gap-6">
      <OutcomeSelector
        selectedOutcome={selectedOutcome}
        onChange={setSelectedOutcome}
        yesTokenId={market.yesTokenId}
        noTokenId={market.noTokenId}
      />

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white">Selected token ready</h2>

        <p className="mt-2 text-sm text-slate-400">
          We will use this token ID to fetch CLOB prices, orderbook depth, and chart history.
        </p>

        <p className="mt-4 break-all rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-400">
          {selectedTokenId ?? "No token ID found for this outcome."}
        </p>
      </section>
    </div>
  );
}
