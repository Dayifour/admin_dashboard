import Footer from "@/components/footer.tsx/Footer";
import Sidebar from "@/components/sidebar/Sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "A dashboard for the admin to manage the application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-row">
          <div className="w-[300px]">
            <Sidebar />
          </div>
          <div className="w-full h-screen overflow-scroll flex flex-col min-h-screen overflow-x-hidden">
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
