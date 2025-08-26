import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DataClientContextProvider } from "@/context/dataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shoesx",
  description: "A complete e-commerce application with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataClientContextProvider>
          <Navbar />
          {children}
          <Footer />
        </DataClientContextProvider>
      </body>
    </html>
  );
}
