"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="section" style={{ background: '#000', color: '#fff' }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Ready to build wealth?</h2>
        <p style={{ color: '#888', marginBottom: '3rem', fontSize: '1.25rem' }}>
          Join 10,000+ users who have transformed their financial behavior with Laxance.
        </p>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" placeholder="Name" style={{ padding: '1rem', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
            <input type="email" placeholder="Email" style={{ padding: '1rem', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>
          <textarea placeholder="Message" rows={4} style={{ padding: '1rem', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}></textarea>
          <button className="btn btn-primary" style={{ padding: '1rem', justifyContent: 'center', background: '#fff', color: '#000' }}>Send Message</button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ padding: '4rem 0', background: '#000', color: '#fff', borderTop: '1px solid #222' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>LAXANCE</div>
        <div style={{ color: '#555', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Laxance Inc. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: '#fff' }}>Twitter</a>
          <a href="#" style={{ color: '#fff' }}>LinkedIn</a>
          <a href="#" style={{ color: '#fff' }}>Instagram</a>
        </div>
      </div>
    </footer>
  );
}
