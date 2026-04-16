import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, CheckSquare } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: <UserPlus className="w-8 h-8 text-emerald-600" />,
    title: "Register & Verify",
    description: "Create your designated teacher account. Administration must verify and approve your credentials before access is granted."
  },
  {
    number: "02",
    icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
    title: "Setup Classes",
    description: "Once securely approved, easily map out your classroom environment and align your designated subject rosters."
  },
  {
    number: "03",
    icon: <CheckSquare className="w-8 h-8 text-emerald-600" />,
    title: "Mark in Seconds",
    description: "Use our zero-friction interface to mark daily attendance effortlessly and instantly generate beautiful analytical reports."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3"
          >
            Streamlined Workflow
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900"
          >
            Three simple steps to <br className="hidden md:block" /> absolute control.
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative mt-16">
          <div className="hidden md:block absolute top-[48px] left-[16%] right-[16%] h-[2px] bg-slate-100 z-0"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-slate-50 border-[8px] border-white shadow-sm flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 rounded-full bg-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">{step.icon}</div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {step.number}
                </div>
              </div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
