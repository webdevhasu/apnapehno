import { ProductSkeleton } from "@/components/Skeleton";

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 flex-shrink-0 space-y-4">
          <div className="h-8 w-32 bg-neutral-800 rounded-lg animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-full bg-neutral-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex justify-between mb-6">
            <div className="h-5 w-32 bg-neutral-800 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-neutral-800 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-neutral-800 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
