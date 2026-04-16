import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Save, RotateCcw, BookOpen, GraduationCap, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactConfetti from 'react-confetti';
import useStore from '../../store/useStore';
import studentService from '../../services/studentService';
import attendanceService from '../../services/attendanceService';

const MarkAttendance = () => {
    const activeSubject = useStore((state) => state.activeSubject);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!activeSubject) return;
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await studentService.getBySubject(activeSubject.id);
                const studentsWithStatus = response.data.map(s => ({
                    ...s,
                    status: 'PRESENT'
                }));
                setStudents(studentsWithStatus);
            } catch (error) {
                toast.error('Failed to load students.');
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [activeSubject]);

    const updateStatus = (id, newStatus) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const resetAll = () => {
        setStudents(prev => prev.map(s => ({ ...s, status: 'PRESENT' })));
        toast.success('All statuses reset to Present.');
    };

    const handleSave = async () => {
        if (students.length === 0) return;
        setSaving(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const payload = {
                subject_id: activeSubject.id,
                date: today,
                records: students.map(s => ({
                    student_id: s.id,
                    status: s.status
                }))
            };
            const response = await attendanceService.markBulk(payload);
            toast.success(`Attendance saved! ${response.data.created} new, ${response.data.updated} updated.`);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        } catch (error) {
            toast.error('Failed to save attendance.');
        } finally {
            setSaving(false);
        }
    };

    const presentCount = students.filter(s => s.status === 'PRESENT').length;
    const absentCount = students.filter(s => s.status === 'ABSENT').length;

    const filteredStudents = students.filter(s =>
        `${s.first_name} ${s.last_name} ${s.roll_number}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 px-4 pb-20 transition-colors duration-300 font-sans selection:bg-teal-500/10">
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}
            <AnimatePresence mode="wait">
                {!activeSubject ? (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-40 bg-white border border-gray-100 rounded-[3rem]"
                    >
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] mb-8">
                            <GraduationCap className="w-16 h-16 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Subject Selection Required</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">Initialize a classroom session from the launchpad</p>
                    </motion.div>
                ) : loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-40"
                    >
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative">
                            <div className="flex items-center gap-6">
                                <div className="bg-teal-600 p-5 rounded-[2rem] shadow-xl shadow-teal-100">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-teal-100">Active Roster</span>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Code: {activeSubject.code}</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{activeSubject.name}</h2>
                                </div>
                            </div>
                            <div className="relative w-full md:w-96 group">
                                <Search className="w-4 h-4 text-slate-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-teal-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Filter by Student Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[11px] font-bold focus:bg-white focus:border-teal-100 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[3rem] shadow-sm overflow-hidden p-6">
                            {filteredStudents.length === 0 ? (
                                <div className="text-center py-16">
                                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm text-slate-400">No students enrolled in this subject yet.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Information</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredStudents.map((student) => (
                                            <tr key={student.id} className="group hover:bg-slate-50/20 transition-colors">
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-5 text-left">
                                                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 uppercase text-xs">
                                                            {student.first_name[0]}
                                                        </div>
                                                        <div className="text-left">
                                                            <h3 className="text-sm font-black text-slate-900 leading-none">{student.first_name} {student.last_name}</h3>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-2.5">Roll: {student.roll_number}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto">
                                                        <SegmentButton active={student.status === 'PRESENT'} onClick={() => updateStatus(student.id, 'PRESENT')} label="P" color="bg-teal-600" />
                                                        <SegmentButton active={student.status === 'ABSENT'} onClick={() => updateStatus(student.id, 'ABSENT')} label="A" color="bg-rose-600" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-gray-100 p-8 px-12 rounded-[3.5rem] shadow-sm">
                            <div className="flex gap-12 mb-8 md:mb-0">
                                <SummaryItem label="Present" color="bg-teal-500" count={presentCount} />
                                <SummaryItem label="Absent" color="bg-rose-500" count={absentCount} />
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={resetAll}
                                    className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" /> Clear All
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || students.length === 0}
                                    className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-teal-600 shadow-xl shadow-slate-100 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? 'Saving...' : 'Commit Attendance'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SegmentButton = ({ active, onClick, label, color }) => (
    <button
        onClick={onClick}
        className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${active ? `${color} text-white shadow-lg` : 'text-slate-400 hover:text-slate-600'}`}
    >
        {label === 'P' ? 'Present' : 'Absent'}
    </button>
);

const SummaryItem = ({ label, color, count }) => (
    <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm ring-4 ring-slate-50`}></div>
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{count} {label}</span>
    </div>
);

export default MarkAttendance;
