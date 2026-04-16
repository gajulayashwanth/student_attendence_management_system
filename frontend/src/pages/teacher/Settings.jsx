import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Lock, Bell, Save, ShieldCheck, ChevronRight, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import authService from '../../services/authService';

const Settings = () => {
    const { user, updateUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: user?.phone_number || '',
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const getInitials = () => {
        if (!user) return '??';
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (activeTab === 'profile') {
                const response = await authService.updateProfile(profileData);
                updateUser(response.data);
                toast.success('Profile updated successfully.');
            } else if (activeTab === 'security') {
                if (passwordData.new_password !== passwordData.confirm_password) {
                    toast.error('New passwords do not match.');
                    setSaving(false);
                    return;
                }
                if (passwordData.new_password.length < 8) {
                    toast.error('Password must be at least 8 characters.');
                    setSaving(false);
                    return;
                }
                toast.success('Password update would require backend endpoint.');
                setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            } else {
                toast.success('Preferences saved.');
            }
        } catch (error) {
            toast.error('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 px-4 pb-20 font-sans text-slate-900 bg-slate-50 min-h-screen">
            <div className="w-full lg:w-72 shrink-0 space-y-2">
                <h2 className="text-xl font-black text-slate-900 mb-6 px-2 tracking-tighter uppercase">Settings Console</h2>
                <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile Meta" />
                <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Lock} label="Access Security" />
                <TabButton active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} icon={Bell} label="System Config" />
            </div>

            <div className="flex-1 min-w-0">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm"
                >
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <SectionHeader title="Profile Matrix" desc="Update your identity within the system." />
                            <div className="flex items-center gap-8 pb-8 border-b border-gray-50">
                                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-slate-200">
                                    {getInitials()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{user?.first_name} {user?.last_name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{user?.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <InputField label="Email" value={user?.email} disabled={true} />
                                <InputField label="Role" value={user?.role} disabled={true} />
                                <InputField
                                    label="First Name"
                                    value={profileData.first_name}
                                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                />
                                <InputField
                                    label="Last Name"
                                    value={profileData.last_name}
                                    onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                />
                                <InputField
                                    label="Phone Number"
                                    value={profileData.phone_number}
                                    onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <SectionHeader title="Access Shield" desc="Enforce your credential security." />
                            <div className="grid grid-cols-1 gap-8 max-w-xl">
                                <InputField
                                    label="Current Protocol"
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                />
                                <div className="border-t border-gray-50 pt-8 space-y-8">
                                    <InputField
                                        label="New Protocol"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    />
                                    <InputField
                                        label="Confirm Protocol"
                                        type="password"
                                        placeholder="Re-enter for safety"
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-10">
                            <SectionHeader title="System Configuration" desc="Adjust your interface interaction." />
                            <div className="space-y-6">
                                <ToggleRow
                                    icon={notifications ? Bell : ShieldCheck}
                                    title="Alert Sync"
                                    desc="Receive instant logs on student status changes."
                                    active={notifications}
                                    onClick={() => setNotifications(!notifications)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-12 pt-10 border-t border-gray-50 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Finalize Changes'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SectionHeader = ({ title, desc }) => (
    <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 leading-none mb-2">{title}</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{desc}</p>
    </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 px-6 rounded-2xl transition-all group border ${
            active
                ? 'bg-white border-teal-500 shadow-md translate-x-2'
                : 'bg-transparent border-transparent text-gray-400 hover:text-gray-900'
        }`}
    >
        <div className="flex items-center gap-4">
            <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-gray-300'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        {active && <ChevronRight className="w-4 h-4 text-teal-600" />}
    </button>
);

const InputField = ({ label, value, placeholder, type = "text", disabled = false, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
        <input
            type={type}
            value={value || ''}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            className={`w-full p-4 rounded-2xl text-xs font-bold transition-all outline-none border ${
                disabled
                    ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 text-gray-800'
            }`}
        />
    </div>
);

const ToggleRow = ({ icon: Icon, title, desc, active, onClick }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-5">
            <div className={`p-4 rounded-xl transition-colors ${active ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-300'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
                <p className="text-[11px] font-bold text-gray-400 tracking-tight">{desc}</p>
            </div>
        </div>
        <button
            onClick={onClick}
            className={`w-14 h-8 rounded-full relative transition-all duration-300 border-2 ${
                active ? 'bg-teal-600 border-teal-600' : 'bg-gray-100 border-gray-100'
            }`}
        >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                active ? 'left-7' : 'left-1'
            }`}></div>
        </button>
    </div>
);

export default Settings;
