"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart as PieChartIcon 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useCurrency } from "@/components/CurrencyContext";
import { convertValue } from "@/lib/currency";

export default function DashboardOverview() {
  const { user } = useUser();
  const { format, convert, formatPlain } = useCurrency();

  const [rawStats, setRawStats] = useState<any>(null);
  const [rawChartData, setRawChartData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  // Fetch real stats from Supabase via API
  useEffect(() => {
    fetch('/api/agg-metrics')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setRawStats(data);
          if (data.weeklyData) setRawChartData(data.weeklyData);
        }
      })
      .catch(console.error);

    fetch('/api/intelligence-data')
      .then(res => {
        if (!res.ok) throw new Error(`Analysis failed with status ${res.status}`);
        return res.json();
      })
      .then(data => setAnalysis(data))
      .catch(err => {
        console.error("AI Analysis Fetch Error:", err);
        setAnalysis(null);
      })
      .finally(() => setLoadingAnalysis(false));
  }, []);

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p style={{ color: '#666' }}>Here&apos;s what&apos;s happening with your wealth.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: "Current Balance", value: rawStats ? format(Number(rawStats.balance)) : "...", icon: Wallet, color: "#000" },
          { label: "Total Income", value: rawStats ? format(Number(rawStats.totalIncome)) : "...", icon: TrendingUp, color: "#10b981" },
          { label: "Total Expenses", value: rawStats ? format(Number(rawStats.totalExpenses)) : "...", icon: TrendingDown, color: "#ef4444" },
          { label: "Savings Rate", value: rawStats ? `${rawStats.savingsRate}%` : "...", icon: PieChartIcon, color: "#3b82f6" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ 
              background: '#fff', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>{stat.label}</span>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Income vs Expenses</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawChartData.map(d => ({
                ...d,
                income: convert(d.income),
                expense: convert(d.expense)
              }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                  formatter={(value: any) => [formatPlain(Number(value) || 0), ""]}
                />
                <Bar dataKey="income" fill="#000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ccc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ 
          background: '#000', 
          color: '#fff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '1px solid #eee', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChartIcon size={20} /> AI Insight
            </h3>
            {loadingAnalysis ? (
              <div style={{ padding: '2rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                 <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                 <p style={{ fontSize: '0.9rem', color: '#888' }}>Analyzing patterns...</p>
              </div>
            ) : analysis ? (
              <p style={{ fontSize: '1rem', color: '#aaa', lineHeight: 1.6 }}>
                {analysis.shifts?.[0]?.description || analysis.wealthStrategy.slice(0, 150) + "..."}
              </p>
            ) : (
              <p style={{ fontSize: '1rem', color: '#666' }}>Log more activities to generate AI insights.</p>
            )}
          </div>
          <a href="/dashboard/analysis" className="btn btn-primary" style={{ background: '#fff', color: '#000', marginTop: '2.5rem', width: '100%', justifyContent: 'center', textAlign: 'center', textDecoration: 'none' }}>
            View Full Analysis
          </a>
        </div>
      </div>
    </div>
  );
}
