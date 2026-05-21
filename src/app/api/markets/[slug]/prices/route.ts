import { NextResponse } from "next/server";
import { getMarketPrices, getOrderBook } from "@/lib/polymarket/clob";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tokenId = url.searchParams.get("tokenId");

    if (!tokenId) {
      return NextResponse.json(
        { error: "Missing tokenId query parameter" },
        { status: 400 }
      );
    }

    const [prices, orderBook] = await Promise.all([
      getMarketPrices(tokenId),
      getOrderBook(tokenId),
    ]);

    return NextResponse.json({
      prices,
      orderBook,
    });
  } catch (error) {
    console.error("Market prices lookup failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch market prices" },
      { status: 500 }
    );
  }
}
