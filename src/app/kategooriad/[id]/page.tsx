import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { CategoryIcon } from "@/components/category-chip";
import { DbError } from "@/components/db-error";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { categoryStyle } from "@/lib/category-style";
import { getCategoryDetail } from "@/lib/categories";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: "Kategooria – TerraClean" };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  let detail;
  try {
    detail = await getCategoryDetail(id.slice(0, 100));
  } catch (error) {
    console.error("Category page failed", error);
    return <DbError />;
  }
  if (!detail) notFound();

  const { category: c, fits, notFit } = detail;
  const style = categoryStyle(c.id);

  const facts: { label: string; value: string }[] = [
    { label: "Mis jäätmest saab", value: c.outcome },
    { label: "Jäätmekood", value: c.wasteCode },
    { label: "Kuidas koguda", value: c.howToCollect },
    { label: "Kuhu viia", value: c.whereToTake },
  ];

  return (
    <div className="space-y-6">
      <Link href="/kategooriad" className="inline-flex min-h-[44px] items-center gap-2 text-base text-slate-800 underline">
        <ArrowLeft className="h-5 w-5" aria-hidden />
        Kõik kategooriad
      </Link>

      <Card className="overflow-hidden">
        <div className={cn("h-1.5", style.bar)} aria-hidden />
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <CategoryIcon id={c.id} className="h-14 w-14" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{c.name}</h1>
              {!c.isNational && <Badge className="mt-1">lisakategooria</Badge>}
            </div>
          </div>
          <dl className="space-y-4 text-base">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-sm font-medium text-slate-700">{f.label}</dt>
                <dd className="text-slate-900">{f.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={c.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1 text-sm text-slate-700 underline hover:text-green-800"
          >
            Allikas: Kliimaministeeriumi juhend
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={["fits"]} className="space-y-4">
        <AccordionItem value="fits">
          <AccordionTrigger>Siia kuulub ({fits.length})</AccordionTrigger>
          <AccordionContent>
            {fits.length === 0 ? (
              <p className="text-slate-700">Selles kategoorias pole üksikuid esemeid loetletud.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {fits.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center gap-2 py-3">
                    <span className="font-medium">{i.name}</span>
                    {i.condition && <Badge>{i.condition}</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notfit">
          <AccordionTrigger>Siia ei kuulu ({notFit.length})</AccordionTrigger>
          <AccordionContent>
            {notFit.length === 0 ? (
              <p className="text-slate-700">Siin pole eraldi loetletud esemeid, mis siia ei kuuluks.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {notFit.map((i) => (
                  <li key={i.id} className="space-y-1 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{i.name}</span>
                      {i.condition && <Badge>{i.condition}</Badge>}
                    </div>
                    <p className="flex flex-wrap items-center gap-2 text-base text-slate-800">
                      <ArrowRight className="h-4 w-4" aria-hidden />
                      <Link href={`/kategooriad/${i.category.id}`} className="font-medium underline">
                        {i.category.name}
                      </Link>
                      <span>– {i.whereToTake}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
