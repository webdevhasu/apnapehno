import { db } from "@/lib/db";
import Image from "next/image";
import { orders, products, categories } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Package, FolderOpen, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  let stats = { orders: 0, products: 0, categories: 0, revenue: 0 };
  let recentOrders: typeof orders.$inferSelect[] = [];

  try {
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);
    recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

    stats = {
      orders: allOrders.length,
      products: allProducts.length,
      categories: allCategories.length,
      revenue: allOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0),
    };
  } catch {}

  const statCards = [
    { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
    { label: "Products", value: stats.products, icon: Package, color: "bg-green-50 text-green-600" },
    { label: "Categories", value: stats.categories, icon: FolderOpen, color: "bg-purple-50 text-purple-600" },
    { label: "Revenue", value: formatPrice(stats.revenue), icon: TrendingUp, color: "bg-primary-light text-primary" },
  ];

  return (
    <div>
      <div className="bg-white rounded-3xl p-8 mb-8 border border-border flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="relative w-32 h-32 flex-shrink-0 bg-bg rounded-2xl p-4">
          <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="font-heading text-4xl font-black text-accent mb-2 tracking-tighter">Assalam-o-Alaikum, Admin!</h1>
          <p className="text-text-light max-w-md">Welcome back to the Apna Pehnoo Management Portal. Here&apos;s a quick overview of your store&apos;s performance today.</p>
        </div>
      </div>

      <h2 className="font-heading text-xl font-bold mb-6 text-accent">Real-time Statistics</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-border">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-text-light">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-heading text-xl font-bold mb-4">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold">Order #</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50">
                    <td className="py-3 font-mono text-xs">{o.orderNumber}</td>
                    <td className="py-3">{o.customerName}</td>
                    <td className="py-3 font-bold text-primary">{formatPrice(parseFloat(o.totalAmount))}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        o.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        o.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                        o.status === "shipped" ? "bg-purple-100 text-purple-700" :
                        o.status === "delivered" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>{o.status}</span>
                    </td>
                    <td className="py-3 text-text-light">{new Date(o.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-light text-center py-8">No orders yet</p>
        )}
      </div>
    </div>
  );
}
