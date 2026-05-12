"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: string;
  salePrice?: string | null;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  pieces?: string | null;
}

export default function ProductCard({ id, name, slug, price, salePrice, images, isNew, isSale, pieces }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const displayPrice = salePrice ? parseFloat(salePrice) : parseFloat(price);
  const originalPrice = parseFloat(price);
  
  const inWishlist = isInWishlist(id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeItem(id);
    } else {
      addItem({ id, name, slug, price, salePrice, image: images[0] || "" });
    }
  };

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="card-hover bg-bg-card rounded-2xl overflow-hidden border border-border group-hover:border-primary/30 transition-all duration-500">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-primary-light/10">
          {images[0] ? (
            <Image src={images[0]} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-light/50">No Image</div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {isNew && <span className="badge-new">NEW</span>}
            {isSale && <span className="badge-sale">SALE</span>}
          </div>

          {/* Wishlist */}
          <button onClick={toggleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-all z-20 ${inWishlist ? 'bg-primary text-black scale-110 shadow-lg shadow-primary/20' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-black hover:scale-110'}`}>
            <Heart size={14} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Info */}
        <div className="p-3 md:p-4">
          <h3 className="text-[11px] md:text-xs font-black text-text uppercase tracking-widest truncate group-hover:text-primary transition-colors mb-1">{name}</h3>
          {pieces && <p className="text-[9px] text-text-light/70 font-medium mb-2">{pieces}</p>}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-primary">{formatPrice(displayPrice)}</span>
              {isSale && salePrice && (
                <span className="text-[10px] text-text-light/50 line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
            <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
              <Plus size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

