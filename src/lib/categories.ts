import { prisma } from "./db";

export async function listCategories() {
  return prisma.category.findMany({ orderBy: [{ isNational: "desc" }, { name: "asc" }] });
}

/** Category plus items that fit and items that are listed there as "does not fit". */
export async function getCategoryDetail(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return null;

  const [fits, notFit] = await Promise.all([
    prisma.item.findMany({
      where: { categoryId: id, relation: "fits" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, condition: true },
    }),
    prisma.item.findMany({
      where: { sourcePageId: id, relation: "does_not_fit" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        condition: true,
        whereToTake: true,
        category: { select: { id: true, name: true } },
      },
    }),
  ]);

  return { category, fits, notFit };
}
