import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import Link from "next/link";

export default async function CategoriesPage() {
  let allCategories: typeof categories.$inferSelect[] = [];
  try { allCategories = await db.select().from(categories); } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Categories</h1>
      {allCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allCategories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="group">
              <div className="card-hover bg-white rounded-2xl overflow-hidden border border-border">
                <div className="aspect-square bg-primary-light flex items-center justify-center">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-heading text-4xl text-primary/40">{cat.name[0]}</span>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                  {cat.description && <p className="text-xs text-text-light mt-1">{cat.description}</p>}
                  <span className="text-xs text-primary font-medium mt-2 inline-block">View Collection →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-text-light py-12">No categories yet.</p>
      )}
    </div>
  );
}
