"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '1.5rem 0',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/app-icon.png" alt="Laxance" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        
        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.href} 
              style={{ fontWeight: 600, fontSize: '0.9rem', color: '#666', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
            >
              {link.name}
            </Link>
          ))}
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '2rem' }}>
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.7rem 1.4rem', borderRadius: '100px', fontSize: '0.9rem' }}>Dashboard</Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button style={{ fontWeight: 600, fontSize: '0.9rem', color: '#000', cursor: 'pointer' }}>Login</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn btn-primary" style={{ padding: '0.7rem 1.4rem', borderRadius: '100px', fontSize: '0.9rem' }}>Get Started</button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#fff',
              borderBottom: '1px solid #eee',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem 1.5rem'
            }}
          >
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                style={{ padding: '1rem 0', fontWeight: 500, borderBottom: '1px solid #fafafa' }}
              >
                {link.name}
              </Link>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 0' }}>
              {isSignedIn ? (
                <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Dashboard</Link>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign Up</button>
                  </SignUpButton>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
