import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    product = result[0];
  } catch {
    notFound();
  }

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
