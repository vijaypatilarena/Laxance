"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="parallax-container" 
      style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        background: '#ffffff',
        position: 'relative',
        zIndex: 1,
        perspective: '1500px',
        overflow: 'hidden'
      }}
    >
      {/* === 3D Premium Background Elements === */}

      {/* Rotating abstract wireframe shell */}
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [360, 0],
          rotateZ: [0, 180],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          border: '1px solid rgba(0,0,0,0.03)',
          background: 'linear-gradient(45deg, rgba(0,0,0,0.01), transparent)',
          transformStyle: 'preserve-3d',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Moving glass orb top-right */}
      <motion.div
        animate={{
          y: [0, 50, -50, 0],
          x: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.03), transparent)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.03)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0,0,0,0.05)',
          zIndex: 1,
        }}
      />

      {/* Abstract geometric stack bottom-left */}
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', zIndex: 0 }}>
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{ 
              duration: 15 + i * 5, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2 
            }}
            style={{
              width: 100 + i * 100,
              height: 100 + i * 100,
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '24%',
              position: 'absolute',
              bottom: 0,
              left: 0,
              transform: `translate(-50%, 50%) rotate(${i * 45}deg)`,
            }}
          />
        ))}
      </div>

      {/* Premium typography section */}
      <motion.div style={{ y, opacity, zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            display: 'inline-block',
            padding: '0.6rem 1.2rem',
            background: 'rgba(0,0,0,0.03)',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: '#666',
            marginBottom: '2rem',
            textTransform: 'uppercase',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            Financial Future is Now
          </div>
          
          <motion.h1 
            style={{ 
              fontSize: 'min(14vw, 10rem)', 
              margin: '0', 
              lineHeight: 0.8,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.07em',
              background: 'linear-gradient(180deg, #000 0%, #333 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              paddingBottom: '0.1em'
            }}
          >
            Laxance
          </motion.h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontSize: 'max(1rem, 1.4vw)', 
            maxWidth: '600px', 
            margin: '2rem auto 3.5rem',
            fontWeight: 400,
            color: '#666',
            letterSpacing: '-0.01em',
            lineHeight: 1.5
          }}
        >
          An intelligent ecosystem for wealth creation. We provide the brainpower, you provide the vision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <button className="btn btn-primary" style={{ padding: '1.4rem 3.5rem', fontSize: '1rem', borderRadius: '100px', letterSpacing: '0.05em', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            GET STARTED
          </button>
          <button className="btn btn-secondary" style={{ padding: '1.4rem 3.5rem', fontSize: '1rem', borderRadius: '100px', letterSpacing: '0.05em', border: '1px solid #ddd', background: 'transparent' }}>
            LEARN MORE
          </button>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ccc',
          zIndex: 10
        }}
      >
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, #ccc, transparent)' }} />
      </motion.div>

      {/* Grid Mesh (center-fading) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
    </section>
  );
}
