"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories/list");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c: Category) => {
    setEditId(c.id);
    setForm({
      name: c.name,
      description: c.description || "",
      image: c.image || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm({ name: "", description: "", image: "" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setForm({ ...form, image: data.url });
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editId ? `/api/categories?id=${editId}` : "/api/categories";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editId ? "Category updated!" : "Category created!");
        closeModal();
        fetchCategories();
      } else {
        toast.error("Failed to save category");
      }
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This will delete the category!")) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Curations</h1>
          <p className="text-text-light font-medium uppercase tracking-widest text-[10px] opacity-60">Organize your masterpieces by collection</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary h-14 px-8 flex items-center justify-center gap-3">
          <Plus size={20} strokeWidth={3} /> New Collection
        </button>
      </div>

      <div className="bg-bg-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-text-light uppercase tracking-widest">
                <th className="p-8">Gallery</th>
                <th className="p-8">Identifier</th>
                <th className="p-8">Reference</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-text-light opacity-40">Organizing archives...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-text-light opacity-40">No collections defined</td></tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg group-hover:border-primary transition-all duration-500">
                          {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2000ms]" /> : <span className="text-primary font-black text-xl">{c.name[0]}</span>}
                        </div>
                        <p className="font-black text-white uppercase text-[11px] tracking-widest group-hover:text-primary transition-colors">{c.name}</p>
                      </div>
                    </td>
                    <td className="p-8">
                       <p className="text-[10px] font-mono text-text-light opacity-50 uppercase tracking-tighter truncate">{c.slug}</p>
                    </td>
                    <td className="p-8">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">ID: {c.id}</p>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(c)} className="w-10 h-10 bg-white/5 text-primary hover:bg-primary hover:text-black rounded-xl transition-all flex items-center justify-center border border-white/10">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="w-10 h-10 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center border border-white/10">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-bg-card rounded-[3rem] p-10 md:p-12 w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in-up relative">
            <button onClick={closeModal} className="absolute top-10 right-10 w-12 h-12 bg-white/5 text-text-light hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center justify-center border border-white/10">
               <Plus className="rotate-45" size={24} />
            </button>

            <div className="mb-10">
              <h2 className="font-heading text-3xl font-black text-white tracking-tight mb-2">{editId ? "Refine Collection" : "Establish Collection"}</h2>
              <p className="text-text-light font-medium uppercase tracking-widest text-[10px] opacity-60">Define the details of this gallery</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Collection Name <span className="text-primary">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium placeholder:text-white/10" placeholder="e.g. Summer Lawn 24" />
              </div>
              <div>
                <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-4 block">Narrative Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus:border-primary outline-none transition-all text-white font-medium resize-none placeholder:text-white/10" placeholder="Brief overview of this collection..." />
              </div>
              <div>
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block text-center">Collection Iconography</label>
                <div className="flex justify-center">
                  {form.image ? (
                    <div className="aspect-square rounded-3xl overflow-hidden relative border border-white/10 group/img w-40 shadow-2xl">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-125" />
                      <button type="button" onClick={() => setForm({ ...form, image: "" })}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity">×</button>
                    </div>
                  ) : (
                    <label className={`aspect-square w-40 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${uploading ? "bg-white/5 border-primary/20" : "bg-white/5 border-white/10 hover:border-primary hover:bg-primary/5"}`}>
                      {uploading ? (
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Plus size={32} className="text-primary mb-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-light">Upload Art</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-6 border-t border-white/5">
                <button type="button" onClick={closeModal} className="h-12 px-8 rounded-xl border border-white/10 text-white font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-all">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary h-12 px-10 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  {editId ? "Update Gallery" : "Establish Archive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
