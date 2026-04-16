import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="font-bold text-2xl text-slate-900 tracking-tight">
              Attend<span className="text-emerald-600">X</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar;
