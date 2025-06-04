// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Cloner",
  description: "Clone websites using Hyperbrowser + GPT-4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom right, #f1f5f9, #ffffff)",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}>
        {children}
      </body>
    </html>
  );
}
