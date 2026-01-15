import type { Metadata } from "next";
import { Caveat, Patrick_Hand, DM_Sans } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hand",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hand-secondary",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Swahili AI",
  description: "Jifunze Kiswahili kwa Urahisi na AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} ${patrickHand.variable} ${dmSans.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
