import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "react-hot-toast";

import { WishlistProvider } from "@/lib/wishlist";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Apna Pehnoo - Premium Women's Clothing",
  description: "Shop the latest trends in women's fashion. Premium quality suits, lawn collections, embroidered designs and more at Apna Pehnoo.",
  keywords: "women clothing, Pakistani suits, lawn collection, embroidered suits, online shopping",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster position="bottom-right" toastOptions={{
              style: { background: "#4a302d", color: "#fff", borderRadius: "12px" },
            }} />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
