import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yubileniy Restoran | Digital Menu",
  description: "QR-kod orqali raqamli menyu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${jakarta.variable} ${manrope.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased font-sans">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
