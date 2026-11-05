import { NextResponse } from "next/server";
import { getCategoryDetail } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const detail = await getCategoryDetail(id.slice(0, 100));
    if (!detail) return NextResponse.json({ error: "Kategooriat ei leitud." }, { status: 404 });
    return NextResponse.json(detail);
  } catch (error) {
    console.error("Category failed", error);
    return NextResponse.json(
      { error: "Andmebaasiga ei õnnestunud ühendust luua. Palun proovi mõne hetke pärast uuesti." },
      { status: 503 },
    );
  }
}
