# TerraClean

Searchable household waste sorting guide for Estonian residents (UI in Estonian).

- Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui-style components, Lucide icons
- PostgreSQL on Railway via Prisma; fuzzy search with `pg_trgm` and `unaccent`
- Data: `data/*.csv`, loaded by an idempotent seed (`prisma/seed.ts`) on every start
- Config: `DATABASE_URL` (set in Railway, see `.env.example`); the server listens on `PORT`
