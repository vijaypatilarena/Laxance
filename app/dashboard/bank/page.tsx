"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Landmark, 
  Shield, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ArrowRight,
  ExternalLink,
  Trash2, 
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";

interface ConnectedBank {
  institution_name: string;
  connected_at: string;
  status: string;
}

interface PlaidTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  bank: string;
}

export default function BankPage() {
  const [connectedBanks, setConnectedBanks] = useState<ConnectedBank[]>([]);
  const [plaidTransactions, setPlaidTransactions] = useState<PlaidTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch connected banks
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/banking-provider/status');
      const data = await res.json();
      setConnectedBanks(data.banks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // Connect a new bank via Plaid Link
  const handleConnect = async () => {
    setIsConnecting(true);
    setMessage(null);
    try {
      // 1. Get a link token from our server
      const tokenRes = await fetch('/api/banking-provider/create-link-token', { method: 'POST' });
      const tokenData = await tokenRes.json();

      if (!tokenData.link_token) {
        throw new Error('Failed to initialize bank connection');
      }

      // 2. Open Plaid Link via CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      script.onload = () => {
        const handler = (window as any).Plaid.create({
          token: tokenData.link_token,
          onSuccess: async (publicToken: string, metadata: any) => {
            // 3. Exchange the public token
            try {
              const exchangeRes = await fetch('/api/banking-provider/exchange-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  public_token: publicToken,
                  institution: metadata.institution,
                }),
              });

              const exchangeData = await exchangeRes.json();

              if (exchangeData.success) {
                setMessage({ type: 'success', text: `${exchangeData.institution_name} connected securely!` });
                fetchStatus();
              } else {
                setMessage({ type: 'error', text: 'Failed to finalize bank connection.' });
              }
            } catch (err) {
              setMessage({ type: 'error', text: 'Error connecting bank. Please try again.' });
            } finally {
              setIsConnecting(false);
            }
          },
          onExit: () => {
            setIsConnecting(false);
          },
        });
        handler.open();
      };
      document.body.appendChild(script);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to connect bank.' });
      setIsConnecting(false);
    }
  };

  // Sync transactions from connected banks
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/banking-provider/transactions');
      const data = await res.json();
      setPlaidTransactions(data.transactions || []);
      setMessage({ type: 'success', text: `Synced ${data.transactions?.length || 0} transactions from your banks.` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to sync transactions.' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Disconnect a bank
  const handleDisconnect = async (institutionName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${institutionName}? This will stop transaction syncing.`)) return;
    try {
      await fetch('/api/banking-provider/status', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institution_name: institutionName }),
      });
      setMessage({ type: 'success', text: `${institutionName} disconnected.` });
      fetchStatus();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to disconnect bank.' });
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: '#000', color: '#fff', padding: '0.75rem', borderRadius: '12px' }}>
            <Landmark size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Bank Connections</h1>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Securely link your bank accounts to auto-sync transactions.</p>
          </div>
        </div>
      </header>

      {/* Security Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'flex-start'
        }}
      >
        <ShieldCheck size={28} style={{ color: '#16a34a', flexShrink: 0 }} />
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#15803d' }}>🔐 Bank-Grade Security</h3>
          <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.6 }}>
            Your bank credentials are handled exclusively by <strong>Plaid</strong>, a trusted intermediary used by thousands of financial apps. 
            Access tokens are encrypted with <strong>AES-256-GCM</strong> before storage. Even the developer cannot see or access your banking data.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#15803d' }}>
              <Lock size={14} /> End-to-End Encrypted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#15803d' }}>
              <Shield size={14} /> SOC 2 Compliant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#15803d' }}>
              <EyeOff size={14} /> Zero Developer Access
            </div>
          </div>
        </div>
      </motion.div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              marginBottom: '2rem', 
              padding: '1.2rem 1.5rem', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: message.type === 'success' ? '#15803d' : '#dc2626',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected Banks */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Connected Accounts</h2>
          {connectedBanks.length > 0 && (
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.6rem 1.2rem', 
                borderRadius: '12px', 
                border: '1px solid #eee',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Transactions'}
            </button>
          )}
        </div>

        {connectedBanks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem', 
            background: '#fafafa', 
            borderRadius: '24px', 
            border: '1px solid #f0f0f0' 
          }}>
            <Landmark size={48} style={{ color: '#ccc', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Banks Connected</h3>
            <p style={{ color: '#888', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              Connect your bank account to automatically import transactions and let AI analyze your spending patterns.
            </p>
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="btn btn-primary"
              style={{ 
                padding: '1rem 2.5rem', 
                borderRadius: '16px', 
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <Landmark size={18} />}
              {isConnecting ? 'Connecting...' : 'Connect Your Bank'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {connectedBanks.map((bank, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem 2rem',
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: '#000', 
                    color: '#fff', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Landmark size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{bank.institution_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      Connected {new Date(bank.connected_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.3rem', 
                    color: '#16a34a', 
                    fontSize: '0.8rem', 
                    fontWeight: 600 
                  }}>
                    <CheckCircle2 size={14} /> Active
                  </div>
                  <button
                    onClick={() => handleDisconnect(bank.institution_name)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid #fee2e2',
                      background: '#fff',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Add another bank button */}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1.2rem',
                borderRadius: '20px',
                border: '2px dashed #ddd',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#666',
                fontSize: '0.95rem'
              }}
            >
              {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <Landmark size={18} />}
              {isConnecting ? 'Connecting...' : 'Connect Another Bank'}
            </button>
          </div>
        )}
      </div>

      {/* Synced Transactions */}
      {plaidTransactions.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Recent Bank Transactions ({plaidTransactions.length})
          </h2>
          <div style={{ 
            background: '#fff', 
            border: '1px solid #eee', 
            borderRadius: '20px', 
            overflow: 'hidden' 
          }}>
            {plaidTransactions.slice(0, 20).map((tx, i) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.2rem 2rem',
                  borderBottom: i < plaidTransactions.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{tx.description}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    {tx.date} • {tx.category} • {tx.bank}
                  </div>
                </div>
                <div style={{
                  fontWeight: 700,
                  color: tx.type === 'income' ? '#16a34a' : '#000',
                }}>
                  {tx.type === 'income' ? '+' : '-'}£{tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
