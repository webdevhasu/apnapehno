import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const allCategories = await db.select().from(categories);
    return Response.json(allCategories);
  } catch (error) {
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
