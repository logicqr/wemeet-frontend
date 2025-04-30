import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiBriefcase, FiUsers, FiCheck, FiX, FiAlertCircle, FiUserPlus, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AddStaff() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    position: '',
    role: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility

  // Company ID that will be submitted automatically
  const companyId = "cm9vb0w9k0000tz6sgvmihnw9";

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add company_id to the data being submitted
      const dataToSubmit = {
        ...formData,
        position: formData.position.toUpperCase(),
        company_id: companyId
      };
      
      const res = await axios.post('https://wemeet-backend-latest.onrender.com/api/add-user', dataToSubmit);
      console.log(dataToSubmit);
      
      // Show success popup
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
        role: '',
        password: ''
      });
      
    } catch (err) {
      // Show error popup
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

  const closePopup = () => {
    setPopup({ ...popup, show: false });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 lg:p-8 min-h-screen flex items-center justify-center">
      {/* Success/Error Popup */}
      {popup.show && (
        <div className={`fixed top-5 right-5 z-50 w-96 p-4 rounded-lg shadow-2xl transform transition-all duration-500 animate-fade-in-down backdrop-blur-sm ${
          popup.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {popup.type === 'success' ? (
                <div className="bg-white bg-opacity-25 rounded-full p-2">
                  <FiCheck size={20} className="text-green-500" />
                </div>
              ) : (
                <div className="bg-white bg-opacity-25 rounded-full p-2">
                  <FiAlertCircle size={20} className="text-red-500" />
                </div>
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="font-medium text-lg">{popup.type === 'success' ? 'Success!' : 'Error'}</p>
              <p className="mt-1 text-sm opacity-90">{popup.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={closePopup}
                className="inline-flex text-white hover:text-gray-100 focus:outline-none transition-transform hover:scale-110"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Header with enhanced design */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white p-8 md:p-10 lg:p-12 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none md:w-2/5 flex flex-col justify-center items-center md:items-start relative overflow-hidden">
            {/* Enhanced background with wave pattern */}
            {/* <div className="absolute inset-0 overflow-hidden opacity-30">
  <svg className="absolute w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
    <path d="M0,800 C200,1000 800,600 1000,800 L1000,0 L0,0 Z" fill="rgba(240, 248, 255, 0.2)"></path>
    <path d="M0,900 C400,700 600,1100 1000,900 L1000,0 L0,0 Z" fill="rgba(230, 240, 255, 0.25)" transform="translate(0,30)"></path>
  </svg>
</div> */}
            
            {/* Floating shapes background */}
            
            
            {/* Title and description with improved styling */}
            <div className="z-10 w-full flex flex-col items-center md:items-start">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 text-center md:text-left relative">
                Add Team Member
                <div className="h-1 w-12 bg-blue-300 mt-3 md:ml-1 rounded-full mx-auto md:mx-0"></div>
              </h2>
              <p className="text-blue-100 mb-8 text-center md:text-left text-lg max-w-md leading-relaxed">
                Invite Employees to join your workspace and collaborate effectively across your organization.
              </p>
            </div>

            {/* Enhanced image with glow effect */}
            {/* <div className="mt-2 mb-6 w-full flex justify-center md:justify-start z-10 relative border border-white">
              <div className="absolute inset-0 bg-blue-400 opacity-20 blur-3xl rounded-full transform -translate-y-1/4"></div>
              <img 
                src="https://ik.imagekit.io/69rzkdyiaw/14308.png?updatedAt=1745566117596" 
                alt="Team collaboration illustration" 
                className="w-full h-96 obj transform transition-all duration-500 hover:scale-105 relative z-10"
              />
            </div> */}
          </div>

          {/* Right Column - Form */}
          <div className="p-8 md:p-10 lg:p-12 md:w-3/5 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 md:hidden">Employees Details</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group col-span-2 md:col-span-1">
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2 ml-1">Full Name</label>
                  <div className="relative transition-all duration-300 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                      <FiUser size={18} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <input
                      id="userName"
                      type="text"
                      name="userName"
                      placeholder="John Doe"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 text-gray-800"
                    />
                  </div>
                </div>
                
                <div className="relative group col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email Address</label>
                  <div className="relative transition-all duration-300 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                      <FiMail size={18} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 text-gray-800"
                    />
                  </div>
                </div>
                
                <div className="relative group col-span-2 md:col-span-1">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2 ml-1">Position</label>
                  <div className="relative transition-all duration-300 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                      <FiBriefcase size={18} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <input
                      id="position"
                      type="text"
                      name="position"
                      placeholder="Product Manager"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 text-gray-800 uppercase placeholder:capitalize"
                    />
                  </div>
                </div>

                <div className="relative group col-span-2 md:col-span-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 ml-1">Password</label>
                  <div className="relative transition-all duration-300 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                      <FiLock size={18} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 text-gray-800"
                    />
                    {/* Password visibility toggle button */}
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} className="transition-transform duration-300 hover:scale-110" />
                      ) : (
                        <FiEye size={18} className="transition-transform duration-300 hover:scale-110" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="relative group col-span-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2 ml-1">Role</label>
                  <div className="relative transition-all duration-300 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                      <FiUsers size={18} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white appearance-none cursor-pointer hover:border-blue-300 text-gray-800"
                    >
                      <option value="" disabled>Select Role</option>

                      <option value="STAFF">Staff</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-4 px-6 text-base font-medium rounded-lg text-white ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <FiUserPlus size={20} className="mr-2" />
                      Add Team Member
                    </>
                  )}
                </button>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-center text-gray-500">
                  Team members will receive an automatic email invitation to join your workspace
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}