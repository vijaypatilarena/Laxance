"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "AI Analysis",
    description: "Our AI brain analyzes your daily expenditure-to-income ratio to identify leaks."
  },
  {
    title: "Goal Roadmap",
    description: "Set a goal, and we'll calculate exactly how much you need to save and invest."
  },
  {
    title: "Interactive Chat",
    description: "Talk to our AI financial assistant about your habits and get instant advice."
  },
  {
    title: "Wealth Building",
    description: "Custom strategies to help you maximize gains and build long-term assets."
  }
];

export default function About() {
  return (
    <section id="about" className="section" style={{ background: '#000', color: '#fff' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#fff' }}>Modern Finance, Reimagined.</h2>
          <p style={{ fontSize: '1.25rem', color: '#888', maxWidth: '800px', margin: '0 auto' }}>
            Laxance isn&apos;t just a spreadsheet. It&apos;s an intelligent platform that understands your goals
            and guides you toward financial freedom with personalized roadmaps.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem' 
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>{feature.title}</h3>
              <p style={{ color: '#aaa', lineHeight: 1.6 }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
