"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Crown, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { isLoaded, user } = useUser();
  const searchParams = useSearchParams();
  const [upgrading, setUpgrading] = useState(false);
  const [currency, setCurrency] = useState((user?.publicMetadata as any)?.currency || "GBP (£)");
  const [frequency, setFrequency] = useState((user?.publicMetadata as any)?.frequency || "Daily");
  const [saving, setSaving] = useState(false);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const plan = (user?.publicMetadata as any)?.plan || 'free';

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID })
      });
      const { url, error } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        alert(error || 'Failed to start upgrade');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setUpgrading(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, frequency })
      });
      if (res.ok) {
        alert('Preferences saved successfully!');
      } else {
        alert('Failed to save preferences.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile Settings</h1>
        <p style={{ color: '#666' }}>Manage your account and financial personality.</p>
      </header>

      {success && (
        <div style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#16a34a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={18} />
          Welcome to Laxance Pro! Your plan has been updated.
        </div>
      )}

      {canceled && (
        <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <XCircle size={18} />
          Upgrade canceled. You can try again whenever you&apos;re ready.
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
        <div style={{ 
          padding: '2rem', 
          borderBottom: '1px solid #eee', 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '1.5rem', 
          alignItems: 'center' 
        }}>
          {user?.imageUrl && (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              style={{ width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)', borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{user?.fullName || "User"}</h2>
              <span style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '99px', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                background: plan === 'pro' ? '#000' : '#f5f5f5',
                color: plan === 'pro' ? '#fff' : '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                {plan === 'pro' && <Crown size={12} />}
                {plan}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        {plan === 'free' && (
          <div style={{ padding: '2rem', background: 'linear-gradient(45deg, #000, #333)', color: '#fff' }}>
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Crown size={20} /> Upgrade to Laxance Pro
            </h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Get unlimited financial goals, advanced AI breakdown, and personalized wealth strategies.
            </p>
            <button 
              onClick={handleUpgrade}
              disabled={upgrading}
              style={{ 
                background: '#fff', 
                color: '#000', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                fontWeight: 700, 
                border: 'none', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {upgrading ? <Loader2 size={18} className="animate-spin" /> : 'Get Started for £9.99/mo'}
            </button>
          </div>
        )}
        
        <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Laxance Preferences</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Default Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option>GBP (£)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>INR (₹)</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>AI Analysis Frequency</label>
              <select 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleSavePreferences}
            disabled={saving}
            className="btn btn-primary" 
            style={{ 
              marginTop: '2rem', 
              width: '100%', 
              maxWidth: '200px', 
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Preferences'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Clerk Account Management</h3>
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
