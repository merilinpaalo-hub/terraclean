"use client";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-xl rounded-lg border border-red-300 bg-red-50 p-6 text-center text-red-900">
      <h1 className="text-xl font-bold">Midagi läks valesti</h1>
      <p className="mt-2 text-base">Lehe laadimine ebaõnnestus. Palun proovi uuesti.</p>
      <Button className="mt-4" onClick={reset}>
        Proovi uuesti
      </Button>
    </div>
  );
}
