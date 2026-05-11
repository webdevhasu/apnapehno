import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { generateOrderNumber } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, shippingAddress, city, postalCode, items, totalAmount, notes } = body;

    if (!customerName || !customerPhone || !shippingAddress || !city || !items?.length) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    await db.insert(orders).values({
      orderNumber, customerName, customerEmail: customerEmail || null,
      customerPhone, shippingAddress, city, postalCode: postalCode || null,
      items, totalAmount: totalAmount.toString(), notes: notes || null,
      status: "pending", paymentMethod: "cod",
    });

    return Response.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Order error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return Response.json(allOrders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status, trackingId } = await request.json();
    await db.update(orders)
      .set({ status, trackingId, updatedAt: new Date() })
      .where(eq(orders.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Update order error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
