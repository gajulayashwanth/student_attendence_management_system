import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import TeacherRoute from './routes/TeacherRoute';
import AdminRoute from './routes/AdminRoute';

import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';

import TeacherLayout from './components/teacher/TeacherLayout';
import SubjectSelection from './pages/teacher/SubjectSelection';
import DashboardOverview from './pages/teacher/DashboardOverview';
import MyClasses from './pages/teacher/MyClasses';
import MarkAttendance from './pages/teacher/MarkAttendance';
import Reports from './pages/teacher/Reports';
import Settings from './pages/teacher/Settings';

import SecretAdminLogin from './pages/admin/SecretAdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import StaffManagement from './pages/admin/StaffManagement';
import StudentManagement from './pages/admin/StudentManagement';
import SubjectManagement from './pages/admin/SubjectManagement';
import TeacherAssignment from './pages/admin/TeacherAssignment';
import AttendanceAudit from './pages/admin/AttendanceAudit';

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute>
                        <RegisterPage />
                    </GuestRoute>
                } />
                <Route path="/pending-approval" element={
                    <ProtectedRoute>
                        <PendingApprovalPage />
                    </ProtectedRoute>
                } />

                <Route path="/secret-hq-entrance" element={
                    <GuestRoute>
                        <SecretAdminLogin />
                    </GuestRoute>
                } />

                <Route path="/teacher" element={
                    <TeacherRoute>
                        <TeacherLayout />
                    </TeacherRoute>
                }>
                    <Route index element={<Navigate to="/teacher/selection" replace />} />
                    <Route path="selection" element={<SubjectSelection />} />
                    <Route path="dashboard" element={<DashboardOverview />} />
                    <Route path="classes" element={<MyClasses />} />
                    <Route path="attendance" element={<MarkAttendance />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="/secret-hq-console" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                    <Route index element={<Navigate to="/secret-hq-console/analytics" replace />} />
                    <Route path="analytics" element={<AdminOverview />} />
                    <Route path="staff" element={<StaffManagement />} />
                    <Route path="students" element={<StudentManagement />} />
                    <Route path="subjects" element={<SubjectManagement />} />
                    <Route path="assignments" element={<TeacherAssignment />} />
                    <Route path="audit" element={<AttendanceAudit />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
