"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a href="https://wa.me/923001234567?text=Hi%20Apna%20Pehnoo!%20I%20am%20interested%20in%20your%20products."
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.3)] hover:scale-110 transition-all duration-500 group overflow-hidden"
      aria-label="Chat on WhatsApp">
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
      <MessageCircle size={32} strokeWidth={2} className="relative z-10" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping"></span>
    </a>

  );
}
