import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kesimpulan App",
  description: "Farcaster Mini App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}