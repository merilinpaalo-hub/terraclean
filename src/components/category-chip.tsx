import { categoryStyle } from "@/lib/category-style";
import { cn } from "@/lib/utils";

export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const style = categoryStyle(id);
  const Icon = style.icon;
  return (
    <span
      className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", style.chip, className)}
      aria-hidden
    >
      <Icon className="h-6 w-6" />
    </span>
  );
}

export function CategoryChip({ id, name }: { id: string; name: string }) {
  const style = categoryStyle(id);
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold",
        style.chip,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {name}
    </span>
  );
}
