import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";

export default async function NewArrivalsPage() {
  let newProducts: typeof products.$inferSelect[] = [];
  try {
    newProducts = await db.select().from(products).where(eq(products.isNew, true)).orderBy(desc(products.createdAt));
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">New Arrivals</h1>
      {newProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newProducts.map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
              price={p.price} salePrice={p.salePrice} images={p.images || []}
              isNew={p.isNew ?? false} isSale={p.isSale ?? false} pieces={p.pieces} />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-light py-12">No new arrivals yet. Check back soon!</p>
      )}
    </div>
  );
}
