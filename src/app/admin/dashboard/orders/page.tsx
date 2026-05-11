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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold">Orders Management</h1>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={18} />
          <input 
            type="text" 
            placeholder="Search name, phone, or order #" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-bg border-b border-border text-accent font-semibold">
                <th className="p-4 w-12">S#</th>
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-text-light">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-text-light">No orders found</td></tr>
              ) : (
                filteredOrders.map((o, idx) => (
                  <tr key={o.id} className="hover:bg-bg/50 transition-colors">
                    <td className="p-4 font-bold text-text-light">{idx + 1}</td>
                    <td className="p-4">
                      <p className="font-mono text-xs font-bold text-accent mb-1">{o.orderNumber}</p>
                      <p className="text-xs text-text-light">{new Date(o.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-accent">{o.customerName}</p>
                      <p className="text-xs text-text-light">{o.customerPhone}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-primary">{formatPrice(parseFloat(o.totalAmount))}</p>
                      <p className="text-[10px] text-text-light uppercase">{o.paymentMethod}</p>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value, o.trackingId)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-bold outline-none cursor-pointer ${
                          o.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          o.status === "confirmed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          o.status === "shipped" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          o.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {o.trackingId && (
                        <p className="text-[10px] text-primary mt-1 font-mono">ID: {o.trackingId}</p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 hover:bg-primary-light rounded-lg text-primary transition-colors inline-flex items-center gap-1 text-xs font-medium"
                      >
                        <Eye size={16} /> View Details
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold font-heading text-accent">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-text-light">{new Date(selectedOrder.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-bg rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Customer Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-text-light">Name:</span> <span className="font-medium">{selectedOrder.customerName}</span></p>
                    <p><span className="text-text-light">Phone:</span> <span className="font-medium">{selectedOrder.customerPhone}</span></p>
                    {selectedOrder.customerEmail && (
                      <p><span className="text-text-light">Email:</span> <span className="font-medium">{selectedOrder.customerEmail}</span></p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Shipping Address</h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium leading-relaxed">{selectedOrder.shippingAddress}</p>
                    <p><span className="text-text-light">City:</span> <span className="font-medium">{selectedOrder.city}</span></p>
                    {selectedOrder.postalCode && (
                      <p><span className="text-text-light">Postal Code:</span> <span className="font-medium">{selectedOrder.postalCode}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Ordered Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-bg/50 border border-border/50">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-accent">{item.name}</h4>
                        <div className="flex gap-2 mt-1.5">
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Size: {item.size}</span>
                          <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Color: {item.color}</span>
                        </div>
                        <p className="text-xs mt-2 font-medium text-text-light">{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-accent text-white rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-bold font-heading">{formatPrice(parseFloat(selectedOrder.totalAmount))}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Payment</p>
                  <p className="font-bold uppercase tracking-widest">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Customer Notes:</p>
                  <p className="text-sm text-yellow-900 italic">{selectedOrder.notes}</p>
                </div>
              )}

              {selectedOrder.trackingId && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-800">
                    <Truck size={18} />
                    <span className="text-xs font-bold uppercase">Tracking ID</span>
                  </div>
                  <span className="font-mono font-bold text-purple-900">{selectedOrder.trackingId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
