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
    <section className="section" style={{ background: '#fafafa', padding: '10rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: 'max(2.5rem, 3.5vw)', fontWeight: 800, letterSpacing: '-0.04em' }}>VALIDATION.</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>Success stories from our global network of wealth builders.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ 
                padding: '3.5rem', 
                backgroundColor: '#fff', 
                borderRadius: '32px', 
                border: '1px solid #eee',
                boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
                {[1, 2, 3, 4, 5].map(star => <div key={star} style={{ width: '6px', height: '6px', background: '#000', borderRadius: '50%' }} />)}
              </div>
              
              <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#000', lineHeight: 1.6, flex: 1, fontWeight: 500 }}>&quot;{t.quote}&quot;</p>

              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700 }}>{t.name}</strong>
                <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
