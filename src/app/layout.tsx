import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Malik Fouzan Khan — Software Developer",
  description: "Software Developer crafting bold digital experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}