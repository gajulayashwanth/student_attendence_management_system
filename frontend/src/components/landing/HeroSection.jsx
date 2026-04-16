import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}<span className="animate-pulse">|</span></span>;
};

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 selection:bg-emerald-500/30">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[3, 2, 1]} />
          <Float speed={2} rotationIntensity={2} floatIntensity={2}>
            <Sphere args={[1, 64, 64]} position={[-2, 0, -2]}>
              <MeshDistortMaterial color="#6366f1" attach="material" distort={0.4} speed={2} roughness={0.2} />
            </Sphere>
          </Float>
          <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
            <Sphere args={[0.8, 64, 64]} position={[2, 1, -3]}>
              <MeshDistortMaterial color="#10b981" attach="material" distort={0.5} speed={3} roughness={0.2} />
            </Sphere>
          </Float>
          <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
            <Sphere args={[0.6, 64, 64]} position={[1, -1.5, -1]}>
              <MeshDistortMaterial color="#fbbf24" attach="material" distort={0.3} speed={1.5} roughness={0.2} />
            </Sphere>
          </Float>
        </Canvas>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            Modern Attendance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              <TypewriterText text="Simplified & Secured." />
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A premium, zero-friction attendance management system designed exclusively for educational professionals. Track, analyze, and manage student presence with absolute precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all duration-300"
            >
              Start Managing Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
