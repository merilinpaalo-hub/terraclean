import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ isNational: "desc" }, { name: "asc" }],
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories failed", error);
    return NextResponse.json(
      { error: "Andmebaasiga ei õnnestunud ühendust luua. Palun proovi mõne hetke pärast uuesti." },
      { status: 503 },
    );
  }
}
