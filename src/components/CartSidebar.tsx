"use client";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function CartSidebar() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] group">
      <div className="absolute inset-0 bg-accent/40 backdrop-blur-sm transition-opacity duration-500" onClick={() => dispatch({ type: "TOGGLE_CART" })} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] animate-slide-in flex flex-col rounded-l-[3rem] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-primary/5">
          <div>
            <h2 className="font-heading text-3xl font-black text-accent tracking-tighter">Your Bag</h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{totalItems} Items Selected</p>
          </div>
          <button onClick={() => dispatch({ type: "TOGGLE_CART" })} className="w-12 h-12 flex items-center justify-center bg-bg rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {state.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-primary/30" />
              </div>
              <p className="text-text-light font-medium mb-8">Your shopping bag is empty</p>
              <button onClick={() => dispatch({ type: "TOGGLE_CART" })} className="btn-primary w-full">
                Start Shopping
              </button>
            </div>
          ) : (
            state.items.map((item, i) => (
              <div key={`${item.productId}-${item.size}-${item.color}-${i}`}
                className="flex gap-4 group/item">
                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-primary-light flex-shrink-0 relative shadow-sm group-hover/item:shadow-md transition-shadow">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-700" sizes="96px" />}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-accent truncate uppercase tracking-tight">{item.name}</h3>
                      <button onClick={() => dispatch({ type: "REMOVE_ITEM",
                        payload: { productId: item.productId, size: item.size, color: item.color }})}
                        className="text-text-light hover:text-red-500 transition-colors p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[9px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-widest">{item.size}</span>
                      <span className="text-[9px] bg-accent/5 text-accent px-2 py-0.5 rounded font-bold uppercase tracking-widest">{item.color}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-accent">{formatPrice(item.price)}</p>
                    <div className="flex items-center bg-bg rounded-xl p-1 border border-primary/5">
                      <button onClick={() => dispatch({ type: "UPDATE_QUANTITY",
                        payload: { productId: item.productId, size: item.size, color: item.color,
                          quantity: Math.max(1, item.quantity - 1) }})}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                      <button onClick={() => dispatch({ type: "UPDATE_QUANTITY",
                        payload: { productId: item.productId, size: item.size, color: item.color,
                          quantity: item.quantity + 1 }})}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                        <Plus size={12} />
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
          <div className="p-8 bg-bg/50 border-t border-primary/5 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Subtotal</p>
                <p className="text-xs text-text-light">Shipping & taxes calculated at checkout</p>
              </div>
              <span className="text-3xl font-black text-accent tracking-tighter">{formatPrice(totalPrice)}</span>
            </div>
            <Link href="/checkout" onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="btn-primary w-full flex items-center justify-center gap-4 py-5 shadow-2xl shadow-primary/20 group/btn">
              Proceed to Checkout
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
