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
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-primary focus:bg-white/10 transition-all shadow-2xl group-hover:border-white/20 text-white placeholder:text-white/30 font-medium"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
        {loading ? (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin" size={18} />
        ) : query && (
          <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-bg-card/95 backdrop-blur-2xl rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden z-[60] animate-fade-in-up origin-top">
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="w-full p-5 flex gap-5 hover:bg-white/5 transition-all text-left group/item border-b border-white/5 last:border-0"
              >
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 relative border border-white/5">
                  {product.images?.[0] && (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover/item:scale-125 transition-transform duration-1000" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black text-white truncate uppercase tracking-widest group-hover/item:text-primary transition-colors">{product.name}</h4>
                  <p className="text-[9px] text-text-light font-bold uppercase tracking-widest mt-1 opacity-60">{product.categoryName}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm font-black text-primary">
                      {formatPrice(parseFloat(product.salePrice || product.price))}
                    </span>
                    {product.salePrice && (
                      <span className="text-[10px] text-text-light/40 line-through">
                        {formatPrice(parseFloat(product.price))}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 bg-black/40 border-t border-white/5 text-center">
            <button 
              onClick={() => { router.push(`/shop?q=${query}`); setIsOpen(false); }}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-all"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-bg-card/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10 text-center z-[60] animate-fade-in-up origin-top">
          <p className="text-sm text-text-light font-bold uppercase tracking-widest opacity-60">No results for "{query}"</p>
          <p className="text-[10px] text-primary mt-4 font-black uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-all" onClick={() => setIsOpen(false)}>Try another keyword</p>
        </div>
      )}

    </div>
  );
}
