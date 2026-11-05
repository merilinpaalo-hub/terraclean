import Link from "next/link";
import { ArrowRight, ExternalLink, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryChip } from "@/components/category-chip";
import { categoryStyle } from "@/lib/category-style";
import type { ResultGroup, ItemMatch } from "@/lib/search";
import { cn } from "@/lib/utils";

function MatchBlock({ match }: { match: ItemMatch }) {
  const notFit = match.relation === "does_not_fit";
  return (
    <div className="space-y-3">
      {match.condition && (
        <Badge className="bg-slate-100 text-slate-900">{match.condition}</Badge>
      )}

      {notFit && match.notAllowedIn && (
        <p className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-base text-amber-950">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <span>
            See ei kuulu kategooriasse{" "}
            <Link href={`/kategooriad/${match.notAllowedIn.id}`} className="font-semibold underline">
              {match.notAllowedIn.name}
            </Link>
            . Õige koht on allpool.
          </span>
        </p>
      )}

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          {notFit ? "Õige kategooria" : "Kategooria"}
        </p>
        <Link href={`/kategooriad/${match.category.id}`} className="inline-block rounded-lg">
          <CategoryChip id={match.category.id} name={match.category.name} />
        </Link>
      </div>

      <dl className="space-y-3 text-base">
        <div>
          <dt className="text-sm font-medium text-slate-700">Kuhu viia</dt>
          <dd className="font-medium">{match.whereToTake}</dd>
        </div>
        {match.category.howToCollect.trim() && (
          <div>
            <dt className="text-sm font-medium text-slate-700">Kuidas koguda</dt>
            <dd className="text-slate-800">{match.category.howToCollect}</dd>
          </div>
        )}
      </dl>

      <a
        href={match.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-1 text-sm text-slate-700 underline hover:text-green-800"
      >
        Allikas: Kliimaministeeriumi juhend
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}

export function ResultCard({ group }: { group: ResultGroup }) {
  const first = group.matches[0];
  const bar = categoryStyle(first.category.id).bar;
  return (
    <Card className="overflow-hidden">
      <div className={cn("h-1.5", bar)} aria-hidden />
      <CardContent className="space-y-5">
        <h2 className="text-xl font-bold">{group.name}</h2>
        <div className="divide-y divide-slate-200">
          {group.matches.map((m) => (
            <div key={m.id} className="py-4 first:pt-0 last:pb-0">
              <MatchBlock match={m} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BrowseCategoriesButton() {
  return (
    <Link
      href="/kategooriad"
      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-medium text-primary-foreground hover:bg-green-800"
    >
      Sirvi kategooriaid
      <ArrowRight className="h-5 w-5" aria-hidden />
    </Link>
  );
}
