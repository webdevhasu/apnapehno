import { createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || "admin@apnapehnoo.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== adminEmail || password !== adminPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({ email, role: "admin" });
    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
