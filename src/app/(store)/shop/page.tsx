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
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-12">
            <div>
              <h2 className="font-heading text-2xl font-black mb-8 text-white tracking-tight">Categories</h2>
              <div className="space-y-4">
                <Link href="/shop" className={`flex items-center justify-between text-[11px] font-black uppercase tracking-widest py-3 px-5 rounded-2xl transition-all border ${!params.category ? "bg-primary text-black border-primary" : "text-text-light border-white/5 hover:border-primary/30"}`}>
                  All Collections
                  {!params.category && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                </Link>
                {allCategories.map((cat) => (
                  <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                    className={`flex items-center justify-between text-[11px] font-black uppercase tracking-widest py-3 px-5 rounded-2xl transition-all border ${params.category === cat.slug ? "bg-primary text-black border-primary" : "text-text-light border-white/5 hover:border-primary/30"}`}>
                    {cat.name}
                    {params.category === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <h2 className="font-heading text-2xl font-black mb-8 text-white tracking-tight">Search</h2>
              <form action="/shop" className="relative group">
                <input type="text" name="search" placeholder="Type to search..."
                  defaultValue={params.search || ""}
                  className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/20" />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <p className="text-[10px] font-black text-text-light uppercase tracking-[0.3em]">{allProducts.length} Premium Designs Found</p>
            <div className="flex gap-4">
              <Link href={`/shop?${params.category ? `category=${params.category}&` : ""}sort=price-low`}
                className={`text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border transition-all ${params.sort === "price-low" ? "bg-white text-black border-white" : "text-white border-white/10 hover:border-primary"}`}>
                Price: Low → High
              </Link>
              <Link href={`/shop?${params.category ? `category=${params.category}&` : ""}sort=price-high`}
                className={`text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border transition-all ${params.sort === "price-high" ? "bg-white text-black border-white" : "text-white border-white/10 hover:border-primary"}`}>
                Price: High → Low
              </Link>
            </div>
          </div>

          {allProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {allProducts.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard id={p.id} name={p.name} slug={p.slug}
                    price={p.price} salePrice={p.salePrice} images={p.images || []}
                    isNew={p.isNew ?? false} isSale={p.isSale ?? false} pieces={p.pieces} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col items-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <p className="text-[10px] font-black text-text-light uppercase tracking-[0.3em]">No masterpieces match your criteria</p>
              <Link href="/shop" className="mt-8 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-all underline decoration-primary/30">Clear all filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
