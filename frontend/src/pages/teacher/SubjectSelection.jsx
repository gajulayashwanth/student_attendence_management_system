import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import subjectService from '../../services/subjectService';

const SubjectSelection = () => {
    const navigate = useNavigate();
    const setActiveSubject = useStore((state) => state.setActiveSubject);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await subjectService.getMySubjects();
                setSubjects(response.data);
            } catch (error) {
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    const handleSelection = (subject) => {
        setActiveSubject(subject);
        navigate('/teacher/attendance');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 font-sans pb-20 selection:bg-teal-500/10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Classroom Console</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 leading-loose">Select an authorized subject to initialize attendance tracking</p>
                </div>
                <div className="flex items-center gap-3 bg-teal-50 px-6 py-3.5 rounded-2xl border border-teal-100 shadow-sm relative z-10 animate-pulse">
                    <Zap className="w-4 h-4 text-teal-600" />
                    <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest text-left">{subjects.length} Subject{subjects.length !== 1 ? 's' : ''} Assigned</span>
                </div>
            </div>

            {subjects.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-400">No Subjects Assigned</h3>
                    <p className="text-sm text-slate-400 mt-2">Contact your administrator to get subjects assigned to your account.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((subject, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={subject.id}
                            onClick={() => handleSelection(subject)}
                            className="group relative bg-white border border-gray-100 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-teal-100 hover:-translate-y-2 transition-all cursor-pointer overflow-hidden text-left"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700 text-left"></div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="bg-slate-900 p-4 rounded-2xl shadow-xl transition-all group-hover:bg-teal-600">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-teal-600 transition-colors">
                                    {subject.student_count} Student{subject.student_count !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-2 group-hover:text-teal-600 transition-colors">{subject.name}</h3>
                                <div className="flex items-center gap-2 mb-8 text-left">
                                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">Code: {subject.code}</span>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {[...Array(Math.min(3, subject.student_count || 0))].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                                                    <GraduationCap className="w-3 h-3 text-slate-400" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subject.student_count} Enrolled</span>
                                    </div>
                                    <div className="bg-teal-50 p-2.5 rounded-xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubjectSelection;
