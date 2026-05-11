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
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-primary-light">
            {images[selectedImage] ? (
              <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-light">No Image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === selectedImage ? "border-primary" : "border-transparent"}`}>
                  <Image src={img} alt="" width={64} height={80} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex gap-2 mb-2">
              {product.isNew && <span className="badge-new">NEW</span>}
              {product.isSale && <span className="badge-sale">SALE</span>}
            </div>
            <h1 className="font-heading text-lg md:text-xl font-bold">{product.name}</h1>
            {product.pieces && <p className="text-[10px] text-text-light mt-0.5">{product.pieces}</p>}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-lg font-bold text-primary">{formatPrice(price)}</span>
            {product.isSale && product.salePrice && (
              <span className="text-base text-text-light line-through">{formatPrice(parseFloat(product.price))}</span>
            )}
            <div className="ml-auto">
              {product.stockQuantity > 0 ? (
                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-green-100">
                  In Stock ({product.stockQuantity})
                </span>
              ) : (
                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-red-100">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {product.description && <p className="text-sm text-text-light leading-relaxed">{product.description}</p>}
          {product.fabric && <p className="text-sm"><strong>Fabric:</strong> {product.fabric}</p>}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-accent uppercase tracking-wider">Select Size</p>
                {!selectedSize && <span className="text-[10px] font-black text-primary animate-pulse">REQUIRED *</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`min-w-[40px] h-10 px-3 rounded-xl border-2 text-[11px] font-bold transition-all duration-300 ${
                      selectedSize === s 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                        : "bg-white border-border text-text-light hover:border-primary hover:text-primary"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-accent uppercase tracking-wider">
                  Color: <span className="text-primary">{selectedColor || "Select One"}</span>
                </p>
                {!selectedColor && <span className="text-[10px] font-black text-primary animate-pulse">REQUIRED *</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`h-10 px-4 rounded-xl border-2 text-[11px] font-bold transition-all duration-300 ${
                      selectedColor === c 
                        ? "bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105" 
                        : "bg-white border-border text-text-light hover:border-accent hover:text-accent"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus size={16} /></button>
                <span className="px-4 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3"><Plus size={16} /></button>
              </div>
              <button onClick={toggleWishlist} className={`p-3 border rounded-xl transition-colors ml-auto ${inWishlist ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary'}`}>
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="flex gap-3 mt-2">
              <button onClick={addToCart} className="flex-1 py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
                <ShoppingBag size={16} /> Add to Bag
              </button>
              <button onClick={buyNow} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-primary/30 flex items-center justify-center text-[10px] uppercase tracking-widest">
                Buy It Now
              </button>
            </div>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            {[
              { icon: Truck, text: "Free Delivery" },
              { icon: RotateCcw, text: "Easy Returns" },
              { icon: Shield, text: "Quality Assured" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-text-light">
                <t.icon size={16} className="text-primary" /> {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
