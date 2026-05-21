import type { MarketPrices } from "@/lib/polymarket/types";
import { formatPercentPrice } from "@/lib/format";

type PriceCardsProps = {
  prices: MarketPrices | null;
  isLoading: boolean;
};

type CardProps = {
  label: string;
  value: string;
  helper: string;
};

function PriceCard({ label, value, helper }: CardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

export function PriceCards({ prices, isLoading }: PriceCardsProps) {
  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold text-white">Prices</h2>
        <p className="mt-3 text-sm text-slate-400">Loading price data...</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Prices</h2>
        <p className="mt-1 text-sm text-slate-400">
          These values come from the selected outcome token&apos;s CLOB market data.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <PriceCard
          label="Best bid"
          value={formatPercentPrice(prices?.bestBid)}
          helper="Highest current buy offer"
        />

        <PriceCard
          label="Best ask"
          value={formatPercentPrice(prices?.bestAsk)}
          helper="Lowest current sell offer"
        />

        <PriceCard
          label="Midpoint"
          value={formatPercentPrice(prices?.midpoint)}
          helper="Middle of bid and ask"
        />

        <PriceCard
          label="Spread"
          value={formatPercentPrice(prices?.spread)}
          helper="Gap between ask and bid"
        />

        <PriceCard
          label="Last price"
          value={formatPercentPrice(prices?.lastTradePrice)}
          helper="Recent executable price"
        />
      </div>
    </section>
  );
}
