"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Leaf, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Otsi" },
  { href: "/kategooriad", label: "Kategooriad" },
  { href: "/info", label: "Info" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex min-h-[44px] items-center gap-2 text-xl font-bold text-green-800">
          <Leaf className="h-6 w-6" aria-hidden />
          TerraClean
        </Link>

        <nav aria-label="Peamenüü" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(pathname, n.href) ? "page" : undefined}
              className={cn(
                "flex min-h-[44px] items-center rounded-lg px-4 text-base font-medium hover:bg-slate-100",
                isActive(pathname, n.href) ? "bg-green-50 text-green-800" : "text-slate-800",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100 md:hidden"
            aria-label="Ava menüü"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="flex items-center gap-2 text-xl font-bold text-green-800">
              <Leaf className="h-6 w-6" aria-hidden />
              TerraClean
            </SheetTitle>
            <SheetDescription className="sr-only">Peamenüü</SheetDescription>
            <nav aria-label="Mobiilimenüü" className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, n.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-[48px] items-center rounded-lg px-4 text-lg font-medium hover:bg-slate-100",
                    isActive(pathname, n.href) ? "bg-green-50 text-green-800" : "text-slate-800",
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
