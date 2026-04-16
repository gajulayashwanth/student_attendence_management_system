import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Lock, Mail, ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const SecretAdminLogin = () => {
    const navigate = useNavigate();
    const { adminLogin, isLoading } = useAuthStore();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminLogin(formData);
            toast.success('Access granted.');
            navigate('/secret-hq-console/analytics');
        } catch (err) {
            setShake(true);
            toast.error('Authorization denied.');
            setTimeout(() => {
                setShake(false);
                navigate('/');
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    x: shake ? [0, -10, 10, -10, 10, 0] : 0
                }}
                transition={shake ? { duration: 0.4 } : { duration: 0.3 }}
                className="w-full max-w-md bg-white p-10 md:p-14 rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/50 relative"
            >
                <div className="mb-12">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200">
                        <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Admin Core</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Authorization Required for System Entry</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrator ID</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                            <input
                                type="email"
                                required
                                disabled={isLoading}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-200 transition-all outline-none disabled:opacity-50"
                                placeholder="root@attendx.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                            <input
                                type="password"
                                required
                                disabled={isLoading}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-200 transition-all outline-none disabled:opacity-50"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-slate-100 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>Authorize <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-50">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2 group"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Base
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SecretAdminLogin;
