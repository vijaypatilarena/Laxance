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
    <section id="faq" className="section" style={{ background: '#fff' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>Common Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #eee' }}>
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                style={{ 
                  width: '100%', 
                  padding: '1.5rem 0', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                {faq.q}
                {open === i ? <ChevronUp /> : <ChevronDown />}
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ paddingBottom: '1.5rem', color: '#616161', lineHeight: 1.6 }}
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
