import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="inline-block group">
            <div className="relative w-28 h-28 mb-6 group-hover:scale-105 transition-transform duration-500">
              <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain" />
            </div>
          </Link>
          <h3 className="font-heading text-3xl font-black mb-4 tracking-tighter">Apna Pehnoo</h3>
          <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-xs">Redefining elegance through timeless designs and premium craftsmanship. Join us in our journey of style.</p>
          <div className="flex gap-4">
            {[
              { label: "fb", href: "https://facebook.com" },
              { label: "ig", href: "https://instagram.com" },
              { label: "wa", href: "https://wa.me/923001234567" }
            ].map((social) => (
              <a key={social.label} href={social.href} target="_blank" 
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 font-bold text-xs uppercase tracking-tighter">
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-8 text-primary">Collections</h4>
          <ul className="space-y-4 text-sm text-white/50">
            {["Shop All", "New Arrivals", "Best Sellers", "Sale Items"].map((link) => (
              <li key={link}>
                <Link href="/shop" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-3" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-8 text-primary">Support</h4>
          <ul className="space-y-4 text-sm text-white/50">
            {["Contact Us", "Shipping Info", "Returns & Exchange", "Privacy Policy"].map((link) => (
              <li key={link}>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-3" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-8 text-primary">Get in Touch</h4>
          <div className="space-y-6 text-sm text-white/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0"><Phone size={16} /></div>
              <div>
                <p className="text-white font-bold mb-1">Phone</p>
                <p>+92 300 1234567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0"><Mail size={16} /></div>
              <div>
                <p className="text-white font-bold mb-1">Email</p>
                <p>hello@apnapehnoo.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
        <p>&copy; {new Date().getFullYear()} Apna Pehnoo Premium. All rights reserved.</p>
        <p>Designed for Excellence</p>
      </div>
    </footer>
  );
}
