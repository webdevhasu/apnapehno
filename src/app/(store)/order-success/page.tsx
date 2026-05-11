import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
      <div className="flex justify-center mb-8">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md">
          <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain" />
        </div>
      </div>
      <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
      <h1 className="font-heading text-4xl font-bold mb-2 text-accent">Order Placed!</h1>
      {params.order && (
        <p className="text-text-light mb-2">Order Number: <strong>{params.order}</strong></p>
      )}
      <p className="text-text-light mb-6">Thank you for shopping with Apna Pehnoo! We will contact you shortly to confirm your order.</p>
      <Link href="/shop" className="btn-primary">Continue Shopping</Link>
    </div>
  );
}
