import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { desc, eq, ilike } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  let allProducts: typeof products.$inferSelect[] = [];
  let allCategories: typeof categories.$inferSelect[] = [];

  try {
    allCategories = await db.select().from(categories);

    if (params.category) {
      const cat = allCategories.find((c) => c.slug === params.category);
      if (cat) {
        allProducts = await db.select().from(products).where(eq(products.categoryId, cat.id)).orderBy(desc(products.createdAt));
      }
    } else if (params.search) {
      allProducts = await db.select().from(products).where(ilike(products.name, `%${params.search}%`)).orderBy(desc(products.createdAt));
    } else {
      allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    }

    if (params.sort === "price-low") {
      allProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (params.sort === "price-high") {
      allProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
  } catch {
    // DB not ready
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <h2 className="font-heading text-xl font-bold mb-4">Categories</h2>
          <div className="space-y-2">
            <Link href="/shop" className={`block text-sm py-1 px-3 rounded-lg transition-colors ${!params.category ? "bg-primary text-white" : "hover:bg-primary-light"}`}>
              All Products
            </Link>
            {allCategories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                className={`block text-sm py-1 px-3 rounded-lg transition-colors ${params.category === cat.slug ? "bg-primary text-white" : "hover:bg-primary-light"}`}>
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form action="/shop" className="mt-6">
            <input type="text" name="search" placeholder="Search products..."
              defaultValue={params.search || ""}
              className="w-full px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary" />
          </form>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-text-light">{allProducts.length} products found</p>
            <div className="flex gap-2">
              <Link href={`/shop?${params.category ? `category=${params.category}&` : ""}sort=price-low`}
                className={`text-xs px-3 py-1 rounded-full border ${params.sort === "price-low" ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}>
                Price: Low → High
              </Link>
              <Link href={`/shop?${params.category ? `category=${params.category}&` : ""}sort=price-high`}
                className={`text-xs px-3 py-1 rounded-full border ${params.sort === "price-high" ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}>
                Price: High → Low
              </Link>
            </div>
          </div>

          {allProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allProducts.map((p) => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
                  price={p.price} salePrice={p.salePrice} images={p.images || []}
                  isNew={p.isNew ?? false} isSale={p.isSale ?? false} pieces={p.pieces} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <p className="text-text-light">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
