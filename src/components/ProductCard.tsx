"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
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
      <div className="card-hover bg-white rounded-2xl overflow-hidden border border-border">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-primary-light">
          {images[0] ? (
            <Image src={images[0]} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-light">No Image</div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isNew && <span className="badge-new">NEW</span>}
            {isSale && <span className="badge-sale">SALE</span>}
          </div>

          {/* Wishlist */}
          <button onClick={toggleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-all z-20 ${inWishlist ? 'bg-primary text-white opacity-100' : 'bg-white/80 opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white'}`}>
            <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Info */}
        <div className="p-2 md:p-3">
          <h3 className="text-[11px] md:text-xs font-bold text-accent truncate group-hover:text-primary transition-colors mb-0.5">{name}</h3>
          {pieces && <p className="text-[9px] text-text-light mb-1">{pieces}</p>}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-primary">{formatPrice(displayPrice)}</span>
            {isSale && salePrice && (
              <span className="text-[10px] text-text-light line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
