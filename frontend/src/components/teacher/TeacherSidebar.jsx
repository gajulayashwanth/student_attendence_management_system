import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Users,
    ClipboardCheck,
    LayoutDashboard,
    Settings,
    LogOut,
    Zap,
    Grid
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const TeacherSidebar = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

    const menuItems = [
        { icon: Grid, label: 'Subject Launchpad', path: '/teacher/selection' },
        { icon: LayoutDashboard, label: 'Analytics Dashboard', path: '/teacher/dashboard' },
        { icon: Users, label: 'Management', path: '/teacher/classes' },
        { icon: ClipboardCheck, label: 'Attendance', path: '/teacher/attendance' },
        { icon: BarChart3, label: 'Reports', path: '/teacher/reports' },
        { icon: Settings, label: 'Settings', path: '/teacher/settings' },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Session terminated.');
        navigate('/login');
    };

    return (
        <aside className="w-20 lg:w-72 h-screen bg-teal-950 flex flex-col py-8 transition-all duration-300 fixed lg:static z-20 shadow-2xl shadow-teal-900/20 border-r border-teal-900/50">
            <div className="px-7 mb-16 flex items-center gap-3">
                <div className="p-2 bg-teal-500 rounded-xl shadow-lg ring-4 ring-teal-500/20">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase hidden lg:block">
                    AttendX
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group
                            ${isActive
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50'
                                : 'text-teal-200/60 hover:text-white hover:bg-white/10'}
                        `}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {user && (
                <div className="px-5 mb-4 hidden lg:block">
                    <div className="px-5 py-3 bg-white/5 rounded-2xl">
                        <p className="text-xs font-bold text-teal-100 truncate">{user.first_name} {user.last_name}</p>
                        <p className="text-[10px] text-teal-300/50 truncate">{user.email}</p>
                    </div>
                </div>
            )}

            <div className="px-5 mt-auto border-t border-white/10 pt-8">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 text-teal-200/60 hover:bg-rose-500/10 hover:text-rose-400 rounded-2xl transition-all duration-200 group active:scale-95"
                >
                    <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default TeacherSidebar;
