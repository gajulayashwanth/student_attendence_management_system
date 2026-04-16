import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Search, Mail, Filter, Loader2, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const status = filter === 'all' ? null : filter;
            const response = await authService.getTeachers(status);
            setStaff(response.data);
        } catch (error) {
            toast.error('Failed to load staff.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [filter]);

    const handleApprove = async (id) => {
        try {
            await authService.approveTeacher(id, true);
            toast.success('Teacher approved successfully!');
            fetchStaff();
        } catch (error) {
            toast.error('Failed to approve teacher.');
        }
    };

    const handleReject = async (id) => {
        try {
            await authService.deleteTeacher(id);
            toast.success('Teacher rejected and removed.');
            fetchStaff();
        } catch (error) {
            toast.error('Failed to reject teacher.');
        }
    };

    const filteredStaff = staff.filter(member =>
        `${member.first_name} ${member.last_name} ${member.email}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 font-sans pb-20 selection:bg-indigo-500/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Staff Registry</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Authorize and audit teacher credentials</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="w-4 h-4 text-gray-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search via Name or Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[11px] font-bold focus:bg-white focus:border-indigo-100 transition-all outline-none shadow-sm"
                        />
                    </div>
                    <div className="flex bg-slate-50 rounded-2xl p-1.5 gap-1">
                        {['all', 'pending', 'approved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                    filter === f
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    </div>
                ) : filteredStaff.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No teachers found.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Identity</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">System Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStaff.map((member, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={member.id}
                                    className="group hover:bg-indigo-50/30 transition-colors cursor-default"
                                >
                                    <td className="px-6 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 uppercase text-xs border-2 border-transparent group-hover:border-indigo-200 group-hover:bg-white transition-all">
                                                {member.first_name?.[0]}{member.last_name?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 leading-none">{member.first_name} {member.last_name}</p>
                                                <div className="flex items-center gap-2 mt-2.5">
                                                    <Mail className="w-3 h-3 text-slate-300" />
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{member.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-8">
                                        {member.is_approved ? (
                                            <span className="inline-flex items-center gap-2 text-[9px] font-black text-teal-600 uppercase tracking-tighter bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                                                Authorized
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 text-[9px] font-black text-amber-500 uppercase tracking-tighter bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                Awaiting
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-8 text-right">
                                        {!member.is_approved ? (
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleApprove(member.id)}
                                                    className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(member.id)}
                                                    className="px-5 py-2.5 bg-white text-rose-500 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleReject(member.id)}
                                                className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Remove teacher"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StaffManagement;
