"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function CartSidebar() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] group">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500" onClick={() => dispatch({ type: "TOGGLE_CART" })} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-bg-card shadow-[-20px_0_100px_rgba(0,0,0,0.8)] animate-slide-in flex flex-col md:rounded-l-[4rem] border-l border-white/5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-10 border-b border-white/5">
          <div>
            <h2 className="font-heading text-4xl font-black text-white tracking-tight">Your Bag</h2>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1">{totalItems} Items Selected</p>
          </div>
          <button onClick={() => dispatch({ type: "TOGGLE_CART" })} className="w-14 h-14 flex items-center justify-center bg-white/5 text-white rounded-2xl hover:bg-primary hover:text-black transition-all group">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {state.items.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10">
                <ShoppingBag size={48} className="text-primary/20" />
              </div>
              <p className="text-text-light font-bold uppercase tracking-widest text-xs mb-10 opacity-60">Your shopping bag is empty</p>
              <button onClick={() => dispatch({ type: "TOGGLE_CART" })} className="btn-primary w-full h-14">
                Start Shopping
              </button>
            </div>
          ) : (
            state.items.map((item, i) => (
              <div key={`${item.productId}-${item.size}-${item.color}-${i}`}
                className="flex gap-6 group/item animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-28 h-36 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 relative border border-white/10 group-hover/item:border-primary/50 transition-colors">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover group-hover/item:scale-125 transition-transform duration-[2000ms]" sizes="112px" />}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xs font-black text-white uppercase tracking-widest leading-tight group-hover/item:text-primary transition-colors">{item.name}</h3>
                      <button onClick={() => dispatch({ type: "REMOVE_ITEM",
                        payload: { productId: item.productId, size: item.size, color: item.color }})}
                        className="text-text-light/30 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="text-[9px] bg-white/5 text-text-light px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-white/5">{item.size}</span>
                      <span className="text-[9px] bg-primary/10 text-primary px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-primary/20">{item.color}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm font-black text-primary">{formatPrice(item.price)}</p>
                    <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
                      <button onClick={() => dispatch({ type: "UPDATE_QUANTITY",
                        payload: { productId: item.productId, size: item.size, color: item.color,
                          quantity: Math.max(1, item.quantity - 1) }})}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-xs font-black text-white">{item.quantity}</span>
                      <button onClick={() => dispatch({ type: "UPDATE_QUANTITY",
                        payload: { productId: item.productId, size: item.size, color: item.color,
                          quantity: item.quantity + 1 }})}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="p-10 bg-black/40 border-t border-white/5 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2">Subtotal</p>
                <p className="text-[10px] text-text-light/50 font-bold uppercase tracking-widest">Shipping & taxes calculated at checkout</p>
              </div>
              <span className="text-4xl font-black text-white tracking-tight drop-shadow-lg">{formatPrice(totalPrice)}</span>
            </div>
            <Link href="/checkout" onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="h-16 bg-white text-black rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all shadow-2xl group/btn">
              Proceed to Checkout
              <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
