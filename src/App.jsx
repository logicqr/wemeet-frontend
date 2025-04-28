import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage';
import Admin from './components/admin/Admin';
import Staff from './components/staff/Staff';
import SuperAdmin from './components/super-admin/SuperAdmin';
import SaasAdmin from './components/saas-admin/SaasAdmin';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import LeaveRequest from './components/staff/LeaveRequest';
import AdminLeaveRequests from './components/common/AdminLeaveRequests';
import Nav from './components/common/Nav';
import AttendancePanel from './components/common/AttendancePanel';

export default function App() {
  const location = useLocation();

  // Routes where Nav should be hidden
  const hideNavRoutes = ['/', '/login', '/register'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <Nav />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/saas-admin" element={<SaasAdmin />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/my-leave" element={<LeaveRequest />} />
        <Route path="/leave-management" element={<AdminLeaveRequests />} />
        <Route path="/my-attendance" element={<AttendancePanel />} />
      </Routes>
    </>
  );
}
