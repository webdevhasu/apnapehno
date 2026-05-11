import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const slug = generateSlug(body.name);
    await db.insert(products).values({ ...body, slug, price: body.price.toString(), salePrice: body.salePrice ? body.salePrice.toString() : null });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (data.name) data.slug = generateSlug(data.name);
    if (data.price) data.price = data.price.toString();
    if (data.salePrice !== undefined) data.salePrice = data.salePrice ? data.salePrice.toString() : null;
    data.updatedAt = new Date();
    await db.update(products).set(data).where(eq(products.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Update product error:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    await db.delete(products).where(eq(products.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
