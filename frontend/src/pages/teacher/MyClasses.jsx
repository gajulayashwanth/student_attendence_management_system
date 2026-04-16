import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import {
    Users, TrendingUp, ChevronRight, UserCheck, UserX, Activity, Loader2
} from 'lucide-react';
import subjectService from '../../services/subjectService';
import attendanceService from '../../services/attendanceService';

const MyClasses = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await subjectService.getMySubjects();
                setSubjects(response.data);
                if (response.data.length > 0) {
                    setSelectedSubject(response.data[0]);
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
        if (!selectedSubject) return;
        const fetchClassData = async () => {
            setChartLoading(true);
            try {
                const today = new Date();
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const weekly = [];

                for (let i = 4; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    try {
                        const res = await attendanceService.getDaily(selectedSubject.id, dateStr);
                        weekly.push({
                            day: dayNames[date.getDay()],
                            present: res.data.summary.present,
                            absent: res.data.summary.absent,
                        });
                    } catch {
                        weekly.push({ day: dayNames[date.getDay()], present: 0, absent: 0 });
                    }
                }
                setWeeklyData(weekly);

                const monthRes = await attendanceService.getMonthly(
                    selectedSubject.id, today.getMonth() + 1, today.getFullYear()
                );
                const students = monthRes.data.students || [];
                const totalPresent = students.reduce((sum, s) => sum + s.present, 0);
                const totalAbsent = students.reduce((sum, s) => sum + s.absent, 0);
                const totalAll = totalPresent + totalAbsent;

                setMonthlyStats({
                    totalStudents: selectedSubject.student_count || students.length,
                    avgPresent: students.length > 0 ? Math.round(totalPresent / students.length) : 0,
                    avgAbsent: students.length > 0 ? Math.round(totalAbsent / students.length) : 0,
                    overallPercentage: totalAll > 0 ? Math.round((totalPresent / totalAll) * 100) : 0,
                });
            } catch (error) {
                setWeeklyData([]);
                setMonthlyStats(null);
            } finally {
                setChartLoading(false);
            }
        };
        fetchClassData();
    }, [selectedSubject]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full px-4 overflow-hidden">
            <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="bg-teal-50 p-2 rounded-xl">
                        <Users className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">My Classes</h2>
                </div>

                <div className="space-y-3">
                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border group relative ${
                                selectedSubject?.id === subject.id
                                    ? 'bg-white border-teal-500 shadow-lg translate-x-2'
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`text-sm font-bold ${selectedSubject?.id === subject.id ? 'text-teal-600' : 'text-gray-900'}`}>{subject.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{subject.code} • {subject.student_count} Students</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${selectedSubject?.id === subject.id ? 'text-teal-600' : 'text-gray-300'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                    {selectedSubject && (
                        <motion.div
                            key={selectedSubject.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8 h-full space-y-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">{selectedSubject.name} Analytics</h2>
                                    <div className="flex items-center gap-6 mt-2 text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">
                                        <span>Code: {selectedSubject.code}</span>
                                        <span className="border-l border-gray-200 pl-4 ml-4">{selectedSubject.student_count} Students Enrolled</span>
                                    </div>
                                </div>
                            </div>

                            {chartLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {monthlyStats && (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <StatCard title="Total Students" value={monthlyStats.totalStudents} icon={Users} color="bg-slate-800" />
                                            <StatCard title="Avg Present" value={monthlyStats.avgPresent} icon={UserCheck} color="bg-teal-600" />
                                            <StatCard title="Avg Absent" value={monthlyStats.avgAbsent} icon={UserX} color="bg-rose-500" />
                                            <StatCard title="Overall Rate" value={`${monthlyStats.overallPercentage}%`} icon={Activity} color="bg-amber-500" />
                                        </div>
                                    )}

                                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-10 text-gray-800 font-bold text-sm uppercase tracking-widest">
                                            <TrendingUp className="w-4 h-4 text-teal-600" /> Weekly Attendance Comparison
                                        </div>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barGap={8}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                                                    <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                                                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                                                    <Bar name="Present" dataKey="present" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={20} />
                                                    <Bar name="Absent" dataKey="absent" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 shadow-sm group cursor-pointer hover:border-teal-500 hover:shadow-md transition-all"
    >
        <div className="flex justify-between items-start mb-3">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none group-hover:text-teal-600">{title}</p>
            <div className={`p-2 rounded-xl text-white ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
            </div>
        </div>
        <p className="text-2xl font-black text-slate-900 group-hover:text-teal-600 transition-colors tracking-tight">{value}</p>
    </motion.div>
);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 text-white p-3 rounded-xl shadow-2xl space-y-1 text-[10px] font-bold uppercase">
                <p className="text-teal-400">Present Count: {payload[0]?.value}</p>
                <p className="text-rose-400">Absent Count: {payload[1]?.value}</p>
            </div>
        );
    }
    return null;
};
export default MyClasses;
