import type { Metadata } from "next";
import { Info, MapPinned, PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Info – TerraClean" };

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Info</h1>

      <Card>
        <CardContent className="space-y-2">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Info className="h-5 w-5 text-green-800" aria-hidden />
            Andmete allikas
          </h2>
          <p className="text-base text-slate-800">
            Sorteerimisjuhised põhinevad Kliimaministeeriumi jäätmete liigiti kogumise juhendil.
            Andmete viimane uuendus: <strong>14.10.2025</strong>.
          </p>
          <a
            href="https://www.kliimaministeerium.ee/jaatmete-liigiti-kogumine"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center text-base underline"
          >
            Kliimaministeeriumi juhend
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MapPinned className="h-5 w-5 text-green-800" aria-hidden />
            Kohalikud reeglid
          </h2>
          <p className="text-base text-slate-800">
            Kohaliku omavalitsuse reeglid ja kogumissüsteem võivad erineda. Kui sul on kahtlus, vaata
            oma omavalitsuse või jäätmevedaja juhiseid.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <PenLine className="h-5 w-5 text-green-800" aria-hidden />
            Sünonüümid
          </h2>
          <p className="text-base text-slate-800">
            Otsingus kasutatavad sünonüümid on lisanud rakenduse autor ega ole osa ametlikust juhendist.
            Kategooriate värvid ja ikoonid on samuti meie enda valik, mitte ametlikud konteinerite värvid.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
