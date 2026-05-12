import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12 relative z-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="inline-block group mb-8">
            <div className="relative w-24 h-24 p-2 bg-white/5 rounded-3xl border border-white/10 group-hover:border-primary transition-all duration-700 group-hover:scale-110">
              <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain p-2 filter brightness-110" />
            </div>
          </Link>
          <h3 className="font-heading text-3xl font-black mb-6 tracking-tight">Apna Pehnoo</h3>
          <p className="text-sm text-text-light mb-10 leading-relaxed max-w-xs font-medium">Redefining elegance through timeless designs and premium craftsmanship. Experience luxury Pakistani couture at its finest.</p>
          <div className="flex gap-4">
            {[
              { label: "FB", href: "https://facebook.com" },
              { label: "IG", href: "https://instagram.com" },
              { label: "WA", href: "https://wa.me/923001234567" }
            ].map((social) => (
              <a key={social.label} href={social.href} target="_blank" 
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black hover:border-primary transition-all duration-500 font-black text-[10px] tracking-widest">
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-10 text-primary">Collections</h4>
          <ul className="space-y-5 text-xs font-black uppercase tracking-[0.15em] text-text-light">
            {["Shop All", "New Arrivals", "Best Sellers", "Sale Items"].map((link) => (
              <li key={link}>
                <Link href="/shop" className="hover:text-primary transition-all flex items-center gap-3 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-10 text-primary">Support</h4>
          <ul className="space-y-5 text-xs font-black uppercase tracking-[0.15em] text-text-light">
            {["Contact Us", "Shipping Info", "Returns & Exchange", "Privacy Policy"].map((link) => (
              <li key={link}>
                <Link href="/contact" className="hover:text-primary transition-all flex items-center gap-3 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-10 text-primary">Get in Touch</h4>
          <div className="space-y-8 text-sm">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-primary"><Phone size={20} strokeWidth={1.5} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Phone</p>
                <p className="text-text-light font-medium">+92 300 1234567</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-primary"><Mail size={20} strokeWidth={1.5} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Email</p>
                <p className="text-text-light font-medium underline decoration-primary/30">hello@apnapehnoo.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
        <p>&copy; {new Date().getFullYear()} Apna Pehnoo Premium • All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
        </div>
        <p className="flex items-center gap-2">Designed for <span className="text-primary italic">Excellence</span></p>
      </div>
    </footer>
  );
}

