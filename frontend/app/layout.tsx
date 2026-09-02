import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sharmafurniturehouse.com"),
  title: {
    default: "Sharma Furniture House | Custom Carpentry & Furniture, Indore",
    template: "%s | Sharma Furniture House",
  },
  description:
    "Sharma Furniture House, led by Mr. Dhananjay Sharma with 30+ years of carpentry experience, builds custom furniture and complete woodworking solutions for homes, hotels, offices, schools and more in Indore, Madhya Pradesh.",
  keywords: [
    "custom furniture Indore",
    "carpenter in Indore",
    "modular kitchen Indore",
    "wardrobe manufacturer Indore",
    "office furniture Indore",
    "custom carpentry Madhya Pradesh",
  ],
  openGraph: {
    title: "Sharma Furniture House | Custom Carpentry & Furniture, Indore",
    description:
      "30+ years of craftsmanship. Custom furniture and woodworking for homes, hotels, offices, schools and commercial spaces in Indore.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body bg-linen text-ink antialiased flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}
