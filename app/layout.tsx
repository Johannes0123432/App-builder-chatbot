import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App Builder Chatbot",
  description: "Describe an app and get a complete, deployable project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
