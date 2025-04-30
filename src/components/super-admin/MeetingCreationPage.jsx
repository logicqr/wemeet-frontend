import { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaLink, FaFileAlt, FaPlusCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function MeetingCreationPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [link, setLink] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Company ID would typically come from auth context or similar
  const company_id = "cm9yglvn40000dg2ovt5v0rrq"
  const currentUserId= "17319b75-0f8e-4d50-8b05-e845069f4c75"

  useEffect(() => {
    fetchUsers();
  }, []);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post('https://wemeet-backend-latest.onrender.com/api/all-users', { company_id });
      const usersWithoutSelf = response.data.filter(user => user.user_id !== currentUserId);
      setAllUsers(usersWithoutSelf);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Combine date and time for scheduledAt
      const combinedDateTime = new Date(`${scheduledAt}T${scheduledTime}`);
      
      const meetingData = {
        user_id: currentUserId,
        title,
        description,
        scheduledAt: combinedDateTime.toString(),
        link,
        participantIds: [currentUserId, ...selectedUsers.map(user => user.user_id)]
      };
      
      await axios.post('https://wemeet-backend-latest.onrender.com/api/create-meeting', meetingData);
      
      setSuccess(true);
      // Reset form after successful submission
      setTitle('');
      setDescription('');
      setScheduledAt('');
      setScheduledTime('');
      setLink('');
      setSelectedUsers([]);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(err.response?.data?.error || 'Failed to create meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUserSelect = (user) => {
    if (!selectedUsers.some(u => u.user_id === user.user_id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setShowUserDropdown(false);
  };
  
  const removeUser = (user_id) => {
    setSelectedUsers(selectedUsers.filter(user => user.user_id !== user_id));
  };

  const filteredUsers = allUsers.filter(user => 
    !selectedUsers.some(selectedUser => selectedUser.user_id === user.user_id)
  );

  return (
    <div className="min-h-screen container mx-auto">
      <div className="w-[90%] mx-auto  mt-5">
        {/* Modern horizontal layout with header section */}
        <div className="relative overflow-hidden rounded-xl shadow-2xl">
      {/* Background image with enhanced gradient overlay */}
      <div className="absolute inset-0  bg-blue-600">
        {/* Background image */}
        <img 
          src="https://ik.imagekit.io/69rzkdyiaw/guh7.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-blue-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      {/* Content with enhanced styling */}
      <div className="relative py-8 px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/30 backdrop-blur-sm mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-200 mr-2"></div>
              <span className="text-xs font-medium text-blue-100">Quick Scheduling</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Schedule New Meeting</h1>
            <p className="text-blue-100 mt-2 text-lg">Create a new meeting and invite participants</p>
            <div className="mt-6 flex space-x-3">
              <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-0.5">
                View Meetings
              </button>
              {/* <button className="px-6 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200">
                Learn More
              </button> */}
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-md"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 shadow-xl">
              <svg className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V6M16 2V6M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30331M8.29431 16.7H8.30331" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
    </div>
        
        {/* Form in a white card */}
        <div className="bg-white rounded-b-xl py-6">
          <form onSubmit={handleSubmit}>
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                Meeting created successfully!
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Two column layout */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left column - Main meeting details */}
              <div className="flex-1 space-y-6">
                {/* Title */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaFileAlt className="w-4 h-4 mr-2 text-blue-600" />
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter meeting title"
                  />
                </div>
                
                {/* Date and Time in horizontal layout */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Date */}
                  <div className="flex-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="w-4 h-4 mr-2 text-blue-600" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Time */}
                  <div className="flex-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaClock className="w-4 h-4 mr-2 text-blue-600" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Link */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaLink className="w-4 h-4 mr-2 text-blue-600" />
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://meet.example.com/your-meeting"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaFileAlt className="w-4 h-4 mr-2 text-blue-600" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                    placeholder="Enter meeting description and agenda"
                  ></textarea>
                </div>
              </div>
              
              {/* Right column - Participants */}
              <div className="md:w-1/3 space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                    <FaUsers className="w-4 h-4 mr-2 text-blue-600" />
                    Participants
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <span>Add participants</span>
                      <FaPlusCircle className="w-4 h-4 text-blue-600" />
                    </button>
                    
                    {showUserDropdown && (
                      <div ref={dropdownRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map(user => (
                            <div
                              key={user.user_id}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                              onClick={() => handleUserSelect(user)}
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-2">
                                {user.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{user.userName} ({user.position})</p>
                                <p className="text-sm text-gray-500">{user.role}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No more users available</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Participants */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Selected ({selectedUsers.length}):</p>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {selectedUsers.map(user => (
                        <div
                          key={user.user_id}
                          className="bg-white text-blue-700 px-3 py-1 rounded-full flex items-center text-sm border border-blue-200"
                        >
                          <span>{user.userName}</span>
                          <button
                            type="button"
                            onClick={() => removeUser(user.user_id)}
                            className="ml-1 p-1 hover:text-red-600"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* You going status */}
                  <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium mr-2">
                      <FaUsers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">You're attending</p>
                      <p className="text-xs text-green-600">As meeting organizer</p>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="mt- flex justify-center md:justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-70 flex items-center"
                  >
                    {isLoading ? 'Creating...' : 'Schedule Meeting'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}