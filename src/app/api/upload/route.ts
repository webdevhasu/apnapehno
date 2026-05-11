import { uploadImage } from "@/lib/cloudinary";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    const url = await uploadImage(base64);

    return Response.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
