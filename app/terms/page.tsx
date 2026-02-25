"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Loader2, ScrollText, Lock, Eye, FileText } from "lucide-react";

export default function TermsPage() {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // If user already accepted terms, skip to dashboard
  useEffect(() => {
    if (!isLoaded || !user) return;
    const termsAccepted = (user.publicMetadata as any)?.termsAcceptedAt;
    if (termsAccepted) {
      router.replace('/dashboard');
    }
  }, [isLoaded, user, router]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    if (!accepted) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/terms/accept', { method: 'POST' });
      if (res.ok) {
        // Force Clerk to reload user metadata from the server
        await user?.reload();
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '700px',
          width: '100%',
          background: '#fff',
          borderRadius: '32px',
          border: '1px solid #eee',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '3rem 3rem 2rem',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            background: '#000',
            color: '#fff',
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ScrollText size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Terms & Conditions</h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Please review and accept to continue</p>
          </div>
        </div>

        {/* T&C Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '2rem 3rem',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: '#444',
          }}
        >
          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>1. Acceptance of Terms</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            By accessing and using Laxance (&quot;the Platform&quot;), you agree to be bound by these Terms and Conditions. 
            If you do not agree, you must not use the Platform. Laxance reserves the right to modify these terms 
            at any time with notice provided through the Platform.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>2. Account & Security</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            You are responsible for maintaining the confidentiality of your account credentials. Laxance uses 
            industry-standard encryption (AES-256-GCM) for all sensitive data. Authentication is handled through 
            Clerk, a SOC 2 compliant provider. You must notify us immediately of any unauthorized access.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>3. Financial Data & Privacy</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Laxance integrates with banking institutions through Plaid, a trusted financial intermediary. 
            Your bank credentials are never stored on our servers. Access tokens are encrypted with AES-256-GCM 
            and cannot be viewed by Laxance developers or staff. Transaction data is used solely to provide 
            you with personalized financial insights.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>4. AI-Powered Insights</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Laxance uses artificial intelligence (powered by Google Gemini) to analyze financial data and provide 
            suggestions. These insights are for informational purposes only and do not constitute financial advice. 
            You should consult a qualified financial advisor before making investment or important financial decisions.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>5. Data Retention</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Your financial data is stored securely in our database. You may request deletion of your data at any 
            time by contacting support or through your account settings. Upon account deletion, all associated 
            data will be permanently removed within 30 days.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>6. Service Availability</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            While we strive for 99.9% uptime, Laxance does not guarantee uninterrupted service. We are not 
            liable for any losses resulting from service interruptions, data synchronization delays, or 
            third-party service outages (including banking APIs and AI providers).
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>7. Intellectual Property</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            All content, design, and technology on the Platform are owned by Laxance and protected by intellectual 
            property laws. You may not reproduce, distribute, or create derivative works without prior written consent.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>8. Limitation of Liability</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Laxance shall not be liable for any indirect, incidental, or consequential damages arising from the 
            use of the Platform. Our total liability to you for any claim shall not exceed the amount paid by you 
            for the service in the preceding 12 months.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>9. Governing Law</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            These Terms shall be governed by and construed in accordance with the laws of the United Kingdom. 
            Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h3 style={{ fontWeight: 700, color: '#000', marginBottom: '1rem', fontSize: '1.1rem' }}>10. Contact</h3>
          <p style={{ marginBottom: '0' }}>
            For questions regarding these Terms, please contact us through the Platform&apos;s support channels 
            or email <strong>legal@laxance.com</strong>.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '2rem 3rem',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {/* Security badges */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#888' }}>
              <Lock size={12} /> AES-256 Encrypted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#888' }}>
              <Shield size={12} /> SOC 2 Compliant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#888' }}>
              <Eye size={12} /> GDPR Ready
            </div>
          </div>

          {/* Checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
            opacity: hasScrolledToBottom ? 1 : 0.4,
          }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={!hasScrolledToBottom}
              style={{
                marginTop: '4px',
                width: '18px',
                height: '18px',
                accentColor: '#000',
                cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
              }}
            />
            <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              I have read and agree to the <strong>Terms & Conditions</strong> and <strong>Privacy Policy</strong> of Laxance. 
              I understand that my financial data will be processed securely and used to provide personalized insights.
            </span>
          </label>

          {!hasScrolledToBottom && (
            <p style={{ fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic' }}>
              ↓ Please scroll to the bottom of the terms to enable acceptance.
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleAccept}
            disabled={!accepted || isSubmitting}
            style={{
              width: '100%',
              padding: '1.2rem',
              borderRadius: '16px',
              background: accepted ? '#000' : '#ddd',
              color: accepted ? '#fff' : '#999',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: accepted ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
            }}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Processing...</>
            ) : (
              <><CheckCircle2 size={18} /> Accept & Continue to Dashboard</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
