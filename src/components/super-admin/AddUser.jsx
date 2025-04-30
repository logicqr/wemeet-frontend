import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiBriefcase, FiUsers, FiCheck, FiX, FiAlertCircle, FiUserPlus, FiLock, FiEye, FiEyeOff, FiMapPin, FiHome, FiGrid } from 'react-icons/fi';

export default function AddStaff() {
  // Constants for user roles and permissions
  const USER_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF'
  };
  
  // This would be fetched from context, auth state, or localStorage in a real app
  const currentUserRole = USER_ROLES.SUPER_ADMIN; // Change to USER_ROLES.SUPER_ADMIN to test super admin view
  
  // Company ID - would normally come from previous page navigation or context
  const companyId = "cm9yglvn40000dg2ovt5v0rrq";

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    position: '',
    department: '',
    role: currentUserRole === USER_ROLES.ADMIN ? USER_ROLES.STAFF : '',
    password: '',
    mode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Determine available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUserRole === USER_ROLES.SUPER_ADMIN) {
      return [
        { value: USER_ROLES.ADMIN, label: 'Admin' },
        { value: USER_ROLES.STAFF, label: 'Staff' }
      ];
    }
    return [];
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create a clean data object for submission
      const dataToSubmit = {
        userName: formData.userName,
        email: formData.email,
        position: formData.position.toUpperCase(),
        department: formData.department,
        role: formData.role,
        password: formData.password,
        mode: formData.mode,
        company_id: companyId
      };
      
      const res = await axios.post('https://wemeet-backend-latest.onrender.com/api/add-user', dataToSubmit);
      
      setPopup({ 
        show: true, 
        type: 'success', 
        message: 'Team member successfully added! Email invitation has been sent.' 
      });
      
      // Reset form
      setFormData({
        userName: '',
        email: '',
        position: '',
        department: '',
        role: currentUserRole === USER_ROLES.ADMIN ? USER_ROLES.STAFF : '',
        password: '',
        mode: 'work_from_office'
      });
      
    } catch (err) {
      setPopup({ 
        show: true, 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to add team member. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-hide popup after 5 seconds
  useEffect(() => {
    let timer;
    if (popup.show) {
      timer = setTimeout(() => {
        setPopup({ ...popup, show: false });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [popup.show]);

  // Get available roles
  const availableRoles = getAvailableRoles();

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-3 sm:p-6 md:p-8 container mx-auto min-h-screen flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-24 sm:w-64 h-24 sm:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 sm:w-72 h-32 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Improved Responsive Success/Error Popup */}
      {popup.show && (
        <div className={`fixed top-2 md:top-5 left-2 right-2 md:left-auto md:right-5 z-50 w-auto md:w-full md:max-w-sm lg:max-w-md p-3 md:p-4 rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down backdrop-blur-sm ${
          popup.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {popup.type === 'success' ? (
                <div className="bg-white bg-opacity-25 rounded-full p-1.5 md:p-2">
                  <FiCheck size={16} className="text-green-500" />
                </div>
              ) : (
                <div className="bg-white bg-opacity-25 rounded-full p-1.5 md:p-2">
                  <FiAlertCircle size={16} className="text-red-500" />
                </div>
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="font-medium text-base md:text-lg">{popup.type === 'success' ? 'Success!' : 'Error'}</p>
              <p className="mt-0.5 text-xs md:text-sm opacity-90">{popup.message}</p>
            </div>
            <div className="ml-2 md:ml-4 flex-shrink-0 flex">
              <button
                onClick={() => setPopup({ ...popup, show: false })}
                className="inline-flex text-white hover:text-gray-100 focus:outline-none transition-transform hover:scale-110"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full mx-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10 overflow-hidden">
        <div className="flex flex-col lg:flex-row bg-blue-600">
          {/* Left Column - Visual Elements */}
          <div 
            className="text-white p-4 sm:p-6 lg:p-12 lg:w-2/5 flex flex-col justify-center items-start relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://ik.imagekit.io/69rzkdyiaw/e79adb1b-7036-4f85-89ce-ca785152e834%20(3).png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Content */}
            <div className="w-full z-10 relative">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="bg-white bg-opacity-20 p-2 md:p-3 rounded-xl mr-3 md:mr-4 backdrop-blur-sm">
                  <FiUserPlus size={22} className="text-blue-500" />
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                  Add Team Member
                </h2>
              </div>
              
              <p className="text-white mb-6 md:mb-8 lg:mb-10 text-sm md:text-base lg:text-lg max-w-md leading-relaxed">
                Invite employees to join your workspace and collaborate effectively across your organization.
              </p>

              {/* Role display */}
              <div className="bg-white opacity-80 backdrop-blur-sm p-3 md:p-4 rounded-lg mb-5 md:mb-6 lg:mb-8 transform transition-all duration-300 hover:scale-102 hover:bg-opacity-30">
                <span className="font-medium text-sm md:text-base text-indigo-500">Your Role: {currentUserRole.charAt(0) + currentUserRole.slice(1).toLowerCase()}</span>
                <p className="text-indigo-500 text-xs md:text-sm mt-1">
                  {currentUserRole === USER_ROLES.SUPER_ADMIN 
                    ? 'You can add both Admin and Staff members' 
                    : 'You can only add Staff members'}
                </p>
              </div>

              {/* Feature highlights for larger screens */}
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2 text-white mb-2 md:mb-3">
                  <div className="border p-0.5 md:p-1 rounded-full backdrop-blur-sm">
                    <FiCheck size={14} />
                  </div>
                  <span className="text-sm md:text-base">Instant access to workspace</span>
                </div>
                <div className="flex items-center space-x-2 text-white mb-2 md:mb-3">
                  <div className="border p-0.5 md:p-1 rounded-full backdrop-blur-sm">
                    <FiCheck size={14} />
                  </div>
                  <span className="text-sm md:text-base">Automatic email invitations</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <div className="border p-0.5 md:p-1 rounded-full backdrop-blur-sm">
                    <FiCheck size={14} />
                  </div>
                  <span className="text-sm md:text-base">Secure role-based permissions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 lg:w-3/5 bg-white">
            <form className="space-y-4 md:space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                <div className="lg:col-span-1 col-span-2">
                  <label htmlFor="userName" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-600">
                      <FiUser size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </div>
                    <input
                      id="userName"
                      type="text"
                      name="userName"
                      placeholder="John Doe"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                      className="w-full pl-9 md:pl-10 lg:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 lg:py-3.5 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-800"
                    />
                  </div>
                </div>
                
                <div className="lg:col-span-1 col-span-2">
                  <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-600">
                      <FiMail size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 md:pl-10 lg:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 lg:py-3.5 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-800"
                    />
                  </div>
                </div>
                
                <div className="lg:col-span-1 col-span-2">
                  <label htmlFor="position" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ml-1">Position</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-600">
                      <FiBriefcase size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </div>
                    <input
                      id="position"
                      type="text"
                      name="position"
                      placeholder="Product Manager"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full pl-9 md:pl-10 lg:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 lg:py-3.5 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-800 uppercase placeholder:capitalize"
                    />
                  </div>
                </div>

                {/* Added Department Field */}
                <div className="lg:col-span-1 col-span-2">
                  <label htmlFor="department" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ml-1">Department</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-600">
                      <FiGrid size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </div>
                    <input
                      id="department"
                      type="text"
                      name="department"
                      placeholder="Marketing"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-9 md:pl-10 lg:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 lg:py-3.5 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-800"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-600">
                      <FiLock size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-9 md:pl-10 lg:pl-11 pr-10 md:pr-12 py-2.5 md:py-3 lg:py-3.5 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <FiEyeOff size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      ) : (
                        <FiEye size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {currentUserRole === USER_ROLES.SUPER_ADMIN && (
                  <div className="col-span-2">
                    <label htmlFor="role" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ml-1">Role</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-600">
                        <FiUsers size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 md:pl-10 lg:pl-11 pr-8 md:pr-10 py-2.5 md:py-3 lg:py-3.5 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm bg-white appearance-none cursor-pointer hover:border-indigo-300 text-gray-800"
                      >
                        <option value="" disabled>Select Role</option>
                        {availableRoles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3 pointer-events-none text-gray-500">
                        <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Work Mode Section - Adjusted for better mobile display */}
                <div className="col-span-2">
                  <div className="mb-1 md:mb-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ml-1">Work Mode</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <label className={`flex items-center p-3 md:p-4 border rounded-lg md:rounded-xl cursor-pointer transition-all ${
                        formData.mode === 'work_from_office' 
                          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}>
                        <input
                          type="radio"
                          name="mode"
                          value="work_from_office"
                          checked={formData.mode === 'work_from_office'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`flex items-center justify-center h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-lg mr-3 ${
                          formData.mode === 'work_from_office' 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <FiMapPin size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        </div>
                        <div>
                          <span className="block font-medium text-sm md:text-base text-gray-800">Work from Office</span>
                          <span className="text-xs md:text-sm text-gray-500">In-person collaboration</span>
                        </div>
                      </label>
                      
                      <label className={`flex items-center p-3 md:p-4 border rounded-lg md:rounded-xl cursor-pointer transition-all ${
                        formData.mode === 'work_from_home' 
                          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}>
                        <input
                          type="radio"
                          name="mode"
                          value="work_from_home"
                          checked={formData.mode === 'work_from_home'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`flex items-center justify-center h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-lg mr-3 ${
                          formData.mode === 'work_from_home' 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <FiHome size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        </div>
                        <div>
                          <span className="block font-medium text-sm md:text-base text-gray-800">Work from Home</span>
                          <span className="text-xs md:text-sm text-gray-500">Remote working setup</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Role Selection - Only show for SUPER_ADMIN */}
               
              </div>

              {/* Hidden input for role when user is ADMIN */}
              {currentUserRole === USER_ROLES.ADMIN && (
                <input type="hidden" name="role" value={USER_ROLES.STAFF} />
              )}

              <div className="pt-2 md:pt-4 lg:pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-2.5 md:py-3 lg:py-4 px-4 md:px-6 text-sm md:text-base font-medium rounded-lg md:rounded-xl text-white ${
                    isSubmitting 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <FiUserPlus size={16} className="md:w-5 md:h-5 mr-2" />
                      Add Team Member
                    </>
                  )}
                </button>
              </div>
              
              <div className="pt-1 md:pt-2 lg:pt-4">
                <div className="text-xs md:text-sm text-center text-gray-600 bg-indigo-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-indigo-100 shadow-inner transform transition-all duration-300 hover:bg-indigo-100">
                  <span className="block text-indigo-700 font-medium mb-0.5 md:mb-1">Automatic Invitation</span>
                  Team members will receive an email invitation to join your workspace
                </div>
              </div>

              {/* Show role information for admin users on small screens */}
              {currentUserRole === USER_ROLES.ADMIN && (
                <div className="md:hidden text-xs sm:text-sm text-center text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg md:rounded-xl">
                  <span className="text-indigo-600 font-medium">Role: Staff</span>
                  <p className="mt-1 text-xs">As an Admin, you can only add Staff members</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}