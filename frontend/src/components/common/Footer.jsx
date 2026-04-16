import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Attend<span className="text-emerald-600">X</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} AttendX Management System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium">
              Teacher Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
