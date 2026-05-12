"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Image as ImageIcon, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const initialForm = {
    name: "", description: "", price: "", salePrice: "", categoryId: "",
    images: [] as string[], sizes: [] as string[], colors: [] as string[],
    fabric: "", pieces: "", inStock: true, stockQuantity: 0, isFeatured: false, isNew: true, isSale: false
  };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      categoryId: product.categoryId?.toString() || "",
      images: product.images || [],
      sizes: product.sizes || ["Free Size"],
      colors: product.colors || ["Default"],
      fabric: product.fabric || "",
      pieces: product.pieces || "",
      inStock: product.inStock ?? true,
      stockQuantity: product.stockQuantity || 0,
      isFeatured: product.isFeatured ?? false,
      isNew: product.isNew ?? true,
      isSale: product.isSale ?? false
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products/list"),
        fetch("/api/categories/list")
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...form.images];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) newImages.push(data.url);
      }
      setForm({ ...form, images: newImages });
      toast.success("Images uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) return toast.error("Please select a category");
    
    try {
      const payload: any = {
        ...form,
        categoryId: parseInt(form.categoryId),
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
      };

      if (editingId) payload.id = editingId;

      const res = await fetch("/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? "Product updated!" : "Product created!");
        closeModal();
        fetchData();
      } else {
        toast.error("Failed to save product");
      }
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchData();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Masterpieces</h1>
          <p className="text-text-light font-medium uppercase tracking-widest text-[10px] opacity-60">Manage your premium collection</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary h-14 px-8 flex items-center justify-center gap-3">
          <Plus size={20} strokeWidth={3} /> Add New Design
        </button>
      </div>

      <div className="bg-bg-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-text-light uppercase tracking-widest">
                <th className="p-8">Design</th>
                <th className="p-8">Investment</th>
                <th className="p-8">Collection</th>
                <th className="p-8">Inventory</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-text-light opacity-40">Curating collection...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-text-light opacity-40">Your gallery is empty</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                    <td className="p-8 flex items-center gap-6 min-w-[300px]">
                      <div className="w-16 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg group-hover:border-primary transition-all duration-500">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2000ms]" /> : <ImageIcon size={24} className="text-white/10" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-white uppercase text-[11px] tracking-widest truncate mb-1 group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-[10px] font-mono text-text-light opacity-50 uppercase tracking-tighter truncate">{p.slug}</p>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="font-black text-primary text-lg">{formatPrice(parseFloat(p.price))}</span>
                      {p.isSale && p.salePrice && <span className="block text-[10px] text-text-light/40 line-through font-bold">{formatPrice(parseFloat(p.price))}</span>}
                    </td>
                    <td className="p-8">
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{categories.find(c => c.id === p.categoryId)?.name || "Bespoke"}</span>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <p className="font-black text-white text-base">{p.stockQuantity}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-light opacity-40">Pieces Left</p>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        {p.inStock ? (
                          <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">Available</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">Sold Out</span>
                        )}
                        {p.isFeatured && <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">Featured</span>}
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(p)} className="w-10 h-10 bg-white/5 text-primary hover:bg-primary hover:text-black rounded-xl transition-all flex items-center justify-center border border-white/10">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-10 h-10 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center border border-white/10">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto custom-scrollbar">
          <div className="bg-bg-card rounded-[3rem] p-10 md:p-12 w-full max-w-4xl my-8 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in-up relative">
            <button onClick={closeModal} className="absolute top-10 right-10 w-12 h-12 bg-white/5 text-text-light hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center justify-center border border-white/10">
               <Plus className="rotate-45" size={24} />
            </button>
            
            <div className="mb-12">
              <h2 className="font-heading text-4xl font-black text-white tracking-tight mb-2">{editingId ? "Refine Masterpiece" : "New Creation"}</h2>
              <p className="text-text-light font-medium uppercase tracking-widest text-[10px] opacity-60">Complete the details of this design</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Design Name <span className="text-primary">*</span></label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                      className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium placeholder:text-white/10" placeholder="Elegant Embroidered Suit" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Collection <span className="text-primary">*</span></label>
                      <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required
                        className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium appearance-none">
                        <option value="" className="bg-bg-card">Select</option>
                        {categories.map(c => <option key={c.id} value={c.id} className="bg-bg-card">{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Fabric Type</label>
                      <input type="text" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                        className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium placeholder:text-white/10" placeholder="Lawn, Silk..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Investment (Rs.) <span className="text-primary">*</span></label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                        className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Sale Price</label>
                      <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                        className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Stock Quantity <span className="text-primary">*</span></label>
                    <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: parseInt(e.target.value) || 0 })} required
                      className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium" />
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Visual Gallery</label>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {form.images.map((img, i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-white/10 group/img shadow-lg">
                          <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-125" />
                          <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity">×</button>
                        </div>
                      ))}
                      <label className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${uploading ? "bg-white/5 border-primary/20" : "bg-white/5 border-white/10 hover:border-primary hover:bg-primary/5"}`}>
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        ) : (
                          <>
                            <Plus size={24} className="text-primary mb-2" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-light">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                    <div>
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block">Product Sizes</label>
                      <div className="flex flex-wrap gap-2">
                        {["S", "M", "L", "XL", "XXL", "Free Size"].map((s) => (
                          <button key={s} type="button"
                            onClick={() => {
                              const newSizes = form.sizes.includes(s) 
                                ? form.sizes.filter(sz => sz !== s)
                                : [...form.sizes, s];
                              setForm({ ...form, sizes: newSizes });
                            }}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                              form.sizes.includes(s) ? "bg-primary text-black border-primary" : "bg-white/5 text-text-light border-white/5 hover:border-primary"
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block">Available Colors</label>
                      <div className="flex flex-wrap gap-2">
                        {["Black", "White", "Red", "Blue", "Green", "Pink", "Maroon"].map((c) => (
                          <button key={c} type="button"
                            onClick={() => {
                              const newColors = form.colors.includes(c) 
                                ? form.colors.filter(cl => cl !== c)
                                : [...form.colors, c];
                              setForm({ ...form, colors: newColors });
                            }}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                              form.colors.includes(c) ? "bg-white text-black border-white" : "bg-white/5 text-text-light border-white/5 hover:border-white"
                            }`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Product Narrative</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                  className="w-full bg-white/5 px-8 py-6 rounded-[2rem] border border-white/10 focus:border-primary outline-none transition-all text-white font-medium resize-none placeholder:text-white/10" placeholder="Tell the story of this masterpiece..." />
              </div>

              <div className="flex flex-wrap gap-10 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                <label className="flex items-center gap-4 cursor-pointer group">
                   <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.inStock ? 'bg-primary border-primary' : 'border-primary/30 group-hover:border-primary'}`}>
                      {form.inStock && <div className="w-2.5 h-2.5 bg-black rounded-sm"></div>}
                   </div>
                   <input type="checkbox" className="hidden" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> 
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">Public Availability</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                   <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.isFeatured ? 'bg-primary border-primary' : 'border-primary/30 group-hover:border-primary'}`}>
                      {form.isFeatured && <div className="w-2.5 h-2.5 bg-black rounded-sm"></div>}
                   </div>
                   <input type="checkbox" className="hidden" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> 
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">Feature in Showcase</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                   <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.isNew ? 'bg-primary border-primary' : 'border-primary/30 group-hover:border-primary'}`}>
                      {form.isNew && <div className="w-2.5 h-2.5 bg-black rounded-sm"></div>}
                   </div>
                   <input type="checkbox" className="hidden" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> 
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">New Arrival Tag</span>
                </label>
              </div>

              <div className="flex gap-4 justify-end pt-10 border-t border-white/5">
                <button type="button" onClick={closeModal} className="h-14 px-10 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary h-14 px-12 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                  {editingId ? "Save Masterpiece" : "Establish Design"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  );
}
