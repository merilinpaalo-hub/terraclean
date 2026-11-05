import { DatabaseZap } from "lucide-react";

export function DbError() {
  return (
    <div role="alert" className="mx-auto max-w-xl rounded-lg border border-red-300 bg-red-50 p-6 text-center text-red-900">
      <DatabaseZap className="mx-auto h-8 w-8" aria-hidden />
      <h1 className="mt-3 text-xl font-bold">Andmeid ei õnnestunud laadida</h1>
      <p className="mt-2 text-base">
        Andmebaasiga ei õnnestunud ühendust luua. Palun proovi mõne hetke pärast uuesti.
      </p>
    </div>
  );
}
