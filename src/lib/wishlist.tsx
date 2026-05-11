"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  salePrice?: string | null;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("apna-pehnoo-wishlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // Handle invalid JSON silently
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("apna-pehnoo-wishlist", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: WishlistItem) => {
    if (items.find((i) => i.id === item.id)) return;
    setItems((prev) => [...prev, item]);
    toast.success("Added to Wishlist!");
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from Wishlist");
  };

  const isInWishlist = (id: number) => items.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
