"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "£0",
    features: ["Daily tracking", "Basic AI insights", "1 Financial goal", "Limited Chatbot access"],
    btnText: "Start Free",
    popular: false
  },
  {
    name: "Pro",
    price: "£19",
    features: ["Unlimited tracking", "Advanced AI analysis", "5 Financial goals", "Unlimited Chatbot", "Risk tolerance assessment"],
    btnText: "Go Pro",
    popular: true
  },
  {
    name: "Elite",
    price: "£49",
    features: ["Everything in Pro", "Personalized wealth strategies", "unlimited goals", "Priority AI response", "Early access to new features"],
    btnText: "Contact Sales",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="section" style={{ background: '#fafafa' }}>
      <div className="container">
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>Pricing Tiers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ 
                padding: '3rem', 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: plan.popular ? '2px solid #000' : '1px solid #eee',
                position: 'relative'
              }}
            >
              {plan.popular && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>MOST POPULAR</span>
              )}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>
                {plan.price}<span style={{ fontSize: '1rem', fontWeight: 400, color: '#666' }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '2.5rem' }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#444' }}>
                    <Check size={18} /> {f}
                  </li>
                ))}
              </ul>
              <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                {plan.btnText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
