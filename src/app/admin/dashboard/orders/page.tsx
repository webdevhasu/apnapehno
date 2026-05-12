"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Search, Eye, Truck, X } from "lucide-react";
import Image from "next/image";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string | null;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  trackingId: string | null;
  notes: string | null;
  createdAt: string;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string, existingTrackingId: string | null = null) => {
    let trackingId = existingTrackingId;

    if (status === "shipped") {
      const input = prompt("Enter Tracking ID (Optional):", trackingId || "");
      if (input !== null) trackingId = input;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, trackingId }),
      });
      if (res.ok) {
        toast.success("Order updated");
        fetchOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Failed to update order");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerPhone.includes(searchTerm) ||
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Order Log</h1>
          <p className="text-text-light font-medium uppercase tracking-widest text-[10px] opacity-60">Monitor and manage your luxury deliveries</p>
        </div>
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} strokeWidth={3} />
          <input 
            type="text" 
            placeholder="Search Reference, Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 pl-12 pr-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white text-[11px] font-black uppercase tracking-widest placeholder:text-white/10 shadow-2xl"
          />
        </div>
      </div>

      <div className="bg-bg-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-text-light uppercase tracking-widest">
                <th className="p-8 w-12 opacity-30">#</th>
                <th className="p-8">Reference</th>
                <th className="p-8">Customer</th>
                <th className="p-8">Investment</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-text-light opacity-40">Analyzing ledger...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-text-light opacity-40">No entries found</td></tr>
              ) : (
                filteredOrders.map((o, idx) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                    <td className="p-8 font-black text-text-light opacity-30 text-[10px]">{idx + 1}</td>
                    <td className="p-8">
                      <p className="font-mono text-[11px] font-black text-primary uppercase tracking-tighter mb-1">{o.orderNumber}</p>
                      <p className="text-[10px] font-black text-text-light opacity-40 uppercase tracking-widest">{new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    </td>
                    <td className="p-8">
                      <p className="font-black text-white uppercase text-[11px] tracking-widest mb-1 group-hover:text-primary transition-colors">{o.customerName}</p>
                      <p className="text-[10px] text-text-light opacity-50 font-medium">{o.customerPhone}</p>
                    </td>
                    <td className="p-8">
                      <p className="font-black text-white text-base">{formatPrice(parseFloat(o.totalAmount))}</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest opacity-60">{o.paymentMethod}</p>
                    </td>
                    <td className="p-8 text-center">
                      <div className="relative inline-block">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value, o.trackingId)}
                          className={`text-[9px] px-5 py-2 rounded-xl border font-black uppercase tracking-widest outline-none cursor-pointer appearance-none transition-all ${
                            o.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                            o.status === "confirmed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            o.status === "shipped" ? "bg-purple-500/10 text-purple-500 border-purple-200" :
                            o.status === "delivered" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                            "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          <option value="pending" className="bg-bg-card">Pending</option>
                          <option value="confirmed" className="bg-bg-card">Confirmed</option>
                          <option value="shipped" className="bg-bg-card">Shipped</option>
                          <option value="delivered" className="bg-bg-card">Delivered</option>
                          <option value="cancelled" className="bg-bg-card">Cancelled</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                      {o.trackingId && (
                        <p className="text-[9px] text-primary mt-2 font-mono font-black uppercase opacity-60">ID: {o.trackingId}</p>
                      )}
                    </td>
                    <td className="p-8 text-right">
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="h-10 px-5 bg-white/5 border border-white/10 hover:border-primary hover:text-primary rounded-xl text-white transition-all inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Eye size={16} strokeWidth={2.5} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-bg-card rounded-[3rem] border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-fade-in-up custom-scrollbar">
            <div className="sticky top-0 bg-bg-card/95 backdrop-blur-md border-b border-white/5 p-10 flex justify-between items-center z-10">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Masterpiece Archive</p>
                <h2 className="text-4xl font-black font-heading text-white tracking-tight">Order {selectedOrder.orderNumber}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all border border-white/10">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-10 space-y-12">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 block">Customer Identification</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-text-light uppercase tracking-widest opacity-40 mb-1">Name</p>
                      <p className="font-black text-white text-lg uppercase tracking-widest">{selectedOrder.customerName}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[9px] font-black text-text-light uppercase tracking-widest opacity-40 mb-1">Communication</p>
                        <p className="font-bold text-white text-sm">{selectedOrder.customerPhone}</p>
                      </div>
                      {selectedOrder.customerEmail && (
                        <div>
                          <p className="text-[9px] font-black text-text-light uppercase tracking-widest opacity-40 mb-1">Digital Mail</p>
                          <p className="font-bold text-white text-sm truncate">{selectedOrder.customerEmail}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 block">Destination Gallery</h3>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[9px] font-black text-text-light uppercase tracking-widest opacity-40 mb-1">Address</p>
                        <p className="font-bold text-white text-sm leading-relaxed">{selectedOrder.shippingAddress}</p>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[9px] font-black text-text-light uppercase tracking-widest opacity-40 mb-1">City</p>
                          <p className="font-black text-white text-sm uppercase tracking-widest">{selectedOrder.city}</p>
                        </div>
                        {selectedOrder.postalCode && (
                          <div>
                            <p className="text-[9px] font-black text-text-light uppercase tracking-widest opacity-40 mb-1">Region Code</p>
                            <p className="font-bold text-white text-sm">{selectedOrder.postalCode}</p>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 block px-2">Manifested Designs</h3>
                <div className="grid grid-cols-1 gap-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-8 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="relative w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary transition-all">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-125 transition-transform duration-[2000ms]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">{item.name}</h4>
                        <div className="flex gap-3 mt-3">
                          <span className="text-[9px] bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">Size: {item.size}</span>
                          <span className="text-[9px] bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">Color: {item.color}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-[10px] font-black text-text-light uppercase tracking-widest opacity-40">{item.quantity} Unit(s)</p>
                        <p className="text-lg font-black text-white">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-primary rounded-[3rem] p-10 flex flex-col sm:flex-row justify-between items-center gap-8 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-2 opacity-60">Total Investment</p>
                  <p className="text-5xl font-black font-heading text-black tracking-tighter">{formatPrice(parseFloat(selectedOrder.totalAmount))}</p>
                </div>
                <div className="text-center sm:text-right px-10 py-4 bg-black/10 rounded-[2rem] border border-black/10">
                  <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-2 opacity-60">Settlement Method</p>
                  <p className="font-black text-black uppercase tracking-widest text-lg">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedOrder.notes && (
                  <div className="p-8 bg-yellow-500/10 rounded-[2.5rem] border border-yellow-500/20">
                    <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-4">Customer Notes</p>
                    <p className="text-sm text-yellow-500 font-medium italic leading-relaxed">&ldquo;{selectedOrder.notes}&rdquo;</p>
                  </div>
                )}

                {selectedOrder.trackingId && (
                  <div className="p-8 bg-purple-500/10 rounded-[2.5rem] border border-purple-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-purple-500">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                         <Truck size={24} />
                      </div>
                      <div>
                         <p className="text-[9px] font-black uppercase tracking-widest">Tracking Reference</p>
                         <p className="font-mono font-black text-white text-lg tracking-widest">{selectedOrder.trackingId}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
