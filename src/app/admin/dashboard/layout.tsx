"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, FolderOpen, LogOut, Home } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/dashboard/products", label: "Products", icon: Package },
  { href: "/admin/dashboard/categories", label: "Categories", icon: FolderOpen },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex bg-bg text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-bg-card border-r border-white/5 flex-shrink-0 hidden md:flex flex-col shadow-2xl">
        <div className="p-10 flex flex-col items-center text-center">
          <Link href="/" className="group mb-8">
            <div className="relative w-20 h-20 bg-white/5 rounded-[2rem] p-3 border border-white/10 group-hover:border-primary transition-all duration-700 shadow-inner group-hover:scale-110">
              <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain p-2" />
            </div>
          </Link>
          <h2 className="font-heading text-2xl font-black tracking-tight">Apna Pehnoo</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-2">Management Portal</p>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                pathname === item.href ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-text-light hover:bg-white/5 hover:text-white"
              }`}>
              <item.icon size={18} strokeWidth={2.5} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-2">
          <Link href="/" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-text-light hover:bg-white/5 hover:text-white transition-all">
            <Home size={18} strokeWidth={2.5} /> View Store
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-text-light hover:bg-red-500/10 hover:text-red-500 transition-all w-full text-left">
            <LogOut size={18} strokeWidth={2.5} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-bg-card/95 backdrop-blur-md border-b border-white/5 p-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white/5 rounded-xl p-1.5 border border-white/10">
            <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain p-1" />
          </div>
          <h2 className="font-heading text-lg font-black uppercase tracking-tighter">Portal</h2>
        </div>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`p-3 rounded-xl transition-all ${pathname === item.href ? "bg-primary text-black" : "bg-white/5 text-text-light"}`}>
              <item.icon size={16} strokeWidth={2.5} />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 md:pt-12 pt-24 overflow-auto custom-scrollbar">
        {children}
      </main>
    </div>

  );
}
