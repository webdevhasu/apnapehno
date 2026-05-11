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
      <div className="bg-primary text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Phone size={12} />
            <span>0300 1234567 | Free Delivery on orders Rs. 3000+</span>
          </div>
          <div className="hidden md:flex gap-4">
            <a href="https://facebook.com" target="_blank" className="hover:text-primary-light transition-colors">Facebook</a>
            <a href="https://instagram.com" target="_blank" className="hover:text-primary-light transition-colors">Instagram</a>
            <a href="https://wa.me/923001234567" target="_blank" className="hover:text-primary-light transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-primary/10 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-md group-hover:shadow-primary/20 transition-all duration-500 group-hover:-rotate-3">
              <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain p-1" priority />
            </div>
            <div className="hidden md:block">
              <h1 className="font-heading text-lg font-black text-accent leading-none tracking-tighter">APNA PEHNOO</h1>
              <p className="text-[8px] text-primary font-bold tracking-[0.3em] uppercase opacity-70">Premium Couture</p>
            </div>
          </Link>

          {/* Desktop Nav & Search Container */}
          <div className="hidden lg:flex flex-1 items-center justify-between px-8 gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.slice(0, 4).map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-xs font-bold uppercase tracking-widest text-accent/70 hover:text-primary transition-all relative group py-2">
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
              ))}
            </nav>
            
            <LiveSearch />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link href="/wishlist" className="p-2.5 hover:bg-primary/10 rounded-2xl transition-all hidden sm:flex relative group">
              <Heart size={20} className="text-accent group-hover:text-primary transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-bounce">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <button onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="p-2.5 bg-accent text-white rounded-2xl transition-all relative group hover:bg-primary shadow-lg shadow-accent/20 flex items-center gap-2 px-4">
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden md:inline">Bag</span>
              {totalItems > 0 && (
                <span className="bg-white text-accent text-[10px] w-5 h-5 rounded-lg flex items-center justify-center font-black">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-accent">
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-primary/5 animate-fade-in-up shadow-2xl">
            <div className="p-4 border-b border-primary/5">
              <LiveSearch />
            </div>
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold uppercase tracking-widest py-4 px-6 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between group">
                  {link.label}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
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
