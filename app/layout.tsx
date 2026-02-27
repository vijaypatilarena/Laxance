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
      "/app-icon.png",
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
    "msapplication-TileImage": "/app-icon.png",
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
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";
  
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="en">
        <head>
          <link rel="icon" href="/app-icon.png" type="image/png" />
          <link rel="apple-touch-icon" href="/app-icon.png" />
        </head>
        <body>
          {children}
          <InstallPrompt />
        </body>
      </html>
    </ClerkProvider>
  );
}
