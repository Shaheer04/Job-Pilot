import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toast } from "@/components/Toast";

export const metadata: Metadata = {
  title: "JobPilot | Kanban Board",
  description: "AI-powered job application tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Berkeley+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface font-body overflow-hidden h-screen flex">
        <Providers>
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
