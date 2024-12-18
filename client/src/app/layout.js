import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Providers } from "./providers";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Help-Net",
  description: "Help-Net: Disaster Relief information provider",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-black`}
      >
        <Providers>
        <Navbar />

        {children}
        </Providers>
      </body>
    </html>
  );
}
