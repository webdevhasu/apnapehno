import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-bold text-center mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-border space-y-6">
          <h2 className="font-heading text-xl font-bold">Get in Touch</h2>
          {[
            { icon: Phone, label: "Phone", value: "0300 1234567" },
            { icon: Mail, label: "Email", value: "info@apnapehnoo.com" },
            { icon: MapPin, label: "Location", value: "Pakistan" },
            { icon: Clock, label: "Hours", value: "Mon-Sat: 10AM - 8PM" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                <c.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-light">{c.label}</p>
                <p className="text-sm font-medium">{c.value}</p>
              </div>
            </div>
          ))}
          <a href="https://wa.me/923001234567" target="_blank" className="btn-primary block text-center">
            Chat on WhatsApp
          </a>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="font-heading text-xl font-bold mb-4">Send a Message</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary" />
            <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary" />
            <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary" />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
