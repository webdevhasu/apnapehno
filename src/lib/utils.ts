export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rs. ${num.toLocaleString("en-PK")}`;
}

export function generateSlug(text: string): string {
  const baseSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomStr}`;
}

export function generateOrderNumber(): string {
  const prefix = "AP";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
