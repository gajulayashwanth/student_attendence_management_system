import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart3, Users, Zap } from 'lucide-react';

const featuresData = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
    title: "Secure Access",
    description: "Strict role-based authentication. Teachers must be explicitly approved by administration before accessing the dashboard.",
    color: "bg-emerald-100",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
    title: "Premium Analytics",
    description: "Grafana-inspired reporting dashboards providing deep insights into daily and monthly student attendance trends.",
    color: "bg-blue-100",
  },
  {
    icon: <Users className="w-8 h-8 text-amber-500" />,
    title: "Multi-Subject Tracking",
    description: "Seamlessly manage separate attendance records for multiple subjects and classes from a single unified interface.",
    color: "bg-amber-100",
  },
  {
    icon: <Zap className="w-8 h-8 text-rose-500" />,
    title: "Zero Friction UI",
    description: "Lightning-fast, pixel-perfect interface designed to minimize the time spent marking attendance.",
    color: "bg-rose-100",
  }
];

const FlipCard = ({ feature, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative w-full h-[320px] rounded-2xl cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center p-8"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
            {feature.icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 text-center">{feature.title}</h3>
          <p className="text-slate-400 mt-4 text-sm font-medium">Hover for details</p>
        </div>

        <div 
          className="absolute inset-0 w-full h-full bg-slate-900 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          <h3 className="text-xl font-bold text-emerald-400 mb-4">{feature.title}</h3>
          <p className="text-slate-300 leading-relaxed text-sm mb-6">
            {feature.description}
          </p>
          <div className="mt-auto px-5 py-2 bg-white/10 text-white rounded-full font-semibold text-sm">
            Learn More
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Enterprise-Grade Capabilities
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            Everything you need to manage student records accurately, securely, and efficiently.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <FlipCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
