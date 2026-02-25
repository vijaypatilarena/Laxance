"use client";

import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: '#fff',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}>
        <WifiOff size={36} strokeWidth={1.5} />
      </div>

      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        marginBottom: '0.75rem',
      }}>
        You&apos;re Offline
      </h1>

      <p style={{
        color: '#888',
        fontSize: '1rem',
        lineHeight: 1.6,
        maxWidth: '400px',
        marginBottom: '2.5rem',
      }}>
        It looks like you&apos;ve lost your internet connection. 
        Check your network and try again.
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.9rem 2rem',
          borderRadius: '100px',
          background: '#fff',
          color: '#000',
          fontWeight: 700,
          fontSize: '0.95rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <RefreshCw size={18} />
        Try Again
      </button>

      <div style={{
        position: 'absolute',
        bottom: '2rem',
        color: '#333',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
      }}>
        LAXANCE
      </div>
    </div>
  );
}
