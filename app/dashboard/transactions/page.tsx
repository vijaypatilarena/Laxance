"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, Calendar, Tag, Loader2, Trash2 } from "lucide-react";
import { useCurrency } from "@/components/CurrencyContext";

interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export default function TransactionsPage() {
  const { symbol, format, convertToGBP } = useCurrency();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load transactions from Supabase on mount
  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTransactions(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const res = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTransactions(transactions.filter(tx => tx.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          category: formData.category,
          amount: convertToGBP(Number(formData.amount)),
          type
        })
      });
      const saved = await res.json();
      if (res.ok) {
        setTransactions([saved, ...transactions]);
        setFormData({ amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      }
    } catch (err) {
      console.error('Failed to save transaction:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Transactions</h1>
        <p style={{ color: '#666' }}>Log your daily activities to feed the AI brain.</p>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Form Container */}
        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '16px', 
          border: '1px solid #eee', 
          height: 'fit-content',
          flex: '1 1 350px' 
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add Transaction</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#f5f5f5', padding: '0.25rem', borderRadius: '8px' }}>
            <button 
              onClick={() => setType('expense')}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                borderRadius: '6px', 
                background: type === 'expense' ? '#000' : 'transparent',
                color: type === 'expense' ? '#fff' : '#666',
                fontWeight: 600
              }}
            >
              Expense
            </button>
            <button 
              onClick={() => setType('income')}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                borderRadius: '6px', 
                background: type === 'income' ? '#000' : 'transparent',
                color: type === 'income' ? '#fff' : '#666',
                fontWeight: 600
              }}
            >
              Income
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>Amount ({symbol})</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>Category</label>
              <input 
                type="text" 
                placeholder="e.g. Groceries"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }} disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} {saving ? 'Saving...' : 'Add Entry'}
            </button>
          </form>
        </div>

        {/* List Container */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          border: '1px solid #eee', 
          overflow: 'hidden',
          flex: '1 1 500px'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Activity</h3>
            <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>
              {transactions.length > 0 ? `Showing last ${transactions.length} entries` : 'No transactions yet'}
            </div>
          </div>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      padding: '0.75rem', 
                      borderRadius: '10px', 
                      background: tx.type === 'income' ? '#f0fdf4' : '#fef2f2',
                      color: tx.type === 'income' ? '#16a34a' : '#dc2626'
                    }}>
                      {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{tx.category}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{tx.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: '1.1rem',
                      color: tx.type === 'income' ? '#16a34a' : '#000',
                      textAlign: 'right'
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
                    </div>
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      style={{ 
                        padding: '0.4rem', 
                        borderRadius: '6px', 
                        color: '#999',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#dc2626';
                        e.currentTarget.style.background = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#999';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#888' }}>
                <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                  <Tag size={40} style={{ margin: '0 auto' }} />
                </div>
                <p>Your transaction history is empty.</p>
                <p style={{ fontSize: '0.85rem' }}>Start by adding your first income or expense.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
