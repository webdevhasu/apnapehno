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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-8 md:pt-12 bg-black">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row items-center gap-16 relative z-10">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left py-12 md:py-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <p className="text-primary font-black tracking-[0.3em] text-[10px] uppercase">New Collection 2026</p>
            </div>
            <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] mb-8 drop-shadow-2xl">
              Elegance <br /><span className="text-primary italic">Redefined.</span>
            </h2>
            <p className="text-text-light text-lg md:text-xl mb-12 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
              Experience the pinnacle of luxury with our curated collection of premium Pakistani couture. Meticulously crafted for the modern woman.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
              <Link href="/shop" className="btn-primary inline-flex items-center gap-4 px-10 py-5 text-sm shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:-translate-y-2 transition-all w-full sm:w-auto justify-center group">
                Shop Collection <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
              <Link href="/new-arrivals" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white hover:text-primary transition-all w-full sm:w-auto justify-center border-b-2 border-primary/20 hover:border-primary pb-1">
                View Arrivals
              </Link>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="flex-1 w-full relative aspect-[4/5] md:aspect-[3/4] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
             <Image src="/hero.png" alt="Apna Pehnoo Collection" fill className="object-cover object-top group-hover:scale-110 transition-transform duration-[2000ms]" priority sizes="(max-width: 768px) 100vw, 50vw" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-bg-card border-y border-white/5 relative z-20 -mt-10 mx-4 rounded-3xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Swift Delivery", desc: "Across Pakistan" },
            { icon: Shield, title: "Premium Fabric", desc: "100% Guaranteed" },
            { icon: RotateCcw, title: "Return Policy", desc: "7 Days Exchange" },
            { icon: Headphones, title: "VIP Support", desc: "Always Available" },
          ].map((f, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
                <f.icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-0.5">{f.title}</p>
                <p className="text-[9px] text-text-light font-bold">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {allCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 section-padding">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Curated Categories</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
            {allCategories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="group text-center">
                <div className="aspect-square mx-auto rounded-full bg-white/5 overflow-hidden border-2 border-white/5 group-hover:border-primary group-hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-700 relative">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-heading text-3xl bg-neutral-900">{cat.name[0]}</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Explore</span>
                  </div>
                </div>
                <p className="text-[10px] font-black mt-6 group-hover:text-primary transition-all tracking-[0.3em] uppercase text-text-light">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="bg-bg-card/50 py-20 md:py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl text-center md:text-left">
              <p className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-4">Latest Couture</p>
              <h2 className="font-heading text-4xl md:text-6xl font-black text-white leading-tight">Freshly Minted <br />Designs</h2>
            </div>
            <Link href="/new-arrivals" className="h-14 px-8 rounded-2xl border-2 border-primary text-primary font-black hover:bg-primary hover:text-black transition-all flex items-center justify-center text-xs uppercase tracking-widest">
              View All Arrivals
            </Link>
          </div>
          
          {newProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
              {newProducts.map((p) => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
                  price={p.price} salePrice={p.salePrice} images={p.images || []}
                  isNew={p.isNew ?? false} isSale={p.isSale ?? false} pieces={p.pieces} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-white/10 bg-black/20">
              <p className="text-text-light text-lg font-medium mb-8">Our artisans are crafting new masterpieces. <br />Returning very soon.</p>
              <Link href="/admin" className="btn-outline">Visit Dashboard →</Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-24">
              <p className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-4">Editor's Choice</p>
              <h2 className="font-heading text-4xl md:text-6xl font-black text-white mb-6">Masterpieces</h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
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
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-neutral-900 to-black rounded-[3rem] md:rounded-[5rem] p-12 md:p-32 text-center relative overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] opacity-5" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="font-heading text-5xl md:text-8xl font-black text-white mb-8 tracking-tight">Join The <br /><span className="text-primary italic">Exclusive.</span></h2>
            <p className="text-text-light text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed">Subscribe to receive early access to our limited drops, private sales, and fashion insights.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/shop" className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all hover:scale-105 shadow-2xl">
                Enter The Shop
              </Link>
              <Link href="/contact" className="px-12 py-5 rounded-2xl border-2 border-white/20 font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all text-white">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
