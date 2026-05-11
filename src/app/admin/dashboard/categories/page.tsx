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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold">Categories</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg text-left">
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Slug</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-text-light">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-text-light">No categories found</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center overflow-hidden">
                      {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <span className="text-primary font-bold">{c.name[0]}</span>}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-text-light font-mono text-xs">{c.slug}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(c)} className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <h2 className="font-heading text-xl font-bold mb-4">{editId ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-bold text-accent mb-2 block">Category Image</label>
                <div className="grid grid-cols-1 gap-4">
                  {form.image ? (
                    <div className="aspect-square rounded-2xl overflow-hidden relative border border-border group w-32 mx-auto">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, image: "" })}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">×</button>
                    </div>
                  ) : (
                    <label className={`aspect-square w-32 mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${uploading ? "bg-bg border-primary/20" : "bg-bg/50 border-border hover:border-primary hover:bg-primary/5"}`}>
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                            <Plus size={16} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">Upload</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-full border border-border hover:bg-bg">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {editId ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
