"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Tech Entrepreneur",
    quote: "Laxance helped me clear $20k in debt by identifying exactly where my money was leaking."
  },
  {
    name: "Sarah Chen",
    role: "Product Designer",
    quote: "The car goal roadmap was spot on. I bought my Dream Porsche 3 months earlier than expected."
  },
  {
    name: "Marcus Thorne",
    role: "Freelancer",
    quote: "The chatbot feels like having a private CFO in my pocket. Highly recommended for every saver."
  }
];

export default function Testimonials() {
  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>Trusted by Wealth Builders.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ padding: '3rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}
            >
              <p style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '2rem', color: '#333' }}>&quot;{t.quote}&quot;</p>

              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>{t.name}</strong>
                <span style={{ color: '#777', fontSize: '0.9rem' }}>{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
