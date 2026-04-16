import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Calendar, BookOpen, CheckCircle2, XCircle, Clock, Loader2, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import attendanceService from '../../services/attendanceService';

const AttendanceAudit = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (dateFrom) filters.date_from = dateFrom;
            if (dateTo) filters.date_to = dateTo;
            const response = await attendanceService.getAudit(filters);
            setRecords(response.data.records || []);
        } catch (error) {
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleFilter = () => {
        fetchRecords();
    };

    const filteredRecords = records.filter(r =>
        `${r.student_name} ${r.teacher_name} ${r.subject_name}`
            .toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownloadCSV = () => {
        if (filteredRecords.length === 0) {
            toast.error("No records to export.");
            return;
        }

        let csv = 'Date,Teacher,Subject,Student,Status\n';
        filteredRecords.forEach(r => {
            csv += `${r.date},"${r.teacher_name}","${r.subject_name}","${r.student_name}",${r.status}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `Audit_Archive_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Audit records exported!");
    };

    return (
        <div className="space-y-6 font-sans pb-20 selection:bg-indigo-500/10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Audit Archive</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Immutable history of system-wide attendance events</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{records.length} Records Loaded</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px] group">
                    <Search className="w-4 h-4 text-slate-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
                    <input type="text" placeholder="Search student, teacher, or subject..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:bg-white focus:border-indigo-100 transition-all outline-none" />
                </div>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black focus:bg-white focus:border-indigo-100 transition-all outline-none cursor-pointer" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black focus:bg-white focus:border-indigo-100 transition-all outline-none cursor-pointer" />
                
                <div className="flex gap-2">
                    <button onClick={handleFilter} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95">
                        Apply Filter
                    </button>
                    <button onClick={handleDownloadCSV} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>
                ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-20">
                        <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No attendance records found.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Teacher</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRecords.map((rec, i) => (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} key={rec.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-8">
                                        <span className="text-[11px] font-black text-slate-900 tracking-tighter">{rec.date}</span>
                                    </td>
                                    <td className="px-6 py-8">
                                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{rec.teacher_name}</span>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{rec.subject_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 text-sm font-black text-slate-900 uppercase tracking-tighter">{rec.student_name}</td>
                                    <td className="px-6 py-8">
                                        {rec.status === 'PRESENT' ? (
                                            <div className="flex items-center gap-2 text-teal-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Present</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-rose-500">
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Absent</span>
                                            </div>
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

export default AttendanceAudit;
