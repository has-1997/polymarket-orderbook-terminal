import { NextResponse } from "next/server";
import { getMarketBySlug } from "@/lib/polymarket/gamma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const market = await getMarketBySlug(slug);

    if (!market) {
      return NextResponse.json(
        { error: "Market not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ market });
  } catch (error) {
    console.error("Market detail lookup failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch market" },
      { status: 500 }
    );
  }
}
