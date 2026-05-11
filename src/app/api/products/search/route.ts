import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { ilike, or, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return Response.json([]);
  }

  try {
    const results = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      salePrice: products.salePrice,
      images: products.images,
      categoryName: categories.name
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        or(
          ilike(products.name, `%${query}%`),
          ilike(products.description, `%${query}%`)
        )
      )
      .limit(8);

    return Response.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Failed to search products" }, { status: 500 });
  }
}
