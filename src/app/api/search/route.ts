import { NextRequest, NextResponse } from "next/server";
import { allowLog } from "@/lib/rate-limit";
import { logSearch, normalizeQuery, searchItems, similarNames } from "@/lib/search";

export const dynamic = "force-dynamic";

const DB_ERROR = "Andmebaasiga ei õnnestunud ühendust luua. Palun proovi mõne hetke pärast uuesti.";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

// GET /api/search?q=...            -> submitted search (logged, rate-limited logging)
// GET /api/search?q=...&suggest=1  -> autocomplete (not logged)
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = normalizeQuery(params.get("q"));
  const suggest = params.get("suggest") === "1";

  if (!q) return NextResponse.json({ query: "", results: [], similar: [] });

  try {
    const results = await searchItems(q, suggest ? 8 : 20);
    if (suggest) return NextResponse.json({ query: q, results, similar: [] });

    const similar = results.length === 0 ? await similarNames(q, 5) : [];
    if (allowLog(clientIp(req))) await logSearch(q, results.length);
    return NextResponse.json({ query: q, results, similar });
  } catch (error) {
    console.error("Search failed", error);
    return NextResponse.json({ error: DB_ERROR }, { status: 503 });
  }
}
