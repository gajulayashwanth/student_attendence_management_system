import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Download, FileText, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import subjectService from '../../services/subjectService';
import attendanceService from '../../services/attendanceService';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
        <div style={{
            background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '12px 16px', minWidth: 160,
        }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                    { key: 'total', color: '#818cf8', label: 'Total' },
                    { key: 'present', color: '#34d399', label: 'Present' },
                    { key: 'absent', color: '#fb923c', label: 'Absent' },
                ].map(({ key, color, label: lbl }) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 99, background: color, display: 'inline-block' }} />
                            {lbl}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 800, color }}>{d?.[key]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Reports() {
    const [viewMode, setViewMode] = useState('monthly');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await subjectService.getMySubjects();
                setSubjects(response.data);
                if (response.data.length > 0) {
                    setSelectedSubjectId(response.data[0].id);
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
        if (!selectedSubjectId) return;
        const fetchData = async () => {
            setChartLoading(true);
            try {
                if (viewMode === 'monthly') {
                    const now = new Date();
                    const response = await attendanceService.getMonthly(
                        selectedSubjectId, now.getMonth() + 1, now.getFullYear()
                    );
                    const students = response.data.students || [];
                    const totalStudents = students.length;
                    const totalPresent = students.reduce((sum, s) => sum + s.present, 0);
                    const totalAbsent = students.reduce((sum, s) => sum + s.absent, 0);
                    const totalClasses = students.length > 0 ? students[0].total_classes : 0;

                    const monthlyData = [];
                    for (let day = 1; day <= totalClasses; day++) {
                        monthlyData.push({
                            label: `Day ${day}`,
                            total: totalStudents,
                            present: Math.round(totalPresent / (totalClasses || 1)),
                            absent: Math.round(totalAbsent / (totalClasses || 1)),
                        });
                    }
                    setChartData(monthlyData.length > 0 ? monthlyData : [{ label: 'No Data', total: 0, present: 0, absent: 0 }]);
                } else {
                    const today = new Date();
                    const dailyData = [];
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                    for (let i = 4; i >= 0; i--) {
                        const date = new Date(today);
                        date.setDate(today.getDate() - i);
                        const dateStr = date.toISOString().split('T')[0];

                        try {
                            const response = await attendanceService.getDaily(selectedSubjectId, dateStr);
                            const summary = response.data.summary;
                            dailyData.push({
                                label: dayNames[date.getDay()],
                                total: summary.total,
                                present: summary.present,
                                absent: summary.absent,
                            });
                        } catch {
                            dailyData.push({
                                label: dayNames[date.getDay()],
                                total: 0, present: 0, absent: 0,
                            });
                        }
                    }
                    setChartData(dailyData);
                }
            } catch (error) {
                setChartData([{ label: 'No Data', total: 0, present: 0, absent: 0 }]);
            } finally {
                setChartLoading(false);
            }
        };
        fetchData();
    }, [selectedSubjectId, viewMode]);

    const handleDownloadDaily = async () => {
        if (!selectedSubjectId) return;
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await attendanceService.getDaily(selectedSubjectId, today);
            const records = response.data.records || [];
            
            if (records.length === 0) {
                toast.error("No attendance recorded for today.");
                return;
            }

            let csv = 'Roll Number,First Name,Last Name,Status,Date\n';
            records.forEach(r => {
                csv += `${r.student_detail?.roll_number},"${r.student_detail?.first_name}","${r.student_detail?.last_name}",${r.status},${r.date}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `Daily_Attendance_${today}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("Daily report downloaded!");
        } catch (error) {
            toast.error("Failed to download daily report.");
        }
    };

    const handleDownloadMonthly = async () => {
        if (!selectedSubjectId) return;
        try {
            const now = new Date();
            const response = await attendanceService.getMonthly(
                selectedSubjectId, now.getMonth() + 1, now.getFullYear()
            );
            const students = response.data.students || [];
            
            if (students.length === 0) {
                toast.error("No data available for this month.");
                return;
            }

            let csv = 'Roll Number,Name,Total Classes,Present,Absent,Percentage\n';
            students.forEach(s => {
                csv += `${s.roll_number},"${s.name}",${s.total_classes},${s.present},${s.absent},${s.percentage}%\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `Monthly_Report_${now.getMonth() + 1}_${now.getFullYear()}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("Monthly report downloaded!");
        } catch (error) {
            toast.error("Failed to download monthly report.");
        }
    };

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
    const last = chartData.length > 0 ? chartData[chartData.length - 1] : { total: 0 };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: '#f8fafc', minHeight: '100vh', padding: '28px 20px 48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Attendance Reports</h1>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Track and analyze student attendance patterns</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 12, padding: 3 }}>
                        {['daily', 'monthly'].map(m => (
                            <button key={m} onClick={() => setViewMode(m)} style={{
                                padding: '6px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                                background: viewMode === m ? 'white' : 'transparent',
                                color: viewMode === m ? '#0f172a' : '#94a3b8',
                                boxShadow: viewMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.15s',
                            }}>{m}</button>
                        ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedSubjectId || ''}
                            onChange={e => setSelectedSubjectId(Number(e.target.value))}
                            style={{
                                appearance: 'none', background: 'white', border: '1.5px solid #e2e8f0',
                                borderRadius: 12, padding: '8px 36px 8px 14px', fontSize: 12,
                                fontWeight: 700, color: '#334155', outline: 'none', cursor: 'pointer',
                            }}
                        >
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <ChevronDown size={13} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            <div style={{
                background: 'white', borderRadius: 24, padding: '28px 28px 16px',
                border: '1.5px solid #e2e8f0', marginBottom: 20,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Attendance Movement</h2>
                        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                            {selectedSubject?.name || 'Select a subject'} · {viewMode === 'monthly' ? 'This Month' : 'Last 5 Days'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {[
                            { color: '#818cf8', label: 'Total' },
                            { color: '#34d399', label: 'Present' },
                            { color: '#fb923c', label: 'Absent' },
                        ].map(({ color, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                <svg width="30" height="10" style={{ overflow: 'visible' }}>
                                    <line x1="0" y1="5" x2="30" y2="5" stroke={color} strokeWidth="2.5" />
                                    <circle cx="15" cy="5" r="3.5" fill={color} />
                                </svg>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {chartLoading ? (
                    <div className="flex items-center justify-center h-[340px]">
                        <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={340}>
                        <LineChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 700 }} dy={12} interval={viewMode === 'monthly' ? 4 : 0} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 700 }} domain={[0, 'dataMax + 20']} width={34} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1.5, strokeDasharray: '4 3' }} />
                            {last.total > 0 && (
                                <ReferenceLine
                                    y={Math.round(last.total * 0.85)}
                                    stroke="#fbbf24" strokeDasharray="6 4" strokeWidth={1.5}
                                    label={{ value: '85% target', position: 'insideTopRight', fontSize: 10, fill: '#fbbf24', fontWeight: 700 }}
                                />
                            )}
                            <Line type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#818cf8', stroke: 'white', strokeWidth: 2.5 }} />
                            <Line type="monotone" dataKey="present" stroke="#34d399" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#34d399', stroke: 'white', strokeWidth: 2.5 }} />
                            <Line type="monotone" dataKey="absent" stroke="#fb923c" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#fb923c', stroke: 'white', strokeWidth: 2.5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {[
                    { icon: Calendar, title: 'Daily Snapshot', desc: "Download today's attendance sheet", onClick: handleDownloadDaily },
                    { icon: FileText, title: 'Monthly Review', desc: 'Full archived report for the month', onClick: handleDownloadMonthly },
                ].map(({ icon: Icon, title, desc, onClick }) => (
                    <motion.div
                        key={title}
                        onClick={onClick}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 20,
                            padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            cursor: 'pointer', textAlign: 'left',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 13,
                                background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon size={18} color="#64748b" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{title}</p>
                                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{desc}</p>
                            </div>
                        </div>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10, background: '#f8fafc',
                            border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Download size={15} color="#94a3b8" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
