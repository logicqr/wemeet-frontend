import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import MyMeeting from './components/Common1/MyMeeting';
import Settings from './components/super-admin/Settings';
import ModernEmployeeReport from './components/super-admin/EmployeeReport';

export default function App() {
  const location = useLocation();

  // Routes where Nav should be hidden
  const hideNavRoutes = ['/', '/login', '/register'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

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
      <Route path="/my-meeting" element={<MyMeeting />}/>
      <Route path="/Settings" element={<Settings />}/>
      <Route path="/emp-report" element={<ModernEmployeeReport />}/>
    </Routes>
  );
}
