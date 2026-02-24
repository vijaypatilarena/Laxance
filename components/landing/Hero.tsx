"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface FloatingShapeProps {
  delay?: number;
  initialX?: string | number;
  initialY?: string | number;
  size?: number;
  rotate?: number;
}

const FloatingShape = ({ delay = 0, initialX = 0, initialY = 0, size = 100, rotate = 0 }: FloatingShapeProps) => (
  <motion.div
    initial={{ opacity: 0, x: initialX, y: initialY }}
    animate={{ 
      opacity: 0.15,
      y: [initialY as any, (initialY as any) - 40, initialY as any],
      rotateX: [0, 45, 0],
      rotateY: [0, 90, 0],
      rotateZ: [rotate, rotate + 10, rotate]
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      border: '1px solid rgba(0,0,0,0.1)',
      borderRadius: '16px',
      transformStyle: 'preserve-3d',
      zIndex: -1,
      pointerEvents: 'none'
    }}
  >
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(0,0,0,0.03), transparent)',
      borderRadius: '16px',
      transform: 'translateZ(30px)',
      border: '1px solid rgba(0,0,0,0.05)',
      backdropFilter: 'blur(2px)'
    }} />
  </motion.div>
);

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
        perspective: '1000px',
        overflow: 'hidden'
      }}
    >
      {/* === 3D Animated Background Elements === */}

      {/* Slow-rotating wireframe torus (top-right) */}
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 180],
          rotateZ: [0, 90],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '8%',
          right: '10%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.06)',
          transformStyle: 'preserve-3d',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Inner ring of the torus */}
        <div style={{
          position: 'absolute',
          inset: '30%',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.04)',
          transform: 'rotateX(75deg)',
        }} />
        <div style={{
          position: 'absolute',
          inset: '15%',
          borderRadius: '50%',
          border: '1px dashed rgba(0,0,0,0.03)',
          transform: 'rotateY(60deg)',
        }} />
      </motion.div>

      {/* Glassmorphic orb (bottom-left) */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.04), rgba(0,0,0,0.01) 60%, transparent)',
          backdropFilter: 'blur(1px)',
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Small floating cube (mid-left) */}
      <motion.div
        animate={{
          rotateX: [0, 180, 360],
          rotateY: [0, 90, 180],
          y: [0, -25, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: 'absolute',
          top: '35%',
          left: '15%',
          width: '60px',
          height: '60px',
          transformStyle: 'preserve-3d',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Front face */}
        <div style={{
          position: 'absolute', inset: 0,
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.02), transparent)',
          transform: 'translateZ(30px)',
        }} />
        {/* Back face */}
        <div style={{
          position: 'absolute', inset: 0,
          border: '1px solid rgba(0,0,0,0.04)',
          borderRadius: '8px',
          transform: 'translateZ(-30px)',
        }} />
      </motion.div>

      {/* Dotted orbit path (center) */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '600px',
          height: '600px',
          marginLeft: '-300px',
          marginTop: '-300px',
          borderRadius: '50%',
          border: '1px dashed rgba(0,0,0,0.03)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Orbiting dot */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            marginLeft: '-4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)',
          }}
        />
      </motion.div>

      {/* Small glassmorphic orb (top-left) */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: 'absolute',
          top: '12%',
          left: '20%',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 30%, rgba(0,0,0,0.03), transparent 70%)',
          border: '1px solid rgba(0,0,0,0.04)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Floating diamond (bottom-right) */}
      <motion.div
        animate={{
          rotateZ: [45, 55, 45],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '50px',
          height: '50px',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '4px',
          transform: 'rotate(45deg)',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.02), transparent)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle ambient glow (right) */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '35vw',
          height: '35vw',
          background: 'radial-gradient(circle, rgba(0,0,0,0.025) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle ambient glow (left) */}
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -20, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: '30vw',
          height: '30vw',
          background: 'radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Grid Mesh (center-fading) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.012) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(circle at center, black, transparent 75%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <motion.div style={{ y, opacity, zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1 
            style={{ 
              fontSize: 'min(12vw, 9rem)', 
              margin: '0', 
              lineHeight: 0.85,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.06em',
              background: 'linear-gradient(180deg, #000 0%, #444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Laxance
          </motion.h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontSize: '1.25rem', 
            maxWidth: '540px', 
            margin: '2.5rem auto 3rem',
            fontWeight: 400,
            color: '#666',
            letterSpacing: '-0.01em'
          }}
        >
          Master your money with AI. Track, analyze, and build long-term wealth with data-driven strategies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
        >
          <button className="btn btn-primary" style={{ padding: '1.2rem 2.8rem', fontSize: '1rem', borderRadius: '100px', letterSpacing: '0.05em' }}>GET STARTED</button>
          <button className="btn btn-secondary" style={{ padding: '1.2rem 2.8rem', fontSize: '1rem', borderRadius: '100px', letterSpacing: '0.05em', border: '1px solid #eee' }}>WATCH DEMO</button>
        </motion.div>
      </motion.div>
      
      {/* Bottom Gradient Fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '20vh',
        background: 'linear-gradient(to top, #ffffff, transparent)',
        zIndex: 5
      }} />
    </section>
  );
}
