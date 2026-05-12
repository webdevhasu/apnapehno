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
    <div className="animate-fade-in">
      <div className="bg-bg-card rounded-[2.5rem] p-10 mb-12 border border-white/5 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative w-40 h-40 flex-shrink-0 bg-white/5 rounded-3xl p-6 border border-white/10 shadow-inner">
          <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain p-4" />
        </div>
        <div className="text-center md:text-left relative z-10">
          <h1 className="font-heading text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">Assalam-o-Alaikum, Admin!</h1>
          <p className="text-text-light font-medium text-lg opacity-60">Welcome back to the <span className="text-primary font-black italic">Apna Pehnoo</span> Management Portal. Here&apos;s your store&apos;s performance overview.</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-white tracking-tight uppercase tracking-widest text-xs opacity-40">Real-time Statistics</h2>
        <div className="h-px flex-1 bg-white/5 mx-8"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {statCards.map((s, i) => (
          <div key={i} className="bg-bg-card rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all duration-500 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${s.color}`}>
              <s.icon size={24} strokeWidth={2.5} />
            </div>
            <p className="text-3xl font-black text-white mb-1 group-hover:text-primary transition-colors">{s.value}</p>
            <p className="text-[10px] font-black text-text-light uppercase tracking-widest opacity-40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-bg-card rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-2xl font-black text-white">Recent Masterpieces</h2>
          <Link href="/admin/dashboard/orders" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-all">View All Orders →</Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-text-light uppercase tracking-widest">
                  <th className="pb-6">Reference</th>
                  <th className="pb-6">Customer</th>
                  <th className="pb-6">Investment</th>
                  <th className="pb-6 text-center">Status</th>
                  <th className="pb-6 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-6 font-mono text-[11px] text-primary font-black uppercase tracking-tighter">{o.orderNumber}</td>
                    <td className="py-6">
                      <p className="font-black text-white uppercase text-[11px] tracking-widest">{o.customerName}</p>
                      <p className="text-[9px] text-text-light opacity-50 font-medium">{o.customerPhone}</p>
                    </td>
                    <td className="py-6 font-black text-white">{formatPrice(parseFloat(o.totalAmount))}</td>
                    <td className="py-6 text-center">
                      <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest border ${
                        o.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                        o.status === "confirmed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        o.status === "shipped" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                        o.status === "delivered" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}>{o.status}</span>
                    </td>
                    <td className="py-6 text-right text-[10px] font-black text-text-light opacity-40 uppercase tracking-widest">
                      {new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
             <p className="text-[10px] font-black text-text-light uppercase tracking-widest opacity-40">No orders awaiting your attention</p>
          </div>
        )}
      </div>
    </div>

  );
}
