"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "How does the AI analyze my spending?",
    a: "Our AI uses pattern recognition to categorize your transactions and compares them against wealth-building benchmarks. It identifies areas where you can cut back without sacrificing quality of life."
  },
  {
    q: "Is my financial data secure?",
    a: "Absolutely. We use bank-level encryption and never store your raw credentials. Authentication is handled by Clerk, ensuring industry-standard security."
  },
  {
    q: "Can I set multiple financial goals?",
    a: "Yes, Pro and Elite users can set multiple simultaneous goals, and our AI will prioritize them based on your timeline and risk tolerance."
  },
  {
    q: "How does the car purchase calculator work?",
    a: "It takes your current income, expenses, and savings rate to calculate the exact monthly savings needed. It also suggests income-diversification strategies if your current rate is insufficient."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section" style={{ background: '#fff', padding: '10rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'max(2.5rem, 3.5vw)', fontWeight: 800, letterSpacing: '-0.04em' }}>INTELLECTUAL BASE.</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>Everything you need to know about our ecosystem.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '20px', 
              overflow: 'hidden',
              marginBottom: '0.5rem',
              transition: 'all 0.3s ease'
            }}>
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                style={{ 
                  width: '100%', 
                  padding: '1.8rem 2rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  background: open === i ? 'rgba(0,0,0,0.02)' : 'transparent',
                  color: '#000'
                }}
              >
                {faq.q}
                {open === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ padding: '0 2rem 2rem 2rem', color: '#666', lineHeight: 1.7, fontSize: '0.95rem' }}
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
