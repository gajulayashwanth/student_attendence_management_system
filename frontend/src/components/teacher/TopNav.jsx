import React, { useState, useEffect } from 'react';
import { Bell, Search, Clock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const TopNav = () => {
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getInitials = () => {
        if (!user) return '??';
        const first = user.first_name?.[0] || '';
        const last = user.last_name?.[0] || '';
        return `${first}${last}`.toUpperCase();
    };

    const getFullName = () => {
        if (!user) return 'Teacher';
        return `${user.first_name} ${user.last_name}`;
    };

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-8">
                <div className="hidden lg:block">
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                        {getGreeting()}, {user?.first_name || 'Teacher'}
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-none">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="h-10 w-[1px] bg-slate-100 hidden lg:block"></div>

                <div className="relative group hidden sm:block">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-teal-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-2xl text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 transition-all outline-none w-64 text-slate-700 placeholder-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2.5 text-slate-400 bg-slate-50 rounded-xl hover:text-teal-600 hover:bg-teal-50 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-800 to-teal-950 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:from-teal-600 group-hover:to-teal-800 transition-all duration-300">
                        {getInitials()}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-teal-600 transition-colors">{getFullName()}</p>
                        <p className="text-[10px] font-bold text-teal-600 uppercase mt-1 tracking-widest">Active Now</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
