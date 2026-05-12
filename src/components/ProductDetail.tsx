"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Heart, Truck, RotateCcw, Shield } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductDetailProps {
  product: {
    id: number; name: string; slug: string; description: string | null;
    price: string; salePrice: string | null; images: string[] | null;
    sizes: string[] | null; colors: string[] | null;
    fabric: string | null; pieces: string | null;
    isNew: boolean | null; isSale: boolean | null;
    stockQuantity: number;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const router = useRouter();

  const images = product.images || [];
  const price = product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
  
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem({ id: product.id, name: product.name, slug: product.slug, price: product.price, salePrice: product.salePrice, image: images[0] || "" });
    }
  };

  const validateSelection = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return false;
    }
    return true;
  };

  const addToCart = () => {
    if (!validateSelection()) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id, name: product.name, price,
        quantity, size: selectedSize || "N/A", color: selectedColor || "N/A",
        image: images[0] || "",
      },
    });
    toast.success("Added to bag!");
  };

  const buyNow = () => {
    if (!validateSelection()) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id, name: product.name, price,
        quantity, size: selectedSize || "N/A", color: selectedColor || "N/A",
        image: images[0] || "",
      },
    });
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-card border border-border">
            {images[selectedImage] ? (
              <Image src={images[selectedImage]} alt={product.name} fill className="object-cover animate-fade-in" sizes="(max-width:768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-light/30">No Image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${i === selectedImage ? "border-primary scale-105 shadow-lg shadow-primary/20" : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"}`}>
                  <Image src={img} alt="" width={80} height={96} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex gap-2 mb-4">
              {product.isNew && <span className="badge-new">NEW COLLECTION</span>}
              {product.isSale && <span className="badge-sale">LIMITED OFFER</span>}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-black text-text tracking-tight mb-2">{product.name}</h1>
            {product.pieces && <p className="text-xs text-primary font-bold uppercase tracking-[0.2em]">{product.pieces}</p>}
          </div>

          <div className="flex items-center gap-4 py-4 border-y border-border">
            <div className="flex flex-col">
              <span className="text-sm text-text-light uppercase tracking-widest mb-1">Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">{formatPrice(price)}</span>
                {product.isSale && product.salePrice && (
                  <span className="text-lg text-text-light/50 line-through font-medium">{formatPrice(parseFloat(product.price))}</span>
                )}
              </div>
            </div>
            <div className="ml-auto">
              {product.stockQuantity > 0 ? (
                <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-green-500/20">
                  ● In Stock
                </span>
              ) : (
                <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-red-500/20">
                  ● Out of Stock
                </span>
              )}
            </div>
          </div>

          {product.description && (
            <div className="prose prose-invert prose-sm">
              <p className="text-text-light leading-relaxed text-base">{product.description}</p>
            </div>
          )}
          
          {product.fabric && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-light">Fabric:</span>
              <span className="font-bold text-text">{product.fabric}</span>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-text-light uppercase tracking-[0.2em]">Select Size</p>
                {!selectedSize && <span className="text-[10px] font-black text-primary animate-pulse tracking-widest">REQUIRED *</span>}
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`min-w-[50px] h-12 px-4 rounded-xl border-2 text-xs font-black transition-all duration-500 ${
                      selectedSize === s 
                        ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-110" 
                        : "bg-bg-card border-border text-text-light hover:border-primary/50 hover:text-primary"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-text-light uppercase tracking-[0.2em]">
                  Color: <span className="text-primary">{selectedColor || "Choose"}</span>
                </p>
                {!selectedColor && <span className="text-[10px] font-black text-primary animate-pulse tracking-widest">REQUIRED *</span>}
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`h-12 px-6 rounded-xl border-2 text-xs font-black transition-all duration-500 ${
                      selectedColor === c 
                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-110" 
                        : "bg-bg-card border-border text-text-light hover:border-white/50 hover:text-white"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-bg-card border border-border rounded-2xl overflow-hidden h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-full flex items-center justify-center hover:bg-white/5 transition-colors"><Minus size={18} /></button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-14 h-full flex items-center justify-center hover:bg-white/5 transition-colors"><Plus size={18} /></button>
              </div>
              <button onClick={toggleWishlist} className={`h-14 w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${inWishlist ? 'border-primary bg-primary text-black' : 'border-border hover:border-primary text-text-light hover:text-primary'}`}>
                <Heart size={24} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={addToCart} className="h-14 rounded-2xl border-2 border-primary text-primary font-black hover:bg-primary hover:text-black transition-all duration-500 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] group">
                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" /> Add to Bag
              </button>
              <button onClick={buyNow} className="h-14 rounded-2xl bg-primary text-black font-black hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center justify-center text-xs uppercase tracking-[0.2em] group">
                Buy It Now
              </button>
            </div>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border">
            {[
              { icon: Truck, text: "Express Shipping", sub: "Worldwide delivery" },
              { icon: RotateCcw, text: "7 Days Returns", sub: "Hassle free policy" },
              { icon: Shield, text: "Secure Payment", sub: "100% encrypted" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-bg-card border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <t.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text">{t.text}</p>
                  <p className="text-[9px] text-text-light/60">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
