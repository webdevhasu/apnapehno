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
    <div className="min-h-screen flex bg-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-accent text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 mb-4 bg-white rounded-2xl p-2 shadow-inner">
            <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain" />
          </div>
          <h2 className="font-heading text-xl font-bold">Apna Pehnoo</h2>
          <p className="text-xs text-white/60">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                pathname === item.href ? "bg-primary text-white" : "text-white/70 hover:bg-white/10"
              }`}>
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:bg-white/10 transition-all">
            <Home size={18} /> View Store
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:bg-white/10 transition-all w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-accent text-white p-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white rounded-lg p-1">
            <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain" />
          </div>
          <h2 className="font-heading text-lg font-bold uppercase tracking-tighter">Admin Panel</h2>
        </div>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`p-2 rounded-lg ${pathname === item.href ? "bg-primary" : "bg-white/10"}`}>
              <item.icon size={16} />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 md:pt-8 pt-20 overflow-auto">
        {children}
      </main>
    </div>
  );
}
