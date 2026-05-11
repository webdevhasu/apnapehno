import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const slug = generateSlug(body.name);
    await db.insert(categories).values({ ...body, slug });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Create category error:", error);
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    await db.delete(categories).where(eq(categories.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    const body = await request.json();
    
    // Generate slug with a small random part to avoid unique constraint issues if name is the same
    const slug = generateSlug(body.name) + "-" + Math.random().toString(36).substring(2, 6);
    
    await db.update(categories).set({ ...body, slug }).where(eq(categories.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Update category error:", error);
    return Response.json({ error: "Failed to update category" }, { status: 500 });
  }
}
