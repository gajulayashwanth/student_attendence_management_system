import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

export default function PendingApprovalPage() {
    const navigate = useNavigate();
    const { user, checkApproval, logout } = useAuthStore();
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        if (user?.is_approved) {
            toast.success('Your account has been approved!');
            navigate('/teacher/selection');
            return;
        }

        const interval = setInterval(async () => {
            setChecking(true);
            const result = await checkApproval();
            setChecking(false);

            if (result?.is_approved) {
                toast.success('Your account has been approved! Welcome aboard!');
                navigate('/teacher/selection');
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [user, checkApproval, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden min-h-[550px]">

                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 overflow-hidden relative">
                    <img
                        src="https://img.freepik.com/premium-photo/vector-illustration-office_996136-2465.jpg"
                        alt="Waiting Lobby"
                        className="w-full h-full object-cover absolute inset-0 opacity-90"
                    />
                </div>

                <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center items-center text-center">

                    <div className="w-20 h-20 bg-[#f3f4f6] rounded-full flex items-center justify-center mb-8 relative">
                        <Clock className="w-10 h-10 text-[#6b7aff]" strokeWidth={2.5} />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-[#6b7aff]/30 rounded-full border-dashed"
                        />
                    </div>

                    <h2 className="text-[28px] font-bold text-gray-900 mb-4">
                        Pending Approval
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-sm mx-auto">
                        Your registration was successful. Because this is a restricted institutional portal, your account must be verified by an administrator before you can access the dashboard.
                    </p>

                    {user && (
                        <p className="text-gray-400 text-xs mb-6">
                            Registered as: <span className="font-medium text-gray-600">{user.email}</span>
                        </p>
                    )}

                    <div className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-emerald-50 rounded-full">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                            Verification in progress
                        </span>
                    </div>

                    {checking && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-gray-400 mb-6"
                        >
                            Checking approval status...
                        </motion.p>
                    )}

                    <p className="text-xs text-gray-400 mb-8">
                        Auto-checking every 30 seconds
                    </p>

                    <button
                        onClick={handleLogout}
                        className="w-full max-w-xs py-3.5 bg-[#f3f4f6] hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors border-none"
                    >
                        <LogOut className="w-5 h-5" strokeWidth={2.5} />
                        Return to Login
                    </button>

                </div>
            </div>
        </div>
    );
}
