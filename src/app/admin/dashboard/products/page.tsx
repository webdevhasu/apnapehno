"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold">Products</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg text-left border-b border-border">
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-text-light">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-text-light">No products found</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-12 h-16 rounded-lg bg-primary-light flex items-center justify-center overflow-hidden flex-shrink-0">
                      {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-primary/50" />}
                    </div>
                    <div>
                      <p className="font-medium max-w-[200px] truncate">{p.name}</p>
                      <p className="text-xs text-text-light truncate">{p.slug}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-primary">{formatPrice(parseFloat(p.price))}</span>
                    {p.isSale && p.salePrice && <span className="block text-xs text-text-light line-through">{formatPrice(parseFloat(p.price))}</span>}
                  </td>
                  <td className="p-4 text-text-light">{categories.find(c => c.id === p.categoryId)?.name || "Unknown"}</td>
                  <td className="p-4">
                    <p className="font-medium">{p.stockQuantity} items</p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {p.inStock && <span className="px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-700">In Stock</span>}
                      {p.isFeatured && <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700">Featured</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-2xl font-bold text-accent">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} className="text-text-light hover:text-accent"><Plus className="rotate-45" size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Category *</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required
                    className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Price (Rs.) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                    className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Sale Price (Rs.)</label>
                  <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Fabric</label>
                  <input type="text" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Stock Quantity *</label>
                  <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: parseInt(e.target.value) || 0 })} required
                    className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
                </div>

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-bg rounded-2xl border border-border/50">
                  <div>
                    <label className="text-sm font-bold text-accent mb-3 block">Product Sizes</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["S", "M", "L", "XL", "XXL", "Free Size"].map((s) => (
                        <button key={s} type="button"
                          onClick={() => {
                            const newSizes = form.sizes.includes(s) 
                              ? form.sizes.filter(sz => sz !== s)
                              : [...form.sizes, s];
                            setForm({ ...form, sizes: newSizes });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            form.sizes.includes(s) ? "bg-primary text-white border-primary" : "bg-white text-text-light border-border hover:border-primary"
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Custom size..." 
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !form.sizes.includes(val)) {
                              setForm({ ...form, sizes: [...form.sizes, val] });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="flex-1 px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-sm bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-accent mb-3 block">Available Colors</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Black", "White", "Red", "Blue", "Green", "Pink", "Maroon"].map((c) => (
                        <button key={c} type="button"
                          onClick={() => {
                            const newColors = form.colors.includes(c) 
                              ? form.colors.filter(cl => cl !== c)
                              : [...form.colors, c];
                            setForm({ ...form, colors: newColors });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            form.colors.includes(c) ? "bg-accent text-white border-accent" : "bg-white text-text-light border-border hover:border-accent"
                          }`}>
                          {c}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Custom color..." 
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !form.colors.includes(val)) {
                              setForm({ ...form, colors: [...form.colors, val] });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="flex-1 px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-sm bg-white" />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-border group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">×</button>
                      </div>
                    ))}
                    <label className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${uploading ? "bg-bg border-primary/20" : "bg-bg/50 border-border hover:border-primary hover:bg-primary/5"}`}>
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                            <Plus size={20} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">Add Image</span>
                        </>
                      )}
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
                </div>

                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> In Stock</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> New Arrival</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isSale} onChange={(e) => setForm({ ...form, isSale: e.target.checked })} /> On Sale</label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-border mt-6">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl border border-border hover:bg-bg font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {editingId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
