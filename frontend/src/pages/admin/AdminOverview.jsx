import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, GraduationCap, Activity, AlertCircle,
    ArrowUpRight, ShieldCheck, Loader2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import attendanceService from '../../services/attendanceService';

const AdminOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await attendanceService.getDashboardStats();
                setStats(response.data);
            } catch (error) {
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Licensed Staff', value: stats?.total_teachers || 0, icon: Users, color: 'bg-indigo-600', trend: 'Active' },
        { label: 'Total Enrolled', value: stats?.total_students || 0, icon: GraduationCap, color: 'bg-teal-600', trend: 'Verified' },
        { label: 'Today Attendance', value: `${stats?.today_percentage || 0}%`, icon: Activity, color: 'bg-amber-500', trend: 'Today' },
        { label: 'Pending Approval', value: stats?.pending_teachers || 0, icon: AlertCircle, color: 'bg-rose-500', trend: 'Immediate' },
    ];

    return (
        <div className="space-y-8 font-sans pb-12 selection:bg-indigo-500/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                {stat.trend}
                            </div>
                        </div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="xl:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">System Summary</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time institutional metrics</p>
                        </div>
                        <button
                            onClick={() => navigate('/secret-hq-console/audit')}
                            className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-5 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            View Audit <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Subjects</p>
                            <p className="text-3xl font-black text-slate-900">{stats?.total_subjects || 0}</p>
                        </div>
                        <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100 text-center">
                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">Present Today</p>
                            <p className="text-3xl font-black text-teal-900">{stats?.today_present || 0}</p>
                        </div>
                        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 text-center">
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Absent Today</p>
                            <p className="text-3xl font-black text-rose-900">{(stats?.today_total || 0) - (stats?.today_present || 0)}</p>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <ShieldCheck className="w-10 h-10 mb-6 text-indigo-400" />
                            <h3 className="text-lg font-black tracking-tight leading-tight mb-4 uppercase">System Control Integrity</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
                                All teacher registrations and audit logs are synchronized in real-time. Unapproved sessions are automatically terminated.
                            </p>
                            <button
                                onClick={() => navigate('/secret-hq-console/audit')}
                                className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                            >
                                Audit Registry
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm"
                    >
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Quick Actions</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Approve Teachers', path: '/secret-hq-console/staff', badge: stats?.pending_teachers },
                                { label: 'Manage Students', path: '/secret-hq-console/students' },
                                { label: 'Assign Subjects', path: '/secret-hq-console/assignments' },
                            ].map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => navigate(action.path)}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all group"
                                >
                                    {action.label}
                                    <div className="flex items-center gap-2">
                                        {action.badge > 0 && (
                                            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{action.badge}</span>
                                        )}
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
