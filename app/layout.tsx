import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laxance | Advanced Finance SaaS",
  description: "AI-powered daily expenses, income analysis, and goal-oriented wealth building.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Laxance",
    startupImage: [
      "/icon-512x512.png",
    ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Laxance",
    "apple-mobile-web-app-title": "Laxance",
    "msapplication-TileColor": "#000000",
    "msapplication-TileImage": "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/icon-192x192.png" type="image/png" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </head>
        <body>
          {children}
          <InstallPrompt />
        </body>
      </html>
    </ClerkProvider>
  );
}
