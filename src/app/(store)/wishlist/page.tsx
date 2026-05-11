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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold mb-4">Your Wishlist is empty</h1>
        <p className="text-text-light mb-6">Explore our collections and add items you love!</p>
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-border">
            <Link href={`/product/${item.slug}`} className="block relative aspect-[3/4] bg-primary-light">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 50vw, 33vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-light">No Image</div>
              )}
            </Link>
            <div className="p-4">
              <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1 mb-4">
                <span className="text-sm font-bold text-primary">{formatPrice(parseFloat(item.salePrice || item.price))}</span>
                {item.salePrice && (
                  <span className="text-xs text-text-light line-through">{formatPrice(parseFloat(item.price))}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/product/${item.slug}`} className="flex-1 btn-primary text-xs py-2 text-center flex justify-center items-center gap-2">
                  <ShoppingBag size={14} /> View
                </Link>
                <button onClick={() => removeItem(item.id)} className="p-2 border border-border rounded-xl hover:text-red-500 hover:border-red-200 transition-colors">
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
