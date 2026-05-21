import { NextResponse } from "next/server";
import { getPriceHistory } from "@/lib/polymarket/clob";

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

    const history = await getPriceHistory(tokenId);

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Market price history lookup failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
