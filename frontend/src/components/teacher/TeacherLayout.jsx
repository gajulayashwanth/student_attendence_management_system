import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TopNav from './TopNav';

const TeacherLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 transition-colors duration-300 font-sans">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;