import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap, Plus, Search, Trash2, Loader2, X, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import studentService from '../../services/studentService';
import subjectService from '../../services/subjectService';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newStudent, setNewStudent] = useState({
        first_name: '', last_name: '', roll_number: '', subject_ids: []
    });

    const fetchStudents = async () => {
        try {
            const response = await studentService.getAll();
            setStudents(response.data);
        } catch (error) {
            toast.error('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        subjectService.getAll().then(res => setSubjects(res.data)).catch(() => {});
    }, []);

    const handleOpenModal = (student = null) => {
        if (student) {
            setEditingId(student.id);
            setNewStudent({
                first_name: student.first_name,
                last_name: student.last_name,
                roll_number: student.roll_number,
                // Load existing subjects mapped properly to IDs
                subject_ids: student.subjects_detail?.map(s => s.id) || []
            });
        } else {
            setEditingId(null);
            setNewStudent({ first_name: '', last_name: '', roll_number: '', subject_ids: [] });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!newStudent.first_name || !newStudent.roll_number) {
            toast.error('First name and roll number are required.');
            return;
        }
        setCreating(true);
        try {
            if (editingId) {
                await studentService.update(editingId, newStudent);
                toast.success('Student updated successfully!');
            } else {
                await studentService.create(newStudent);
                toast.success('Student enrolled successfully!');
            }
            setNewStudent({ first_name: '', last_name: '', roll_number: '', subject_ids: [] });
            setShowModal(false);
            fetchStudents();
        } catch (error) {
            toast.error(error.response?.data?.roll_number?.[0] || 'Failed to save student.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await studentService.delete(id);
            toast.success('Student removed.');
            fetchStudents();
        } catch (error) {
            toast.error('Failed to remove student.');
        }
    };

    const toggleSubject = (subjectId) => {
        setNewStudent(prev => ({
            ...prev,
            subject_ids: prev.subject_ids.includes(subjectId)
                ? prev.subject_ids.filter(id => id !== subjectId)
                : [...prev.subject_ids, subjectId]
        }));
    };

    const filteredStudents = students.filter(s =>
        `${s.first_name} ${s.last_name} ${s.roll_number}`
            .toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 font-sans pb-20 selection:bg-indigo-500/10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Student Roster</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional Master Record Database</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-80 group">
                        <Search className="w-4 h-4 text-gray-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text" placeholder="Search by Name or Roll..."
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[11px] font-bold focus:bg-white focus:border-indigo-100 transition-all outline-none shadow-sm"
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                        <Plus className="w-5 h-5" /> Enroll Student
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-20">
                        <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No students found.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll No.</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subjects</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStudents.map((student, i) => (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} key={student.id} className="group hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 uppercase text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {student.first_name?.[0]}{student.last_name?.[0]}
                                            </div>
                                            <p className="text-sm font-black text-slate-800">{student.first_name} {student.last_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-[10px] font-black text-indigo-400 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">{student.roll_number}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-wrap gap-1.5">
                                            {/* Fix applied here: using subjects_detail instead of subjects */}
                                            {student.subjects_detail?.map(sub => (
                                                <span key={sub.id} className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{sub.code}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-teal-600 uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>Active
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(student)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-indigo-100 rounded-xl transition-all active:scale-90 shadow-sm" title="Edit Student">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(student.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-white border border-transparent hover:border-rose-100 rounded-xl transition-all active:scale-90 shadow-sm" title="Delete Student">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                                {editingId ? 'Edit Student' : 'Enroll Student'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">First Name</label>
                                    <input type="text" value={newStudent.first_name} onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })} className="w-full p-4 rounded-2xl text-xs font-bold border border-gray-200 focus:border-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Last Name</label>
                                    <input type="text" value={newStudent.last_name} onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })} className="w-full p-4 rounded-2xl text-xs font-bold border border-gray-200 focus:border-indigo-500 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Roll Number</label>
                                <input type="text" placeholder="e.g. 101" value={newStudent.roll_number} onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} className="w-full p-4 rounded-2xl text-xs font-bold border border-gray-200 focus:border-indigo-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Assign Subjects</label>
                                <div className="flex flex-wrap gap-2">
                                    {subjects.map(sub => (
                                        <button key={sub.id} onClick={() => toggleSubject(sub.id)} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${newStudent.subject_ids.includes(sub.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                            {sub.code}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleSave} disabled={creating} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                                {creating ? 'Saving...' : (editingId ? 'Update Student' : 'Enroll Student')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
