import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const museoSans = Nunito_Sans({
  variable: "--font-museo-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "365 Hub - Jouw community bloeit",
  description: "Van eenzaamheid naar verbinding. Samen bouwen we aan communities waar mensen elkaar écht vinden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${museoSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
