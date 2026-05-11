import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return Response.json(allProducts);
  } catch (error) {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
