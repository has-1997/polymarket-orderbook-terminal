import { notFound } from "next/navigation";
import { MarketHeader } from "@/components/market/MarketHeader";
import { MarketTerminal } from "@/components/market/MarketTerminal";
import { getMarketBySlug } from "@/lib/polymarket/gamma";

type MarketPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MarketPage({ params }: MarketPageProps) {
  const { slug } = await params;
  const market = await getMarketBySlug(slug);

  if (!market) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <MarketHeader market={market} />

        <MarketTerminal market={market} />
      </div>
    </main>
  );
}
