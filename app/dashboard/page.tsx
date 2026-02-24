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

export default function DashboardOverview() {
  const { user } = useUser();

  const [stats, setStats] = useState([
    { label: "Current Balance", value: "£0.00", icon: Wallet, color: "#000" },
    { label: "Total Income", value: "£0.00", icon: TrendingUp, color: "#10b981" },
    { label: "Total Expenses", value: "£0.00", icon: TrendingDown, color: "#ef4444" },
    { label: "Savings Rate", value: "0%", icon: PieChartIcon, color: "#3b82f6" },
  ]);

  const [chartData, setChartData] = useState([
    { name: 'Mon', income: 0, expense: 0 },
    { name: 'Tue', income: 0, expense: 0 },
    { name: 'Wed', income: 0, expense: 0 },
    { name: 'Thu', income: 0, expense: 0 },
    { name: 'Fri', income: 0, expense: 0 },
    { name: 'Sat', income: 0, expense: 0 },
    { name: 'Sun', income: 0, expense: 0 },
  ]);

  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  // Fetch real stats from Supabase via API
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats([
            { label: "Current Balance", value: `£${Number(data.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Wallet, color: "#000" },
            { label: "Total Income", value: `£${Number(data.totalIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "#10b981" },
            { label: "Total Expenses", value: `£${Number(data.totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingDown, color: "#ef4444" },
            { label: "Savings Rate", value: `${data.savingsRate}%`, icon: PieChartIcon, color: "#3b82f6" },
          ]);
          if (data.weeklyData) setChartData(data.weeklyData);
        }
      })
      .catch(console.error);

    fetch('/api/ai/analyze')
      .then(res => res.json())
      .then(data => setAnalysis(data))
      .catch(console.error)
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
        {stats.map((stat, i) => (
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
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
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
