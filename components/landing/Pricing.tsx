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
    <section id="pricing" className="section" style={{ background: '#fff', padding: '10rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: 'max(2.5rem, 4vw)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem' }}>PREMIUM TIERS.</h2>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>Scale your wealth with specialized AI intelligence.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              style={{ 
                padding: '4rem 3rem', 
                backgroundColor: plan.popular ? '#000' : '#ffffff', 
                borderRadius: '32px', 
                border: '1px solid #eee',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: plan.popular ? '0 40px 80px -20px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.02)',
                color: plan.popular ? '#fff' : '#000'
              }}
            >
              {plan.popular && (
                <div style={{ 
                  position: 'absolute', 
                  top: '2rem', 
                  right: '2rem', 
                  backgroundColor: '#fff',
                  color: '#000',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>POPULAR</div>
              )}
              
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600, opacity: 0.7 }}>{plan.name}</h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.04em' }}>
                {plan.price}<span style={{ fontSize: '1rem', fontWeight: 400, color: plan.popular ? '#aaa' : '#666' }}>/mo</span>
              </div>
              
              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', marginBottom: '3rem' }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem', fontSize: '0.95rem', opacity: 0.8 }}>
                      <Check size={16} /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="btn" style={{ 
                width: '100%', 
                justifyContent: 'center',
                padding: '1.2rem',
                borderRadius: '16px',
                background: plan.popular ? '#fff' : '#000',
                color: plan.popular ? '#000' : '#fff',
                fontWeight: 700,
                fontSize: '1rem'
              }}>
                {plan.btnText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
