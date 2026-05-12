"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CheckoutPage() {
  const { state, totalPrice, dispatch } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "", customerPhone: "",
    shippingAddress: "", city: "", postalCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.items.length === 0) return toast.error("Cart is empty!");
    
    // Basic validation
    if (!form.customerName.trim() || !form.customerPhone.trim() || !form.shippingAddress.trim() || !form.city.trim()) {
      return toast.error("Please fill in all the required shipping details.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: state.items, totalAmount: totalPrice, notes: "" }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: "CLEAR_CART" });
        toast.success("Order placed successfully! We will contact you soon.");
        router.push(`/order-success?order=${data.orderNumber}`);
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-primary-light/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-primary" size={40} />
        </div>
        <h1 className="font-heading text-3xl font-bold mb-4">Your bag is empty</h1>
        <p className="text-text-light mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added any beautiful pieces to your bag yet.</p>
        <button onClick={() => router.push("/shop")} className="btn-primary px-10">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 text-center md:text-left">
          <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Secure Checkout</h1>
          <p className="text-text-light font-medium uppercase tracking-widest text-xs opacity-60">Complete your premium order</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-bg-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5">
              <h2 className="font-heading text-2xl font-black mb-10 flex items-center gap-4 text-white">
                <span className="w-10 h-10 bg-primary text-black rounded-2xl flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20">1</span>
                Shipping Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-3 block">Full Name <span className="text-primary">*</span></label>
                  <input type="text" value={form.customerName} required
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium" 
                    placeholder="E.g. Zoya Khan" />
                </div>

                <div className="md:col-span-1">
                  <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-3 block">Phone Number <span className="text-primary">*</span></label>
                  <input type="tel" value={form.customerPhone} required
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium" 
                    placeholder="03xx xxxxxxx" />
                </div>

                <div className="md:col-span-1">
                  <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-3 block">City <span className="text-primary">*</span></label>
                  <input type="text" value={form.city} required
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium" 
                    placeholder="Lahore, Karachi..." />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-3 block">Delivery Address <span className="text-primary">*</span></label>
                  <textarea value={form.shippingAddress} required
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all resize-none text-white font-medium" 
                    rows={3} placeholder="Full address with house number and street" />
                </div>
              </div>
            </div>

            <div className="bg-bg-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5">
              <h2 className="font-heading text-2xl font-black mb-10 flex items-center gap-4 text-white">
                <span className="w-10 h-10 bg-primary text-black rounded-2xl flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20">2</span>
                Payment Method
              </h2>
              <div className="p-8 rounded-[2rem] bg-primary/5 border-2 border-primary/30 flex items-center gap-6 group hover:border-primary transition-all">
                <div className="w-16 h-16 bg-primary text-black rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-xl font-black">Rs.</span>
                </div>
                <div>
                  <p className="font-black text-white uppercase tracking-widest text-sm mb-1">Cash on Delivery (COD)</p>
                  <p className="text-xs text-text-light font-medium">Safe & Secure: Pay when you receive your parcel.</p>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8 rounded-full border-4 border-primary flex items-center justify-center p-1.5">
                    <div className="w-full h-full rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-5">
            <div className="bg-black/40 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/5 sticky top-24 shadow-2xl">
              <h2 className="font-heading text-3xl font-black text-white mb-10 tracking-tight">Summary</h2>
              
              <div className="space-y-6 max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar mb-10">
                {state.items.map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 relative border border-white/10 group-hover:border-primary/50 transition-colors">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-125 transition-transform duration-1000" sizes="80px" />}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[11px] font-black text-white uppercase tracking-widest truncate mb-2">{item.name}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[8px] bg-white/5 text-text-light px-2 py-1 rounded font-black uppercase tracking-widest">{item.size}</span>
                        <span className="text-[8px] text-primary font-black uppercase ml-auto">Qty: {item.quantity}</span>
                      </div>
                      <p className="text-sm font-black text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-5 pt-8 border-t border-white/10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-light">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-light">
                  <span>Shipping Fee</span>
                  <span className="text-primary">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-8 border-t border-white/10">
                  <span className="font-heading text-3xl font-black text-white">Total</span>
                  <span className="text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-10 h-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  "Place Order Now"
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Secure Transaction Guaranteed</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
}

import { ShoppingBag } from "lucide-react";
