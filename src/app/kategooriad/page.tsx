import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/category-chip";
import { DbError } from "@/components/db-error";
import { Badge } from "@/components/ui/badge";
import { categoryStyle } from "@/lib/category-style";
import { listCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kategooriad – TerraClean" };

export default async function CategoriesPage() {
  let categories;
  try {
    categories = await listCategories();
  } catch (error) {
    console.error("Categories page failed", error);
    return <DbError />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kategooriad</h1>
        <p className="mt-2 text-lg text-slate-700">Vali kategooria, et näha, mis sinna kuulub.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const style = categoryStyle(c.id);
          return (
            <li key={c.id}>
              <Link
                href={`/kategooriad/${c.id}`}
                className={cn(
                  "flex h-full min-h-[44px] items-start gap-4 rounded-lg border bg-white p-4 shadow-soft transition-shadow hover:shadow-md",
                  style.border,
                )}
              >
                <CategoryIcon id={c.id} />
                <span className="flex-1 space-y-1">
                  <span className="block text-lg font-semibold leading-snug">{c.name}</span>
                  <span className="block text-sm text-slate-700">Jäätmekood: {c.wasteCode}</span>
                  {!c.isNational && <Badge className="mt-1">lisakategooria</Badge>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
