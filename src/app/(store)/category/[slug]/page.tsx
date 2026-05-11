import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let category;
  let categoryProducts: typeof products.$inferSelect[] = [];
  try {
    const cats = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    category = cats[0];
    if (category) {
      categoryProducts = await db.select().from(products).where(eq(products.categoryId, category.id)).orderBy(desc(products.createdAt));
    }
  } catch { notFound(); }
  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && <p className="text-text-light mb-8">{category.description}</p>}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
              price={p.price} salePrice={p.salePrice} images={p.images || []}
              isNew={p.isNew ?? false} isSale={p.isSale ?? false} pieces={p.pieces} />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-light py-12">No products in this category yet.</p>
      )}
    </div>
  );
}
