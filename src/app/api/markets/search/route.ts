import { NextResponse } from "next/server";
import { searchMarkets } from "@/lib/polymarket/gamma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";

    const markets = await searchMarkets(query);

    return NextResponse.json({ markets });
  } catch (error) {
    console.error("Market search failed:", error);

    return NextResponse.json(
      { error: "Failed to search markets" },
      { status: 500 }
    );
  }
}
