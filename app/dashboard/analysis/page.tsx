"use client";

import { useState, useEffect } from "react";
import { Brain, Zap, ShieldAlert, Loader2 } from "lucide-react";
import { useCurrency } from "@/components/CurrencyContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function AnalysisPage() {
  const { symbol, formatPlain } = useCurrency();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/intelligence-data')
      .then(res => res.json())
      .then(data => setAnalysis(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={40} className="animate-spin" />
        <p style={{ color: '#666' }}>AI is parsing your financial DNA...</p>
      </div>
    );
  }

  if (!analysis) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <p>Unable to generate analysis. Please add some transactions first.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI Deep Analysis</h1>
        <p style={{ color: '#666' }}>Our neural engine has analyzed your habits in real-time.</p>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Expenditure Chart */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #eee', flex: '1 1 450px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Ratio breakdown</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysis.topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analysis.topCategories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {analysis.topCategories.map((d: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: d.color, borderRadius: '2px' }} />
                <span style={{ fontSize: '0.85rem', color: '#444' }}>{d.name}: {formatPlain(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Shifts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '1 1 350px' }}>
          {analysis.shifts.map((shift: any, idx: number) => (
            <div key={idx} style={{ 
              background: shift.type === 'positive' ? '#000' : '#fff', 
              color: shift.type === 'positive' ? '#fff' : '#000', 
              border: shift.type === 'positive' ? 'none' : '1px solid #eee',
              padding: '1.5rem', 
              borderRadius: '16px' 
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', color: shift.type === 'positive' ? '#fff' : '#f59e0b' }}>
                {shift.type === 'positive' ? <Zap size={20} /> : <ShieldAlert size={20} />}
                <h4 style={{ margin: 0, color: shift.type === 'positive' ? '#fff' : '#000' }}>{shift.title}</h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: shift.type === 'positive' ? '#aaa' : '#666', lineHeight: 1.6 }}>
                {shift.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '3rem', 
        background: '#f9f9f9', 
        padding: 'clamp(1.5rem, 5vw, 3rem)', 
        borderRadius: '24px', 
        textAlign: 'center' 
      }}>
        <Brain size={48} style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', marginBottom: '1rem' }}>Wealth Strategy</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto 2rem', color: '#444', lineHeight: 1.6, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
          Based on your data, your savings-to-income ratio is exactly **{analysis.savingsRatio}%**. {analysis.wealthStrategy}
        </p>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem', width: '100%', maxWidth: '300px' }}>Sync with Goals</button>
      </div>
    </div>
  );
}
