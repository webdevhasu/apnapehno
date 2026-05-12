"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-fade-in">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
          <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div>
        <h1 className="font-heading text-4xl font-black mb-4 text-white tracking-tight">Your Wishlist is empty</h1>
        <p className="text-text-light font-medium uppercase tracking-widest text-xs mb-10 opacity-60">Explore our collections and add items you love!</p>
        <Link href="/shop" className="btn-primary h-14 px-10 flex items-center justify-center mx-auto w-fit">Explore Collections</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="mb-16">
        <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">My Wishlist</h1>
        <p className="text-text-light font-medium uppercase tracking-widest text-xs opacity-60">Saved pieces for your next look</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
        {items.map((item, i) => (
          <div key={item.id} className="group bg-bg-card rounded-3xl overflow-hidden border border-white/5 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <Link href={`/product/${item.slug}`} className="block relative aspect-[3/4] bg-white/5 overflow-hidden">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-125 transition-transform duration-[2000ms]" sizes="(max-width:640px) 50vw, 33vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-light font-black uppercase tracking-widest text-[10px]">No Image</div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">Quick View</span>
              </div>
            </Link>
            <div className="p-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white truncate group-hover:text-primary transition-colors leading-tight mb-2">{item.name}</h3>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-black text-primary">{formatPrice(parseFloat(item.salePrice || item.price))}</span>
                {item.salePrice && (
                  <span className="text-[10px] text-text-light/40 line-through font-bold">{formatPrice(parseFloat(item.price))}</span>
                )}
              </div>
              <div className="flex gap-3">
                <Link href={`/product/${item.slug}`} className="flex-1 bg-white text-black h-11 rounded-xl text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-primary transition-all">
                  <ShoppingBag size={14} /> Buy Now
                </Link>
                <button onClick={() => removeItem(item.id)} className="w-11 h-11 bg-white/5 border border-white/5 rounded-xl text-text-light/30 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
