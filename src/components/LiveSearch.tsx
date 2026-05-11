"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (slug: string) => {
    router.push(`/product/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative flex-1 max-w-md" ref={searchRef}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search for designs..."
          className="w-full bg-bg/50 border border-primary/10 rounded-2xl py-2.5 pl-11 pr-10 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner group-hover:border-primary/30"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors" size={18} />
        {loading ? (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin" size={18} />
        ) : query && (
          <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-primary">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-primary/5 overflow-hidden z-[60] animate-fade-in-up origin-top">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="w-full p-4 flex gap-4 hover:bg-bg transition-colors text-left group/item border-b border-primary/5 last:border-0"
              >
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-primary-light flex-shrink-0 relative">
                  {product.images?.[0] && (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-accent truncate uppercase tracking-tight">{product.name}</h4>
                  <p className="text-xs text-text-light mt-1 line-clamp-1">{product.categoryName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-black text-primary">
                      {formatPrice(parseFloat(product.salePrice || product.price))}
                    </span>
                    {product.salePrice && (
                      <span className="text-[10px] text-text-light line-through">
                        {formatPrice(parseFloat(product.price))}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 bg-bg border-t border-primary/5 text-center">
            <button 
              onClick={() => { router.push(`/shop?q=${query}`); setIsOpen(false); }}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-primary/5 p-8 text-center z-[60] animate-fade-in-up origin-top">
          <p className="text-sm text-text-light font-medium">No results found for "{query}"</p>
          <p className="text-xs text-primary mt-2 font-bold uppercase tracking-widest cursor-pointer hover:underline" onClick={() => setIsOpen(false)}>Try another keyword</p>
        </div>
      )}
    </div>
  );
}
