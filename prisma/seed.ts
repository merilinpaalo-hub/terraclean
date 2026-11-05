/**
 * Idempotent seed: loads both CSV files with upserts and then removes rows
 * that are no longer in the CSVs (the CSV files are the source of truth).
 * SearchLog is never touched. Safe to run on every deploy.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dataDir = path.join(process.cwd(), "data");

type Row = Record<string, string>;

function readCsv(file: string): Row[] {
  const text = readFileSync(path.join(dataDir, file), "utf8");
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: false,
  }) as Row[];
}

function required(row: Row, key: string, file: string): string {
  const value = row[key];
  if (value === undefined) throw new Error(`${file}: missing column "${key}"`);
  return value;
}

async function main() {
  const categoryRows = readCsv("terraclean_kategooriad.csv");
  const itemRows = readCsv("terraclean_esemed.csv");

  // Abort before touching the database if a file is empty or broken.
  if (categoryRows.length === 0 || itemRows.length === 0) {
    throw new Error("CSV file is empty or unreadable; aborting seed without changes.");
  }

  const categories = categoryRows.map((r) => ({
    id: required(r, "id", "kategooriad"),
    name: required(r, "nimetus", "kategooriad"),
    wasteCode: required(r, "jaatmekood", "kategooriad"),
    outcome: required(r, "mis_jaatmest_saab", "kategooriad"),
    howToCollect: required(r, "kuidas_koguda", "kategooriad"),
    whereToTake: required(r, "kuhu_viia", "kategooriad"),
    isNational: required(r, "riiklik_peatukk", "kategooriad").trim() === "jah",
    sourceUrl: required(r, "allikas_url", "kategooriad"),
  }));
  const categoryIds = new Set(categories.map((c) => c.id));

  const items = itemRows.map((r) => {
    const id = Number.parseInt(required(r, "id", "esemed"), 10);
    if (!Number.isInteger(id)) throw new Error(`esemed: invalid id "${r.id}"`);
    const categoryId = required(r, "sihtkategooria_id", "esemed");
    if (!categoryIds.has(categoryId)) {
      throw new Error(`esemed: item ${id} references unknown category "${categoryId}"`);
    }
    const seos = required(r, "seos", "esemed").trim();
    const condition = required(r, "tingimus", "esemed");
    return {
      id,
      name: required(r, "ese", "esemed"),
      synonyms: required(r, "sunonuumid", "esemed")
        .split("; ")
        .filter((s) => s.length > 0),
      condition: condition.length > 0 ? condition : null,
      categoryId,
      whereToTake: required(r, "kuhu_viia", "esemed"),
      relation: seos === "ei_sobi" ? "does_not_fit" : "fits",
      sourcePageId: required(r, "allikaleht_id", "esemed"),
      isGeneralTerm: required(r, "uldmoiste", "esemed").trim() === "jah",
      sourceUrl: required(r, "allikas_url", "esemed"),
    };
  });

  for (const c of categories) {
    await prisma.category.upsert({ where: { id: c.id }, create: c, update: c });
  }
  for (const i of items) {
    await prisma.item.upsert({ where: { id: i.id }, create: i, update: i });
  }

  // Remove rows that are no longer in the CSV files (items first: FK).
  const delItems = await prisma.item.deleteMany({ where: { id: { notIn: items.map((i) => i.id) } } });
  const delCats = await prisma.category.deleteMany({ where: { id: { notIn: [...categoryIds] } } });

  console.log(
    `Seed done: ${categories.length} categories, ${items.length} items (removed ${delCats.count} categories, ${delItems.count} items).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
