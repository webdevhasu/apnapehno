import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

export default async function HomePage() {
  let allCategories: typeof categories.$inferSelect[] = [];
  let newProducts: typeof products.$inferSelect[] = [];
  let featuredProducts: typeof products.$inferSelect[] = [];

  try {
    allCategories = await db.select().from(categories).limit(6);
    newProducts = await db.select().from(products).where(eq(products.isNew, true)).orderBy(desc(products.createdAt)).limit(10);
    featuredProducts = await db.select().from(products).where(eq(products.isFeatured, true)).orderBy(desc(products.createdAt)).limit(8);
  } catch {
    // DB may not be set up yet
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-light/30 to-bg overflow-hidden pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left py-12 md:py-20 animate-fade-in-up z-10">
            <p className="text-primary font-bold tracking-[0.2em] text-sm mb-4 uppercase">Apna Pehnoo Exclusive</p>
            <h2 className="font-heading text-5xl md:text-7xl lg:text-[5rem] font-bold text-accent leading-[1.1] mb-6">
              Discover Your<br />Signature Style
            </h2>
            <p className="text-text-light text-lg mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Elevate your wardrobe with our premium collection of meticulously crafted, elegant designs. Experience the perfect blend of tradition and modern fashion.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all w-full sm:w-auto justify-center">
                Explore Collection
              </Link>
              <Link href="/new-arrivals" className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-accent hover:text-primary transition-colors w-full sm:w-auto justify-center">
                View New Arrivals →
              </Link>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="flex-1 w-full relative min-h-[500px] md:min-h-[650px] rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden shadow-2xl border-4 border-white/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <Image src="/hero.png" alt="Apna Pehnoo Collection" fill className="object-cover object-top hover:scale-105 transition-transform duration-700" priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Cash on Delivery", desc: "All Over Pakistan" },
            { icon: Shield, title: "Premium Quality", desc: "Best Fabrics" },
            { icon: RotateCcw, title: "Easy Returns", desc: "7 Days Return Policy" },
            { icon: Headphones, title: "24/7 Support", desc: "We are Here to Help" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 justify-center">
              <f.icon size={28} className="text-primary" />
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-text-light">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {allCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-center mb-12 text-accent">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {allCategories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="group text-center">
                <div className="aspect-square mx-auto rounded-full bg-primary-light overflow-hidden border-4 border-white shadow-lg group-hover:border-primary group-hover:shadow-primary/20 transition-all duration-500">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-heading text-2xl bg-gradient-to-br from-primary-light to-white">{cat.name[0]}</div>
                  )}
                </div>
                <p className="text-sm font-bold mt-4 group-hover:text-primary transition-colors tracking-wide uppercase">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16 bg-white/50 rounded-[3rem] my-4 border border-primary/5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-accent mb-2">New Arrivals</h2>
            <p className="text-text-light text-sm">Discover our latest additions to your wardrobe</p>
          </div>
          <Link href="/new-arrivals" className="px-6 py-2 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm">View All Collection</Link>
        </div>
        {newProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {newProducts.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
                price={p.price} salePrice={p.salePrice} images={p.images || []}
                isNew={p.isNew ?? false} isSale={p.isSale ?? false} pieces={p.pieces} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
            <p className="text-text-light mb-6">Our new collection is arriving soon. Stay tuned!</p>
            <Link href="/admin" className="btn-outline">Visit Dashboard →</Link>
          </div>
        )}
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
              <div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-accent mb-2">Featured Highlights</h2>
                <p className="text-text-light text-sm">Handpicked pieces from our exclusive collection</p>
              </div>
              <Link href="/shop" className="text-sm text-primary font-bold hover:underline tracking-widest uppercase">Explore All Products →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
                  price={p.price} salePrice={p.salePrice} images={p.images || []}
                  isNew={p.isNew ?? false} isSale={p.isSale ?? false} pieces={p.pieces} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="bg-accent rounded-[3rem] p-10 md:p-24 text-center text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">Enjoy 10% Off Your First Order</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">Join our exclusive fashion community and stay updated with the latest trends, private sales, and special collections.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="bg-white text-accent px-10 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:-translate-y-1">
                Shop the Collection
              </Link>
              <Link href="/contact" className="border border-white/30 px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
