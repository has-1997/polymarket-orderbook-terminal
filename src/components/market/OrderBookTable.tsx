import type { OrderBookLevel } from "@/lib/polymarket/types";
import { formatNumber, formatPercentPrice } from "@/lib/format";

type OrderBookTableProps = {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  isLoading: boolean;
};

type DepthLevel = OrderBookLevel & {
  cumulativeSize: number;
};

function withCumulativeSize(levels: OrderBookLevel[]): DepthLevel[] {
  let runningTotal = 0;

  return levels.slice(0, 12).map((level) => {
    runningTotal += level.size;

    return {
      ...level,
      cumulativeSize: runningTotal,
    };
  });
}

function LevelRows({ levels }: { levels: DepthLevel[] }) {
  if (levels.length === 0) {
    return (
      <tr>
        <td colSpan={3} className="px-3 py-4 text-center text-sm text-slate-500">
          No levels available
        </td>
      </tr>
    );
  }

  return (
    <>
      {levels.map((level) => (
        <tr key={`${level.price}-${level.size}`} className="border-t border-white/5">
          <td className="px-3 py-2 font-medium text-white">{formatPercentPrice(level.price)}</td>
          <td className="px-3 py-2 text-slate-300">{formatNumber(level.size)}</td>
          <td className="px-3 py-2 text-slate-400">{formatNumber(level.cumulativeSize)}</td>
        </tr>
      ))}
    </>
  );
}

export function OrderBookTable({ bids, asks, isLoading }: OrderBookTableProps) {
  const topBids = withCumulativeSize(bids);
  const topAsks = withCumulativeSize(asks);

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold text-white">Orderbook depth</h2>
        <p className="mt-3 text-sm text-slate-400">Loading orderbook...</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Orderbook depth</h2>
        <p className="mt-1 text-sm text-slate-400">
          Bids are buy offers. Asks are sell offers. Cumulative size shows depth as you move away
          from the top of the book.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-950/70">
          <div className="border-b border-white/10 bg-emerald-400/10 px-4 py-3">
            <h3 className="font-semibold text-emerald-100">Bids</h3>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Shares</th>
                <th className="px-3 py-2">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              <LevelRows levels={topBids} />
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-2xl border border-rose-400/20 bg-slate-950/70">
          <div className="border-b border-white/10 bg-rose-400/10 px-4 py-3">
            <h3 className="font-semibold text-rose-100">Asks</h3>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Shares</th>
                <th className="px-3 py-2">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              <LevelRows levels={topAsks} />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
