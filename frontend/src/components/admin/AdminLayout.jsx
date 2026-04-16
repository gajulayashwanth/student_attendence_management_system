import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, Zap } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const AdminLayout = () => {
    const { user } = useAuthStore();

    const getInitials = () => {
        if (!user) return 'AD';
        return `${user.first_name?.[0] || 'A'}${user.last_name?.[0] || 'D'}`.toUpperCase();
    };

    return (
        <div className="flex h-screen bg-slate-50 transition-colors duration-300 font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 group cursor-default">
                            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Zap className="w-4 h-4" />
                            </div>
                            <h1 className="text-sm font-black text-slate-800 tracking-tighter uppercase hidden lg:block">Authority Console</h1>
                        </div>
                        <div className="h-6 w-[1px] bg-gray-100 hidden lg:block"></div>
                        <div className="relative group hidden sm:block">
                            <Search className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Find Staff, Students or Records..."
                                className="pl-10 pr-6 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:bg-white focus:border-indigo-100 transition-all outline-none w-64 lg:w-96"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2.5 text-slate-400 bg-slate-50 rounded-xl hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95 group">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group active:scale-95 transition-all">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
                                    {user ? `${user.first_name} ${user.last_name}` : 'Admin Root'}
                                </p>
                                <p className="text-[9px] font-bold text-indigo-600 uppercase mt-1 tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full inline-block">System Level 1</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-100 group-hover:scale-105 transition-transform">
                                {getInitials()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-10 bg-slate-50 relative selection:bg-indigo-500/10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
