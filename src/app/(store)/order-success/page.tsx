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
    <div className="max-w-2xl mx-auto px-4 py-24 md:py-40 text-center animate-fade-in">
      <div className="flex justify-center mb-16">
        <div className="relative w-24 h-24 p-3 bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl">
          <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain p-2" />
        </div>
      </div>
      
      <div className="relative inline-block mb-10">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
        <div className="relative w-24 h-24 bg-primary text-black rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(212,175,55,0.4)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
      </div>

      <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 text-white tracking-tight">Order Placed!</h1>
      
      {params.order && (
        <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Ref: {params.order}</p>
        </div>
      )}
      
      <p className="text-text-light font-medium text-lg mb-12 max-w-md mx-auto leading-relaxed">
        Thank you for choosing <span className="text-white font-black italic">Apna Pehnoo</span>. Your masterpiece is being prepared for delivery.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="btn-primary h-14 px-10 flex items-center justify-center">Continue Shopping</Link>
        <Link href="/" className="h-14 px-10 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-white/5 transition-all">Back to Home</Link>
      </div>
    </div>

  );
}
