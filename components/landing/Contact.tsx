"use client";

import { motion } from "framer-motion";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="section" style={{ background: '#000', color: '#fff', padding: '10rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 'max(2.5rem, 4vw)', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>EXPEDITE YOUR GROWTH.</h2>
          <p style={{ color: '#888', marginBottom: '4rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
            Connect with our experts and start your journey toward absolute financial sovereignty.
          </p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Name</label>
                <input type="text" placeholder="John Doe" style={{ padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '16px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email Address</label>
                <input type="email" placeholder="john@example.com" style={{ padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '16px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</label>
              <textarea placeholder="Tell us about your goals..." rows={5} style={{ padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '16px', outline: 'none', resize: 'none' }}></textarea>
            </div>
            <button className="btn" style={{ 
              padding: '1.4rem', 
              justifyContent: 'center', 
              background: '#fff', 
              color: '#000',
              fontWeight: 800,
              fontSize: '1rem',
              borderRadius: '16px',
              marginTop: '1rem',
              transition: 'all 0.3s ease'
            }}>
              SEND TRANSMISSION
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ padding: '6rem 0', background: '#000', color: '#fff', borderTop: '1px solid #111' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4rem' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>LAXANCE</div>
            <p style={{ color: '#555', lineHeight: 1.6, maxWidth: '300px' }}>
              The future of financial intelligence. Built with precision for the modern wealth builder.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>PLATFORM</h4>
              <a href="#about" style={{ color: '#555', fontSize: '0.9rem', transition: 'color 0.2s' }}>About</a>
              <a href="#pricing" style={{ color: '#555', fontSize: '0.9rem', transition: 'color 0.2s' }}>Pricing</a>
              <a href="#faq" style={{ color: '#555', fontSize: '0.9rem', transition: 'color 0.2s' }}>Research</a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>LEGAL</h4>
              <a href="#" style={{ color: '#555', fontSize: '0.9rem', transition: 'color 0.2s' }}>Privacy</a>
              <a href="#" style={{ color: '#555', fontSize: '0.9rem', transition: 'color 0.2s' }}>Terms</a>
              <a href="#" style={{ color: '#555', fontSize: '0.9rem', transition: 'color 0.2s' }}>Cookies</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>CONNECT</h4>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="#" style={{ color: '#fff', opacity: 0.5 }}><Twitter size={20} /></a>
                <a href="#" style={{ color: '#fff', opacity: 0.5 }}><Linkedin size={20} /></a>
                <a href="#" style={{ color: '#fff', opacity: 0.5 }}><Github size={20} /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid #111', marginTop: '6rem', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#333', fontSize: '0.85rem' }}>
          <div>&copy; {new Date().getFullYear()} Laxance Inc. Built for the future.</div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>SECURE BY DESIGN</span>
            <span>POWERED BY AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
