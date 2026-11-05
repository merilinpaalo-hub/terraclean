import { BrowseCategoriesButton } from "@/components/result-card";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
      <h1 className="text-xl font-bold">Lehte ei leitud</h1>
      <p className="mb-4 mt-2 text-base text-slate-700">Seda lehte ei ole olemas.</p>
      <BrowseCategoriesButton />
    </div>
  );
}
