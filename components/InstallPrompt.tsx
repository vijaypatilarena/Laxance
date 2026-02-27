"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed before (respect for 7 days)
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after a short delay so page loads first
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBanner(false);
      setIsClosing(false);
      localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    }, 300);
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: `translateX(-50%) translateY(${isClosing ? "120%" : "0"})`,
        zIndex: 9999,
        width: "calc(100% - 2rem)",
        maxWidth: "420px",
        background: "#111",
        borderRadius: "20px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.08)",
        animation: isClosing ? "none" : "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transition: "transform 0.3s ease",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* App Icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src="/app-icon.png"
          alt="Laxance"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#fff",
            marginBottom: "0.15rem",
          }}
        >
          Install Laxance
        </div>
        <div style={{ fontSize: "0.8rem", color: "#888", lineHeight: 1.4 }}>
          Add to your home screen for the best experience
        </div>
      </div>

      {/* Install button */}
      <button
        onClick={handleInstall}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.6rem 1.1rem",
          borderRadius: "100px",
          background: "#fff",
          color: "#000",
          fontWeight: 700,
          fontSize: "0.8rem",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          transition: "transform 0.15s ease",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Download size={14} />
        Install
      </button>

      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "#333",
          color: "#888",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
        }}
      >
        <X size={12} />
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(120%);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
