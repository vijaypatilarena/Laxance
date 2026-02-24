"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Calculator, ArrowRight, CheckCircle2, Trash2 } from "lucide-react";
import { useCurrency } from "@/components/CurrencyContext";

export default function GoalsPage() {
  const { symbol, format, convert, convertToGBP } = useCurrency();
  const [goals, setGoals] = useState<any[]>([]);
  const [currentGoal, setCurrentGoal] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    amount: 0,
    timeline: 0,
    currentSavings: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    riskTolerance: "Medium"
  });

  const [roadmap, setRoadmap] = useState<{
    totalNeeded: number;
    monthlySavingsNeeded: number;
    currentMonthlySurplus: number;
    gap: number;
    isFeasible: boolean;
    suggestions: string[];
  } | null>(null);

  const computeRoadmap = (goalData: any) => {
    const totalNeeded = goalData.amount - goalData.currentSavings;
    const monthlySavingsNeeded = totalNeeded / goalData.timeline;
    const currentMonthlySurplus = goalData.monthlyIncome - goalData.monthlyExpenses;
    const gap = monthlySavingsNeeded - currentMonthlySurplus;

    setRoadmap({
      totalNeeded,
      monthlySavingsNeeded,
      currentMonthlySurplus,
      gap,
      isFeasible: gap <= 0,
      suggestions: [
        gap > 0 ? `Reduce discretionary spending by ${format(gap * 0.6)} monthly.` : "Great! You are on track to exceed your goal.",
        gap > 0 ? `Explore a side hustle or freelance gig to cover the remaining ${format(gap * 0.4)}.` : "Consider investing your surplus in a high-yield savings account.",
        "Diversify 20% of your savings into an index fund for potential 8% annual growth.",
        `Negotiate your current utility bills to save an extra ${format(50)}/month.`
      ]
    });
  };

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals');
      const data = await res.json();
      if (Array.isArray(data)) {
        setGoals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateNew = () => {
    setFormData({
      id: null,
      title: "",
      amount: 0,
      timeline: 0,
      currentSavings: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      riskTolerance: "Medium"
    });
    setMode('form');
    setStep(1);
    setRoadmap(null);
  };

  const handleEdit = (goal: any) => {
    setFormData({
      id: goal.id,
      title: goal.title,
      amount: goal.amount,
      timeline: goal.timeline,
      currentSavings: goal.current_savings,
      monthlyIncome: goal.monthly_income,
      monthlyExpenses: goal.monthly_expenses,
      riskTolerance: goal.risk_tolerance
    });
    setMode('form');
    setStep(1);
    setRoadmap(null);
  };

  const handleSelectGoal = (goal: any) => {
    setCurrentGoal(goal);
    computeRoadmap({
      amount: goal.amount,
      currentSavings: goal.current_savings,
      timeline: goal.timeline,
      monthlyIncome: goal.monthly_income,
      monthlyExpenses: goal.monthly_expenses
    });
    setMode('list');
  };

  const calculateRoadmapAndSave = async () => {
    // Save to Supabase
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          title: formData.title,
          amount: convertToGBP(formData.amount),
          timeline: formData.timeline,
          current_savings: convertToGBP(formData.currentSavings),
          monthly_income: convertToGBP(formData.monthlyIncome),
          monthly_expenses: convertToGBP(formData.monthlyExpenses),
          risk_tolerance: formData.riskTolerance
        })
      });
      
      const saved = await res.json();
      
      if (!res.ok) {
        alert(saved.error || 'Failed to save goal');
        return;
      }

      computeRoadmap(formData);
      setStep(3);
      fetchGoals();
    } catch (err) {
      console.error('Failed to save goal:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const res = await fetch(`/api/goals?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (currentGoal?.id === id) {
          setCurrentGoal(null);
          setRoadmap(null);
        }
        fetchGoals();
      }
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Financial Goals</h1>
          <p style={{ color: '#666' }}>Define your dreams. We&apos;ll build the roadmap.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateNew}>
          Add New Goal
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Goal List */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Active Dreams</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.length > 0 ? goals.map((g) => (
              <div 
                key={g.id} 
                onClick={() => handleSelectGoal(g)}
                style={{ 
                  padding: '1.25rem', 
                  borderRadius: '12px', 
                  border: '1px solid',
                  borderColor: currentGoal?.id === g.id ? '#000' : '#eee',
                  background: currentGoal?.id === g.id ? '#fafafa' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{g.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Target: {format(Number(g.amount))}</div>
                <button 
                  onClick={(e) => handleDelete(g.id, e)}
                  style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: 'transparent', color: '#ccc', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )) : (
              <p style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>No goals yet. Dream big!</p>
            )}
          </div>
        </div>

        {/* Roadmap or Form area */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
          {mode === 'form' ? (
             <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                {/* Form Logic */}
                <div style={{ height: '4px', background: '#f5f5f5', position: 'absolute', top: 0, left: 0, right: 0 }}>
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    style={{ height: '100%', background: '#000' }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#000', color: '#fff', padding: '0.75rem', borderRadius: '12px' }}><Car size={24} /></div>
                        <h2 style={{ fontSize: '1.25rem' }}>{formData.id ? 'Edit Goal' : 'Define New Goal'}</h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Goal Title</label>
                          <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Target Amount ({symbol})</label>
                          <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Months</label>
                            <input type="number" value={formData.timeline} onChange={(e) => setFormData({...formData, timeline: Number(e.target.value)})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Savings ({symbol})</label>
                            <input type="number" value={formData.currentSavings} onChange={(e) => setFormData({...formData, currentSavings: Number(e.target.value)})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Next: Financial Status</button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h2 style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>AI Needs Context</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Monthly Income ({symbol})</label>
                          <input type="number" value={formData.monthlyIncome} onChange={(e) => setFormData({...formData, monthlyIncome: Number(e.target.value)})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Monthly Expenses ({symbol})</label>
                          <input type="number" value={formData.monthlyExpenses} onChange={(e) => setFormData({...formData, monthlyExpenses: Number(e.target.value)})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Risk Tolerance</label>
                          <select value={formData.riskTolerance} onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <option>Low</option><option>Medium</option><option>High</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>Back</button>
                        <button onClick={calculateRoadmapAndSave} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Generate Roadmap</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                       <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <CheckCircle2 size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
                        <h2 style={{ fontSize: '1.5rem' }}>Roadmap Ready</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Successfully saved your goal {formData.title}.</p>
                      </div>
                      <button onClick={() => setMode('list')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>View My Goals</button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          ) : currentGoal ? (
            <div style={{ padding: '2.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem' }}>{currentGoal.title}</h2>
                  <button onClick={() => handleEdit(currentGoal)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Edit Details</button>
               </div>

               {roadmap && (
                 <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                      <div style={{ padding: '1.25rem', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem' }}>MONTHLY TARGET</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{format(roadmap.monthlySavingsNeeded)}</div>
                      </div>
                      <div style={{ padding: '1.25rem', background: '#f9f9f9', borderRadius: '12px' }}>
                        <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem' }}>CURRENT SURPLUS</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{format(roadmap.currentMonthlySurplus)}</div>
                      </div>
                    </div>

                    <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>AI Actionable Roadmap</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {roadmap.suggestions.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '12px', fontSize: '0.9rem' }}>
                          <div style={{ fontWeight: 800 }}>{i + 1}.</div>
                          <div style={{ color: '#444' }}>{s}</div>
                        </div>
                      ))}
                    </div>
                 </>
               )}
            </div>
          ) : (
            <div style={{ padding: '5rem 2rem', textAlign: 'center', color: '#888' }}>
              <Calculator size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p>Select a goal to view your personalized AI roadmap.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
