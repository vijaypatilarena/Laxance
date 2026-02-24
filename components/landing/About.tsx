"use client";

import { motion } from "framer-motion";
import { Brain, Target, MessageSquare, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Brain size={32} />,
    title: "AI Analysis",
    description: "Our neural engine scans your financial flow to pinpoint exactly where you can optimize."
  },
  {
    icon: <Target size={32} />,
    title: "Goal Roadmap",
    description: "Visualize your path to freedom. We calculate every step needed to hit your targets."
  },
  {
    icon: <MessageSquare size={32} />,
    title: "Quantum Chat",
    description: "Real-time dialogue with a specialized financial AI that understands your unique context."
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Wealth Growth",
    description: "Dynamic strategies designed to help you transition from saving to true wealth creation."
  }
];

export default function About() {
  return (
    <section id="about" className="section" style={{ background: '#000', color: '#fff', padding: '10rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '6rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'max(2.5rem, 4vw)', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
              REENGINEERING FINANCE.
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '700px', lineHeight: 1.6 }}>
              Laxance is an intelligent layer for your capital. We leverage advanced AI to turn raw data into actionable wealth-building systems.
            </p>
          </motion.div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              style={{ 
                padding: '3rem 2rem', 
                background: 'linear-gradient(135deg, #0a0a0a 0%, #000 100%)',
                border: '1px solid #1a1a1a', 
                borderRadius: '24px',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ color: '#fff', marginBottom: '2rem', opacity: 0.9 }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700 }}>{feature.title}</h3>
              <p style={{ color: '#777', lineHeight: 1.6, fontSize: '0.95rem' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
