import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Link as LinkIcon, User, BookOpen, Check, X, ArrowRight, Loader2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import subjectService from '../../services/subjectService';

const TeacherAssignment = () => {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [assignedSubjectIds, setAssignedSubjectIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teacherRes, subjectRes] = await Promise.all([
                    authService.getTeachers('approved'),
                    subjectService.getAll()
                ]);
                setTeachers(teacherRes.data);
                setSubjects(subjectRes.data);
                if (teacherRes.data.length > 0) {
                    selectTeacher(teacherRes.data[0], subjectRes.data);
                }
            } catch (error) {
                toast.error('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectTeacher = (teacher, allSubjects = subjects) => {
        setSelectedTeacher(teacher);
        // FIX: Replaced .teachers with .teachers_detail to match backend serializer
        const assigned = allSubjects
            .filter(s => s.teachers_detail?.some(t => t.id === teacher.id))
            .map(s => s.id);
        setAssignedSubjectIds(assigned);
    };

    const toggleSubject = (subjectId) => {
        setAssignedSubjectIds(prev =>
            prev.includes(subjectId)
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const handleSave = async () => {
        if (!selectedTeacher) return;
        setSaving(true);
        try {
            for (const subject of subjects) {
                const isAssigned = assignedSubjectIds.includes(subject.id);
                // FIX: Replaced .teachers with .teachers_detail
                const wasAssigned = subject.teachers_detail?.some(t => t.id === selectedTeacher.id);

                if (isAssigned && !wasAssigned) {
                    const currentTeachers = subject.teachers_detail?.map(t => t.id) || [];
                    await subjectService.update(subject.id, {
                        ...subject,
                        teacher_ids: [...currentTeachers, selectedTeacher.id]
                    });
                } else if (!isAssigned && wasAssigned) {
                    const currentTeachers = subject.teachers_detail?.map(t => t.id) || [];
                    await subjectService.update(subject.id, {
                        ...subject,
                        teacher_ids: currentTeachers.filter(id => id !== selectedTeacher.id)
                    });
                }
            }
            toast.success('Assignments saved successfully!');
            const subjectRes = await subjectService.getAll();
            setSubjects(subjectRes.data);
        } catch (error) {
            toast.error('Failed to save assignments.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
    }

    return (
        <div className="space-y-8 font-sans pb-20 selection:bg-indigo-500/10">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Authority Assignment</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Map academic subjects to master staff accounts</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <LinkIcon className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{teachers.length} Teachers • {subjects.length} Subjects</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Select Staff Member</h3>
                        <div className="space-y-4">
                            {teachers.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6">No approved teachers yet.</p>
                            ) : (
                                teachers.map((teacher) => (
                                    <div
                                        key={teacher.id}
                                        onClick={() => selectTeacher(teacher)}
                                        className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between group ${selectedTeacher?.id === teacher.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-indigo-100'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <User className={`w-4 h-4 ${selectedTeacher?.id === teacher.id ? 'text-indigo-200' : 'text-slate-300'}`} />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{teacher.first_name} {teacher.last_name}</span>
                                        </div>
                                        {selectedTeacher?.id === teacher.id && <Check className="w-4 h-4" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm min-h-[500px]">
                        {selectedTeacher ? (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{selectedTeacher.first_name} {selectedTeacher.last_name}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedTeacher.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleSave} disabled={saving} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 flex items-center gap-2">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {saving ? 'Saving...' : 'Save Allocation'}
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Check className="w-3 h-3" /> Assigned Subjects ({assignedSubjectIds.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            <AnimatePresence>
                                                {assignedSubjectIds.map(subId => {
                                                    const sub = subjects.find(s => s.id === subId);
                                                    if (!sub) return null;
                                                    return (
                                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={subId} className="px-5 py-3 bg-white border-2 border-indigo-100 rounded-2xl flex items-center gap-3 shadow-sm">
                                                            <BookOpen className="w-4 h-4 text-indigo-600" />
                                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{sub.name}</span>
                                                            <button onClick={() => toggleSubject(subId)} className="p-1 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-colors">
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                            {assignedSubjectIds.length === 0 && <p className="text-xs text-slate-400">No subjects assigned yet.</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            Available Catalog
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {subjects.filter(s => !assignedSubjectIds.includes(s.id)).map(sub => (
                                                <div key={sub.id} onClick={() => toggleSubject(sub.id)} className="p-5 bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white rounded-[2rem] transition-all cursor-pointer flex justify-between items-center group shadow-sm active:scale-95">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 bg-white rounded-xl text-slate-300 group-hover:text-indigo-600 transition-colors">
                                                            <BookOpen className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{sub.name}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub.code}</p>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            ))}
                                            {subjects.filter(s => !assignedSubjectIds.includes(s.id)).length === 0 && (
                                                <p className="text-xs text-slate-400 col-span-2 text-center py-6">All subjects are assigned.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full"><p className="text-sm text-slate-400">Select a teacher from the left panel.</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherAssignment;
