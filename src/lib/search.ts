import { Prisma } from "@prisma/client";
import { prisma } from "./db";

export const MAX_QUERY_LENGTH = 100;
export const MIN_QUERY_LENGTH = 2;
const MAX_GROUPS = 20;

export type ItemMatch = {
  id: number;
  condition: string | null;
  relation: "fits" | "does_not_fit";
  whereToTake: string;
  isGeneralTerm: boolean;
  sourceUrl: string;
  /** The category the item belongs to. */
  category: {
    id: string;
    name: string;
    howToCollect: string;
    whereToTake: string;
    sourceUrl: string;
  };
  /** For 'does_not_fit': the category page where the item is listed as not allowed. */
  notAllowedIn: { id: string; name: string } | null;
};

export type ResultGroup = {
  /** Item name; rows with the same name (different conditions) are grouped. */
  name: string;
  score: number;
  matches: ItemMatch[];
};

export function normalizeQuery(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const q = raw.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH).trim();
  return q.length >= MIN_QUERY_LENGTH ? q : null;
}

type Row = {
  id: number;
  name: string;
  condition: string | null;
  relation: string;
  whereToTake: string;
  isGeneralTerm: boolean;
  sourceUrl: string;
  sourcePageId: string;
  categoryId: string;
  categoryName: string;
  howToCollect: string;
  categoryWhereToTake: string;
  categorySourceUrl: string;
  score: number;
};

/**
 * Ranking: exact (100) > starts with (80) > contains (60) > trigram similarity (20-50).
 * Synonym matches are 5 points lower than name matches; general terms are 15 lower.
 * Matching is case- and diacritic-insensitive (unaccent + lower).
 */
async function queryItems(q: string, minSimilarity: number, limit: number): Promise<Row[]> {
  return prisma.$queryRaw<Row[]>(Prisma.sql`
    WITH query AS (SELECT unaccent(lower(${q})) AS q),
    scored AS (
      SELECT i.*,
        (
          SELECT MAX(
            (CASE
              WHEN c.n = query.q THEN 100
              WHEN left(c.n, length(query.q)) = query.q THEN 80
              WHEN position(query.q in c.n) > 0 THEN 60
              WHEN GREATEST(similarity(c.n, query.q), word_similarity(query.q, c.n)) >= ${minSimilarity}
                THEN 20 + 30 * GREATEST(similarity(c.n, query.q), word_similarity(query.q, c.n))
              ELSE 0
            END) - (CASE WHEN c.is_synonym THEN 5 ELSE 0 END)
          )
          FROM (
            SELECT unaccent(lower(i.name)) AS n, false AS is_synonym
            UNION ALL
            SELECT unaccent(lower(s)), true FROM unnest(i.synonyms) AS s
          ) c
        )::float8 AS base_score
      FROM "Item" i, query
    )
    SELECT s.id, s.name, s."condition", s.relation, s."whereToTake", s."isGeneralTerm",
           s."sourceUrl", s."sourcePageId", s."categoryId",
           c.name AS "categoryName", c."howToCollect" AS "howToCollect",
           c."whereToTake" AS "categoryWhereToTake", c."sourceUrl" AS "categorySourceUrl",
           (s.base_score - CASE WHEN s."isGeneralTerm" THEN 15 ELSE 0 END)::float8 AS score
    FROM scored s
    JOIN "Category" c ON c.id = s."categoryId"
    WHERE s.base_score > 15
    ORDER BY score DESC, s.name ASC, s.id ASC
    LIMIT ${limit}
  `);
}

async function categoryNames(): Promise<Map<string, string>> {
  const cats = await prisma.category.findMany({ select: { id: true, name: true } });
  return new Map(cats.map((c) => [c.id, c.name]));
}

function group(rows: Row[], names: Map<string, string>, maxGroups: number): ResultGroup[] {
  const groups = new Map<string, ResultGroup>();
  for (const r of rows) {
    const key = r.name.toLocaleLowerCase("et");
    let g = groups.get(key);
    if (!g) {
      if (groups.size >= maxGroups) continue;
      g = { name: r.name, score: r.score, matches: [] };
      groups.set(key, g);
    }
    g.matches.push({
      id: r.id,
      condition: r.condition,
      relation: r.relation === "does_not_fit" ? "does_not_fit" : "fits",
      whereToTake: r.whereToTake,
      isGeneralTerm: r.isGeneralTerm,
      sourceUrl: r.sourceUrl,
      category: {
        id: r.categoryId,
        name: r.categoryName,
        howToCollect: r.howToCollect,
        whereToTake: r.categoryWhereToTake,
        sourceUrl: r.categorySourceUrl,
      },
      notAllowedIn:
        r.relation === "does_not_fit"
          ? { id: r.sourcePageId, name: names.get(r.sourcePageId) ?? r.sourcePageId }
          : null,
    });
  }
  return [...groups.values()];
}

export async function searchItems(q: string, maxGroups = MAX_GROUPS): Promise<ResultGroup[]> {
  const [rows, names] = await Promise.all([queryItems(q, 0.3, 80), categoryNames()]);
  return group(rows, names, maxGroups);
}

/** Looser fuzzy match used for "did you mean" suggestions when nothing was found. */
export async function similarNames(q: string, limit = 5): Promise<string[]> {
  const rows = await queryItems(q, 0.15, 60);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of rows) {
    const key = r.name.toLocaleLowerCase("et");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r.name);
    if (out.length >= limit) break;
  }
  return out;
}

export async function logSearch(query: string, resultCount: number): Promise<void> {
  try {
    await prisma.searchLog.create({ data: { query, resultCount } });
  } catch {
    // Logging must never break a search.
  }
}
