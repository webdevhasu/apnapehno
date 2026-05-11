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
    <div className="bg-bg min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-heading text-4xl font-bold text-accent mb-2">Secure Checkout</h1>
          <p className="text-text-light">Enter your details to complete your order</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-accent mb-2 block">Full Name <span className="text-primary">*</span></label>
                  <input type="text" value={form.customerName} required
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="Enter your full name" />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-accent mb-2 block">Phone Number <span className="text-primary">*</span></label>
                  <input type="tel" value={form.customerPhone} required
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="03xx xxxxxxx" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-accent mb-2 block">City <span className="text-primary">*</span></label>
                  <input type="text" value={form.city} required
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="e.g. Lahore, Karachi, Islamabad" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-accent mb-2 block">Full Delivery Address <span className="text-primary">*</span></label>
                  <textarea value={form.shippingAddress} required
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
                    rows={3} placeholder="House #, Street, Area, Landmark" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              <div className="p-5 rounded-2xl bg-primary/5 border-2 border-primary flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">Rs.</span>
                </div>
                <div>
                  <p className="font-bold text-accent">Cash on Delivery (COD)</p>
                  <p className="text-xs text-text-light">Pay only when you receive your parcel at your doorstep.</p>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 rounded-full border-4 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-5">
            <div className="bg-accent text-white rounded-3xl p-6 md:p-8 shadow-xl sticky top-24">
              <h2 className="font-heading text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {state.items.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 relative border border-white/10">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-bold truncate mb-1">{item.name}</p>
                      <div className="flex gap-2 mb-1.5">
                        <span className="text-[9px] bg-white/10 text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">{item.size}</span>
                        <span className="text-[9px] bg-white/5 text-white/70 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{item.color}</span>
                        <span className="text-[9px] text-primary-light ml-auto">Qty: {item.quantity}</span>
                      </div>
                      <p className="text-sm font-bold text-primary-light">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm opacity-80">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-80">
                  <span>Shipping Fee</span>
                  <span className="text-primary-light font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4 border-t border-white/20">
                  <span className="font-heading">Total</span>
                  <span className="text-primary-light">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-8 bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  "Confirm Order"
                )}
              </button>
              
              <p className="text-center text-[10px] opacity-40 mt-4 uppercase tracking-widest font-bold">
                🔒 Secure & Encrypted Transaction
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

import { ShoppingBag } from "lucide-react";
