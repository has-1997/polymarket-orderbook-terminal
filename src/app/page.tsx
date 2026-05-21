import { MarketSearch } from "@/components/market/MarketSearch";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto mb-10 max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
          Polymarket Terminal
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Market Detail + Orderbook Terminal
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Search a Polymarket market, inspect pricing, review liquidity depth, and estimate
          whether a hypothetical trade size would walk the orderbook too far.
        </p>

        <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          Analysis only. This tool does not place trades and does not provide financial advice.
          Orderbook liquidity can change before any real order is submitted.
        </div>
      </section>

      <MarketSearch />
    </main>
  );
}
