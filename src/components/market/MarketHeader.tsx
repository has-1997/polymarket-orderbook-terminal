import type { MarketSummary } from "@/lib/polymarket/types";
import { formatCurrency, formatDate } from "@/lib/format";

type MarketHeaderProps = {
  market: MarketSummary;
};

export function MarketHeader({ market }: MarketHeaderProps) {
  const isClosed = market.closed || market.active === false;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          {market.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={market.image}
              alt=""
              className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-xl">
              ◈
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={
                  isClosed
                    ? "rounded-full bg-slate-500/15 px-3 py-1 text-xs font-medium text-slate-300"
                    : "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200"
                }
              >
                {isClosed ? "Closed" : "Active"}
              </span>

              {market.category ? (
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {market.category}
                </span>
              ) : null}
            </div>

            <h1 className="mt-3 max-w-4xl text-2xl font-bold tracking-tight text-white md:text-4xl">
              {market.question}
            </h1>

            <p className="mt-2 text-sm text-slate-500">/{market.slug}</p>
          </div>
        </div>

        <a
          href="/"
          className="rounded-2xl border border-white/10 px-4 py-2 text-center text-sm font-medium text-slate-200 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
        >
          Search markets
        </a>
      </div>

      <dl className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <dt className="text-sm text-slate-500">Volume</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{formatCurrency(market.volume)}</dd>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <dt className="text-sm text-slate-500">Liquidity</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {formatCurrency(market.liquidity)}
          </dd>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <dt className="text-sm text-slate-500">End date</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{formatDate(market.endDate)}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-400">
        <p>YES token: {market.yesTokenId ?? "not found"}</p>
        <p className="mt-1">NO token: {market.noTokenId ?? "not found"}</p>
      </div>
    </section>
  );
}
