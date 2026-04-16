import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
    BookOpen, Users, CheckCircle2, XCircle, User, CalendarDays, Percent, Search, Loader2
} from 'lucide-react';
import subjectService from '../../services/subjectService';
import studentService from '../../services/studentService';
import attendanceService from '../../services/attendanceService';

const COLORS = { present: '#0d9488', absent: '#f43f5e' };

export default function DashboardOverview() {
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [activeSubjectId, setActiveSubjectId] = useState(null);
    const [activeStudentId, setActiveStudentId] = useState(null);
    const [studentStats, setStudentStats] = useState(null);
    const [dailyRecords, setDailyRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await subjectService.getMySubjects();
                setSubjects(response.data);
                if (response.data.length > 0) {
                    setActiveSubjectId(response.data[0].id);
                }
            } catch (error) {
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (!activeSubjectId) return;
        const fetchStudents = async () => {
            setStudentLoading(true);
            setActiveStudentId(null);
            setStudentStats(null);
            try {
                const response = await studentService.getBySubject(activeSubjectId);
                setStudents(response.data);
            } catch (error) {
                setStudents([]);
            } finally {
                setStudentLoading(false);
            }
        };
        fetchStudents();
    }, [activeSubjectId]);

    useEffect(() => {
        if (!activeStudentId || !activeSubjectId) return;
        const fetchStudentDetail = async () => {
            setDetailLoading(true);
            try {
                const now = new Date();
                const monthlyRes = await attendanceService.getMonthly(
                    activeSubjectId, now.getMonth() + 1, now.getFullYear()
                );
                const stats = monthlyRes.data.students?.find(
                    s => s.student_id === activeStudentId
                );
                setStudentStats(stats || null);

                const dailyRes = await attendanceService.getDaily(activeSubjectId);
                const records = dailyRes.data.records?.filter(
                    r => r.student === activeStudentId
                ) || [];
                setDailyRecords(records);
            } catch (error) {
                setStudentStats(null);
                setDailyRecords([]);
            } finally {
                setDetailLoading(false);
            }
        };
        fetchStudentDetail();
    }, [activeStudentId, activeSubjectId]);

    const activeSubject = subjects.find(s => s.id === activeSubjectId);
    const activeStudent = students.find(s => s.id === activeStudentId);

    const filteredStudents = students.filter(s =>
        `${s.first_name} ${s.last_name} ${s.roll_number}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const getPieData = () => {
        if (!studentStats) return [];
        return [
            { name: 'Present', value: studentStats.present, color: COLORS.present },
            { name: 'Absent', value: studentStats.absent, color: COLORS.absent }
        ];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 pb-6">

            <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
                {subjects.map((subject) => (
                    <button
                        key={subject.id}
                        onClick={() => setActiveSubjectId(subject.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all whitespace-nowrap ${
                            activeSubjectId === subject.id
                                ? 'bg-teal-900 border-teal-900 text-white shadow-lg shadow-teal-900/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50'
                        }`}
                    >
                        <BookOpen className={`w-5 h-5 ${activeSubjectId === subject.id ? 'text-teal-400' : 'text-slate-400'}`} />
                        <div className="text-left">
                            <p className="text-sm font-bold leading-tight">{subject.name}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${activeSubjectId === subject.id ? 'text-teal-200' : 'text-slate-400'}`}>
                                {subject.code} • {subject.student_count} Students
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

                <div className="w-full lg:w-80 flex flex-col bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden shrink-0">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative group">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-teal-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1 hide-scrollbar">
                        {studentLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-xs text-slate-400">No students found</p>
                            </div>
                        ) : (
                            filteredStudents.map((student) => {
                                const isActive = activeStudentId === student.id;
                                return (
                                    <button
                                        key={student.id}
                                        onClick={() => setActiveStudentId(student.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                                            isActive
                                                ? 'bg-teal-50 border-teal-200 shadow-sm'
                                                : 'bg-white border-transparent hover:bg-slate-50'
                                        } border`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-sm font-bold ${isActive ? 'text-teal-900' : 'text-slate-700'}`}>{student.first_name} {student.last_name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{student.roll_number}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
                    <AnimatePresence mode="wait">
                        {detailLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center"
                            >
                                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                            </motion.div>
                        ) : activeStudent && studentStats ? (
                            <motion.div
                                key={activeStudent.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1 flex flex-col p-8 overflow-y-auto"
                            >
                                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 border-4 border-white shadow-md">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">{activeStudent.first_name} {activeStudent.last_name}</h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Roll: {activeStudent.roll_number}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activeSubject?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {dailyRecords.length > 0 && (
                                    <>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Today's Record</h4>
                                        <div className="flex gap-3 mb-10">
                                            {dailyRecords.map((record, idx) => (
                                                <div key={idx} className="flex flex-col items-center justify-center bg-slate-50 py-4 px-6 rounded-2xl border border-slate-100">
                                                    {record.status === 'PRESENT' ? (
                                                        <CheckCircle2 className="w-7 h-7 text-teal-500" />
                                                    ) : (
                                                        <XCircle className="w-7 h-7 text-rose-500" />
                                                    )}
                                                    <span className="text-[10px] font-black text-slate-400 uppercase mt-2">{record.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 w-full text-center">Attendance Ratio</h4>
                                        <div className="h-40 w-40 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={getPieData()}
                                                        innerRadius={55}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {getPieData().map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-2xl font-black text-slate-800">{studentStats.percentage}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex-1 flex items-center gap-4 bg-teal-50/50 p-5 rounded-3xl border border-teal-100/50">
                                            <div className="p-3 bg-teal-100 rounded-2xl text-teal-600"><CalendarDays className="w-6 h-6" /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-teal-600/70 uppercase tracking-widest mb-1">Present</p>
                                                <p className="text-2xl font-black text-teal-900">{studentStats.present} <span className="text-sm text-teal-700/50">/ {studentStats.total_classes} Days</span></p>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex items-center gap-4 bg-rose-50/50 p-5 rounded-3xl border border-rose-100/50">
                                            <div className="p-3 bg-rose-100 rounded-2xl text-rose-500"><Percent className="w-6 h-6" /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-rose-600/70 uppercase tracking-widest mb-1">Absent</p>
                                                <p className="text-2xl font-black text-rose-900">{studentStats.absent} <span className="text-sm text-rose-700/50">/ {studentStats.total_classes} Days</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center p-8"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                    <Users className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-2">No Student Selected</h3>
                                <p className="text-sm text-slate-400 max-w-xs">Select a student from the sidebar to view their detailed attendance analytics.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
