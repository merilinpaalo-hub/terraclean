import {
  Apple,
  Archive,
  BatteryCharging,
  CircleDot,
  Cpu,
  CupSoda,
  Droplets,
  FileText,
  GlassWater,
  Hammer,
  HardHat,
  Leaf,
  Lightbulb,
  MapPin,
  Mountain,
  Package,
  Pill,
  Recycle,
  Shirt,
  Sofa,
  Thermometer,
  Trash2,
  TreePine,
  TriangleAlert,
  Wine,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";


export type CategoryStyle = {
  icon: LucideIcon;
  /** Tinted chip: background + AA-contrast text. */
  chip: string;
  /** Border colour for cards. */
  border: string;
  /** Accent bar colour. */
  bar: string;
};

// Colours and icons are our own visual choice, not official container colours.
const STYLES: Record<string, CategoryStyle> = {
  "segaolmejaatmed": { icon: Trash2, chip: "bg-slate-100 text-slate-900", border: "border-slate-200", bar: "bg-slate-500" },
  "klaaspakend": { icon: Wine, chip: "bg-emerald-100 text-emerald-900", border: "border-emerald-200", bar: "bg-emerald-500" },
  "plast-ja-metallpakend": { icon: Package, chip: "bg-amber-100 text-amber-900", border: "border-amber-200", bar: "bg-amber-500" },
  "koogi-ja-sooklajaatmed": { icon: Apple, chip: "bg-lime-100 text-lime-900", border: "border-lime-200", bar: "bg-lime-500" },
  "aia-ja-haljastujaatmed": { icon: Leaf, chip: "bg-green-100 text-green-900", border: "border-green-200", bar: "bg-green-500" },
  "paberi-ja-kartongijaatmed": { icon: FileText, chip: "bg-blue-100 text-blue-900", border: "border-blue-200", bar: "bg-blue-500" },
  "suurjaatmed": { icon: Sofa, chip: "bg-orange-100 text-orange-900", border: "border-orange-200", bar: "bg-orange-500" },
  "patareid-ja-akud": { icon: BatteryCharging, chip: "bg-yellow-100 text-yellow-900", border: "border-yellow-200", bar: "bg-yellow-500" },
  "elektroonikajaatmed": { icon: Cpu, chip: "bg-violet-100 text-violet-900", border: "border-violet-200", bar: "bg-violet-500" },
  "lambipirnid": { icon: Lightbulb, chip: "bg-amber-100 text-amber-900", border: "border-amber-200", bar: "bg-amber-500" },
  "paevavalguslambid": { icon: Zap, chip: "bg-cyan-100 text-cyan-900", border: "border-cyan-200", bar: "bg-cyan-500" },
  "tekstiilijaatmed": { icon: Shirt, chip: "bg-pink-100 text-pink-900", border: "border-pink-200", bar: "bg-pink-500" },
  "korduskasutus-tekstiil": { icon: Recycle, chip: "bg-teal-100 text-teal-900", border: "border-teal-200", bar: "bg-teal-500" },
  "ohtlikud-jaatmed": { icon: TriangleAlert, chip: "bg-red-100 text-red-900", border: "border-red-200", bar: "bg-red-500" },
  "ravimid": { icon: Pill, chip: "bg-rose-100 text-rose-900", border: "border-rose-200", bar: "bg-rose-500" },
  "elavhobedat-sisaldavad-jaatmed": { icon: Thermometer, chip: "bg-fuchsia-100 text-fuchsia-900", border: "border-fuchsia-200", bar: "bg-fuchsia-500" },
  "plast": { icon: CupSoda, chip: "bg-sky-100 text-sky-900", border: "border-sky-200", bar: "bg-sky-500" },
  "klaas": { icon: GlassWater, chip: "bg-cyan-100 text-cyan-900", border: "border-cyan-200", bar: "bg-cyan-500" },
  "metall": { icon: Wrench, chip: "bg-zinc-100 text-zinc-900", border: "border-zinc-200", bar: "bg-zinc-500" },
  "toodeldud-puit": { icon: Hammer, chip: "bg-orange-100 text-orange-900", border: "border-orange-200", bar: "bg-orange-500" },
  "tootlemata-puit": { icon: TreePine, chip: "bg-green-100 text-green-900", border: "border-green-200", bar: "bg-green-500" },
  "pinnas-ja-kivid": { icon: Mountain, chip: "bg-stone-100 text-stone-900", border: "border-stone-200", bar: "bg-stone-500" },
  "ehitus-ja-lammutusjaatmed": { icon: HardHat, chip: "bg-yellow-100 text-yellow-900", border: "border-yellow-200", bar: "bg-yellow-500" },
  "vanarehvid": { icon: CircleDot, chip: "bg-neutral-100 text-neutral-900", border: "border-neutral-200", bar: "bg-neutral-500" },
  "muud-jaatmed": { icon: Archive, chip: "bg-indigo-100 text-indigo-900", border: "border-indigo-200", bar: "bg-indigo-500" },
  "kanalisatsioon": { icon: Droplets, chip: "bg-blue-100 text-blue-900", border: "border-blue-200", bar: "bg-blue-500" },
  "muu-kogumiskoht": { icon: MapPin, chip: "bg-purple-100 text-purple-900", border: "border-purple-200", bar: "bg-purple-500" },
};

const FALLBACK: CategoryStyle = {
  icon: Trash2,
  chip: "bg-slate-100 text-slate-900",
  border: "border-slate-200",
  bar: "bg-slate-500",
};

export function categoryStyle(id: string): CategoryStyle {
  return STYLES[id] ?? FALLBACK;
}
