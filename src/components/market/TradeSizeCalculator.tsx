"use client";

import { useMemo, useState } from "react";
import type { OrderBookLevel } from "@/lib/polymarket/types";
import { estimateBuyFromAsks } from "@/lib/polymarket/tradeCalculator";
import { formatCurrency, formatNumber, formatPercentPrice } from "@/lib/format";

type TradeSizeCalculatorProps = {
  asks: OrderBookLevel[];
};

function warningClass(level: string) {
  if (level === "reasonable") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-100";
  }

  if (level === "caution") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-100";
  }

  if (level === "too-large") {
    return "border-red-400/30 bg-red-400/10 text-red-100";
  }

  return "border-white/10 bg-slate-950/70 text-slate-300";
}

export function TradeSizeCalculator({ asks }: TradeSizeCalculatorProps) {
  const [dollarInput, setDollarInput] = useState("100");

  const inputDollars = Number(dollarInput);

  const estimate = useMemo(() => {
    return estimateBuyFromAsks(asks, inputDollars);
  }, [asks, inputDollars]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Trade-size calculator</h2>
        <p className="mt-1 text-sm text-slate-400">
          Hypothetical BUY estimate only. It walks through current asks from cheapest to most
          expensive.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <label htmlFor="trade-size" className="text-sm font-medium text-slate-300">
            Dollar amount
          </label>

          <div className="mt-3 flex items-center rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 focus-within:border-cyan-400">
            <span className="text-slate-500">$</span>
            <input
              id="trade-size"
              value={dollarInput}
              onChange={(event) => setDollarInput(event.target.value)}
              inputMode="decimal"
              className="ml-2 w-full bg-transparent text-lg font-semibold text-white outline-none"
              placeholder="100"
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            This does not place a trade. It only estimates against currently visible asks.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Estimated shares</p>
            <p className="mt-2 text-xl font-bold text-white">
              {formatNumber(estimate.estimatedShares)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Average fill</p>
            <p className="mt-2 text-xl font-bold text-white">
              {formatPercentPrice(estimate.averageFillPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Worst price touched</p>
            <p className="mt-2 text-xl font-bold text-white">
              {formatPercentPrice(estimate.worstPriceTouched)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Slippage from best ask</p>
            <p className="mt-2 text-xl font-bold text-white">
              {formatPercentPrice(estimate.slippage)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Levels touched</p>
            <p className="mt-2 text-xl font-bold text-white">{estimate.levelsTouched}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Unfilled dollars</p>
            <p className="mt-2 text-xl font-bold text-white">
              {formatCurrency(estimate.unfilledDollars)}
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-5 rounded-2xl border p-4 text-sm ${warningClass(estimate.warningLevel)}`}>
        {estimate.message}
      </div>
    </section>
  );
}
