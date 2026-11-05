"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrowseCategoriesButton, ResultCard } from "@/components/result-card";
import { CategoryIcon } from "@/components/category-chip";
import type { ResultGroup } from "@/lib/search";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "Kirjuta ese, nt munakoor, tetrapakk, patarei…";
const NETWORK_ERROR = "Otsing ebaõnnestus. Kontrolli internetiühendust ja proovi uuesti.";

type SearchResponse = { query: string; results: ResultGroup[]; similar: string[]; error?: string };

export function SearchApp() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<ResultGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const suggestSeq = useRef(0);
  const searchSeq = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete: debounce 250 ms, only from 2 characters, never logged (suggest=1).
  useEffect(() => {
    const q = input.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const seq = ++suggestSeq.current;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?suggest=1&q=${encodeURIComponent(q.slice(0, 100))}`);
        if (!res.ok) throw new Error("bad status");
        const data: SearchResponse = await res.json();
        if (seq === suggestSeq.current) {
          setSuggestions(data.results);
          setActive(-1);
        }
      } catch {
        if (seq === suggestSeq.current) setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [input]);

  const runSearch = useCallback(async (raw: string) => {
    const q = raw.trim().slice(0, 100);
    setOpen(false);
    setActive(-1);
    suggestSeq.current++; // drop pending autocomplete responses
    if (q.length < 2) {
      setResult(null);
      setError(q.length === 0 ? null : "Kirjuta vähemalt 2 tähemärki.");
      return;
    }
    const seq = ++searchSeq.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: SearchResponse = await res.json();
      if (seq !== searchSeq.current) return;
      if (!res.ok) {
        setResult(null);
        setError(data.error ?? NETWORK_ERROR);
      } else {
        setResult(data);
        window.history.replaceState(null, "", `/?q=${encodeURIComponent(q)}`);
      }
    } catch {
      if (seq === searchSeq.current) {
        setResult(null);
        setError(NETWORK_ERROR);
      }
    } finally {
      if (seq === searchSeq.current) setLoading(false);
    }
  }, []);

  // Support shared links like /?q=patarei
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      setInput(q.slice(0, 100));
      void runSearch(q);
    }
  }, [runSearch]);

  function choose(name: string) {
    setInput(name);
    void runSearch(name);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (e.key === "Enter" && open && active >= 0 && suggestions[active]) {
      e.preventDefault();
      choose(suggestions[active].name);
    }
  }

  const showList = open && suggestions.length > 0;

  return (
    <div className="space-y-8">
      <section className="mx-auto max-w-2xl pt-4 text-center sm:pt-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Kuhu see jääde kuulub?</h1>
        <p className="mt-3 text-lg text-slate-700">
          Otsi eset ja vaata, millisesse konteinerisse või kogumispunkti see Eestis viia.
        </p>

        <form
          role="search"
          className="relative mt-6 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch(input);
          }}
        >
          <label htmlFor="q" className="sr-only">
            Otsi eset
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600"
                aria-hidden
              />
              <Input
                id="q"
                ref={inputRef}
                value={input}
                maxLength={100}
                autoComplete="off"
                placeholder={PLACEHOLDER}
                className="pl-12"
                role="combobox"
                aria-expanded={showList}
                aria-controls="suggestions"
                aria-autocomplete="list"
                aria-activedescendant={active >= 0 ? `sugg-${active}` : undefined}
                onChange={(e) => {
                  setInput(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                onKeyDown={onKeyDown}
              />
            </div>
            <Button type="submit" className="h-14 px-6" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Search className="h-5 w-5" aria-hidden />}
              <span className="hidden sm:inline">Otsi</span>
              <span className="sr-only sm:hidden">Otsi</span>
            </Button>
          </div>

          {showList && (
            <ul
              id="suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-soft"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.name}
                  id={`sugg-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(s.name)}
                  className={cn(
                    "flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-base",
                    i === active ? "bg-green-50" : "hover:bg-slate-100",
                  )}
                >
                  <CategoryIcon id={s.matches[0].category.id} className="h-9 w-9" />
                  <span className="flex-1">
                    <span className="block font-medium">{s.name}</span>
                    <span className="block text-sm text-slate-700">{s.matches[0].category.name}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </form>
      </section>

      <div aria-live="polite" className="mx-auto max-w-2xl space-y-4">
        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-base text-red-900">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>{error}</p>
          </div>
        )}

        {result && result.results.length > 0 && (
          <>
            <p className="text-base text-slate-700">
              Leitud {result.results.length} {result.results.length === 1 ? "tulemus" : "tulemust"} otsingule „{result.query}”
            </p>
            {result.results.map((g) => (
              <ResultCard key={g.name} group={g} />
            ))}
            <p className="text-sm text-slate-700">
              Kohalikud omavalitsuse reeglid võivad erineda. Vaata lisaks oma omavalitsuse jäätmereegleid.
            </p>
          </>
        )}

        {result && result.results.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
            <h2 className="text-xl font-bold">Midagi ei leidnud</h2>
            <p className="mt-2 text-base text-slate-700">
              Otsingule „{result.query}” ei leidnud me ühtegi vastet. Proovi kirjutada ese teisiti või vali kategooria.
            </p>
            {result.similar.length > 0 && (
              <div className="mt-4">
                <p className="text-base font-medium">Kas mõtlesid midagi neist?</p>
                <ul className="mt-2 flex flex-wrap justify-center gap-2">
                  {result.similar.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => choose(name)}
                        className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-4 text-base hover:bg-slate-100"
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-5">
              <BrowseCategoriesButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
