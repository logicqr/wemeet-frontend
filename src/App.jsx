import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage';
import Admin from './components/admin/Admin';
import Staff from './components/staff/Staff';
import SuperAdmin from './components/super-admin/SuperAdmin';
import SaasAdmin from './components/saas-admin/SaasAdmin';
import AddUser from './components/super-admin/AddUser'
import AddStaff from './components/admin/AddStaff';
import MeetingCreationPage from './components/super-admin/MeetingCreationPage';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import LeaveRequest from './components/staff/LeaveRequest';
import AdminLeaveRequests from './components/admin/AdminLeaveRequests';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/saas-admin" element={<SaasAdmin />} />
      <Route path="/super-admin" element={<SuperAdmin />} />
      <Route path='/add-user' element={<AddUser/>}/>
      <Route path='/add-Staff' element={<AddStaff/>}/>
      <Route path='/create-meeting' element={<MeetingCreationPage/>}/>
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/leave-request" element={<LeaveRequest/>} />
      <Route path="/admin-leave-request" element={<AdminLeaveRequests />}/>
    </Routes>
  );
}
