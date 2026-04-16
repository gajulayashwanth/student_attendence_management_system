import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Search, Trash2, Library, Users, Loader2, X, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import subjectService from '../../services/subjectService';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: '', code: '' });
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchSubjects = async () => {
        try {
            const response = await subjectService.getAll();
            setSubjects(response.data);
        } catch (error) {
            toast.error('Failed to load subjects.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleOpenModal = (subject = null) => {
        if (subject) {
            setEditingId(subject.id);
            setNewSubject({ name: subject.name, code: subject.code });
        } else {
            setEditingId(null);
            setNewSubject({ name: '', code: '' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!newSubject.name || !newSubject.code) {
            toast.error('Name and code are required.');
            return;
        }
        setCreating(true);
        try {
            if (editingId) {
                await subjectService.update(editingId, newSubject);
                toast.success('Subject updated successfully!');
            } else {
                await subjectService.create(newSubject);
                toast.success('Subject created successfully!');
            }
            setNewSubject({ name: '', code: '' });
            setShowModal(false);
            fetchSubjects();
        } catch (error) {
            toast.error(error.response?.data?.code?.[0] || 'Failed to save subject.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await subjectService.delete(id);
            toast.success('Subject deleted.');
            fetchSubjects();
        } catch (error) {
            toast.error('Failed to delete subject.');
        }
    };

    const filteredSubjects = subjects.filter(s =>
        `${s.name} ${s.code}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 font-sans pb-20 selection:bg-indigo-500/10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Academic Catalog</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage institutional subjects</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto relative z-10">
                    <div className="relative flex-1 lg:w-80 group">
                        <Search className="w-4 h-4 text-gray-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter Subject Name or Code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[11px] font-bold focus:bg-white focus:border-indigo-100 transition-all outline-none shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> New Subject
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    </div>
                ) : filteredSubjects.length === 0 ? (
                    <div className="text-center py-20">
                        <Library className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No subjects found.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Catalog Entry</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Code</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredSubjects.map((sub, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={sub.id}
                                    className="group hover:bg-indigo-50/30 transition-colors cursor-default"
                                >
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 uppercase text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Library className="w-5 h-5" />
                                            </div>
                                            <p className="text-sm font-black text-slate-800 leading-none">{sub.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-[9px] font-black text-indigo-400 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">{sub.code}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="text-[11px] font-black text-slate-900 tracking-tighter">{sub.student_count} Students</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenModal(sub)}
                                            className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-indigo-100 rounded-xl transition-all active:scale-90 shadow-sm"
                                            title="Edit Subject"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="p-3 text-slate-300 hover:text-rose-500 hover:bg-white border border-transparent hover:border-rose-100 rounded-xl transition-all active:scale-90 shadow-sm"
                                            title="Delete Subject"
                                        >
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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                                {editingId ? 'Edit Subject' : 'New Subject'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Subject Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Physics Foundations"
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                    className="w-full p-4 rounded-2xl text-xs font-bold bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Subject Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. PHY-101"
                                    value={newSubject.code}
                                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                                    className="w-full p-4 rounded-2xl text-xs font-bold bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={creating}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                                {creating ? 'Saving...' : (editingId ? 'Update Subject' : 'Create Subject')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;
