import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    BarChart2, Users, GraduationCap, Settings, LogOut,
    ShieldCheck, Library, Link, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success('Admin session terminated.');
        navigate('/');
    };

    const menuItems = [
        { icon: BarChart2, label: 'Analytics', path: '/secret-hq-console/analytics' },
        { icon: Users, label: 'Staff Registry', path: '/secret-hq-console/staff' },
        { icon: GraduationCap, label: 'Student Roster', path: '/secret-hq-console/students' },
        { icon: Library, label: 'Academic Catalog', path: '/secret-hq-console/subjects' },
        { icon: Link, label: 'Teacher Assignment', path: '/secret-hq-console/assignments' },
        { icon: History, label: 'Audit Archive', path: '/secret-hq-console/audit' },
        { icon: Settings, label: 'Settings', path: '/secret-hq-console/settings' },
    ];

    return (
        <aside className="w-20 lg:w-72 h-screen bg-slate-900 flex flex-col py-8 transition-all duration-300 fixed lg:static z-20 shadow-2xl">
            <div className="px-7 mb-12 flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-xl shadow-lg ring-4 ring-indigo-500/20">
                    <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase hidden lg:block">
                    AttendX <span className="text-indigo-400 font-bold italic">HQ</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group
                            ${isActive
                                ? 'bg-white/10 text-white border border-white/5 shadow-xl shadow-indigo-500/10'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-5 mt-auto pt-8 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 rounded-2xl transition-all duration-200 group active:scale-95"
                >
                    <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
