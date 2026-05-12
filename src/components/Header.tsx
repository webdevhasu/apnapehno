"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Menu, X, Search, Heart, Phone } from "lucide-react";
import { useCart } from "@/lib/cart";
import CartSidebar from "./CartSidebar";
import LiveSearch from "./LiveSearch";

import { useWishlist } from "@/lib/wishlist";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, dispatch } = useCart();
  const { items: wishlistItems } = useWishlist();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] py-2.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Phone size={12} strokeWidth={3} />
            <span>0300 1234567 • Free Delivery on orders Rs. 3000+</span>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="https://facebook.com" target="_blank" className="hover:opacity-70 transition-opacity">Facebook</a>
            <a href="https://instagram.com" target="_blank" className="hover:opacity-70 transition-opacity">Instagram</a>
            <a href="https://wa.me/923001234567" target="_blank" className="hover:opacity-70 transition-opacity">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-black/60 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/5 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-12 h-12 overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-primary/40 transition-all duration-700 group-hover:-rotate-6 bg-white/5 p-1 border border-white/10">
              <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain p-1.5 filter brightness-110" priority />
            </div>
            <div className="hidden md:block">
              <h1 className="font-heading text-xl font-black text-white leading-none tracking-tight drop-shadow-lg">APNA PEHNOO</h1>
              <p className="text-[9px] text-primary font-black tracking-[0.4em] uppercase mt-1">Premium Couture</p>
            </div>
          </Link>

          {/* Desktop Nav & Search Container */}
          <div className="hidden lg:flex flex-1 items-center justify-between px-10 gap-10">
            <nav className="flex items-center gap-10">
              {navLinks.slice(0, 4).map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-text/60 hover:text-primary transition-all relative group py-2">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
            </nav>
            
            <div className="flex-1 max-w-md">
              <LiveSearch />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
            <Link href="/wishlist" className="p-3 hover:bg-white/5 rounded-2xl transition-all hidden sm:flex relative group border border-transparent hover:border-white/10">
              <Heart size={20} className="text-text/70 group-hover:text-primary transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg shadow-primary/40 animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <button onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="h-12 bg-white text-black rounded-2xl transition-all relative group hover:bg-primary shadow-2xl flex items-center gap-3 px-6 overflow-hidden">
              <ShoppingBag size={18} className="group-hover:scale-125 transition-transform duration-500" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Bag</span>
              {totalItems > 0 && (
                <span className="bg-black text-white text-[10px] w-5 h-5 rounded-lg flex items-center justify-center font-black">
                  {totalItems}
                </span>
              )}
              <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white">
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-3xl border-t border-white/5 animate-fade-in-up shadow-2xl h-screen">
            <div className="p-6 border-b border-white/5">
              <LiveSearch />
            </div>
            <nav className="flex flex-col p-6 gap-3">
              {navLinks.map((link, idx) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  className="text-xs font-black uppercase tracking-[0.3em] py-5 px-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between group animate-fade-in-up">
                  {link.label}
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">→</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

      </header>

      <CartSidebar />
    </>
  );
}
