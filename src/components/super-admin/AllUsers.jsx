import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaUserShield, FaUserTie, FaUsers, FaSearch, FaEllipsisV, FaEdit, FaTrash, FaSlidersH } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import { HiUserGroup } from 'react-icons/hi';
import { RiAdminFill } from 'react-icons/ri';

const UserManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://wemeet-backend-latest.onrender.com/api/all-users', {
        company_id: 'cm9yglvn40000dg2ovt5v0rrq'
      });
      
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setTimeout(() => setRefreshing(false), 600); // Visual feedback
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on activeFilter and searchTerm
    let result = [...users];
    
    // Apply role filter
    if (activeFilter !== 'ALL') {
      result = result.filter(user => user.role === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.userName.toLowerCase().includes(searchLower) ||
        (user.department && user.department.toLowerCase().includes(searchLower)) ||
        (user.position && user.position.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredUsers(result);
  }, [activeFilter, searchTerm, users]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <FaUserTie className="text-indigo-600" />;
      case 'ADMIN':
        return <FaUserShield className="text-blue-600" />;
      case 'STAFF':
        return <FaUser className="text-emerald-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'STAFF':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm" role="alert">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <strong className="font-medium text-red-800">Error Occurred</strong>
        </div>
        <p className="mt-2">{error}</p>
        <div className="mt-4">
          <button 
            onClick={fetchUsers}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors duration-200 flex items-center text-sm font-medium"
          >
            <IoMdRefresh className="mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <HiUserGroup className="mr-2 text-indigo-600" />
              User Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and organize all users from a single dashboard
            </p>
          </div>
          
          <button 
            onClick={handleRefresh}
            className={`inline-flex items-center text-sm px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 ${refreshing ? 'opacity-75' : ''}`}
          >
            <IoMdRefresh className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>
      
      {/* Filter and Search Section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Role Filters */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button 
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'ALL' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleFilterChange('ALL')}
            >
              <FaUsers className={activeFilter === 'ALL' ? 'text-white' : 'text-indigo-500'} />
              <span>All Users</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeFilter === 'ALL' ? 'bg-indigo-500 bg-opacity-30 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {users.length}
              </span>
            </button>
            
            <button 
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'SUPER_ADMIN' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleFilterChange('SUPER_ADMIN')}
            >
              <RiAdminFill className={activeFilter === 'SUPER_ADMIN' ? 'text-white' : 'text-indigo-500'} />
              <span>Super Admins</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeFilter === 'SUPER_ADMIN' ? 'bg-indigo-500 bg-opacity-30 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {users.filter(user => user.role === 'SUPER_ADMIN').length}
              </span>
            </button>
            
            <button 
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'ADMIN' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleFilterChange('ADMIN')}
            >
              <FaUserShield className={activeFilter === 'ADMIN' ? 'text-white' : 'text-blue-500'} />
              <span>Admins</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeFilter === 'ADMIN' ? 'bg-indigo-500 bg-opacity-30 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {users.filter(user => user.role === 'ADMIN').length}
              </span>
            </button>
            
            <button 
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'STAFF' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleFilterChange('STAFF')}
            >
              <FaUser className={activeFilter === 'STAFF' ? 'text-white' : 'text-emerald-500'} />
              <span>Staff</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeFilter === 'STAFF' ? 'bg-indigo-500 bg-opacity-30 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {users.filter(user => user.role === 'STAFF').length}
              </span>
            </button>
          </div>
          
          {/* Search Box */}
          <div className="relative w-full lg:w-64 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                        <div className="text-xs text-gray-500 mt-1">{user.user_id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.department ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs">
                          {user.department}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Not assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.position || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-md ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200">
                          <FaEdit />
                        </button>
                        <button className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200">
                          <FaTrash />
                        </button>
                        <button 
                          onClick={() => toggleDropdown(user.user_id)}
                          className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                        >
                          <FaEllipsisV />
                        </button>
                      </div>
                      
                      {dropdownOpen === user.user_id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                              View Profile
                            </button>
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                              Assign to Project
                            </button>
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                              Change Permissions
                            </button>
                            <button className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left" role="menuitem">
                              Deactivate Account
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-600 text-sm font-medium mb-1">No users found</p>
                    <p className="text-gray-400 text-xs">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination and Summary */}
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 flex items-center">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 mr-2">
              <HiUserGroup size={16} />
            </span>
            Showing <span className="font-medium text-gray-900 mx-1">{filteredUsers.length}</span> of <span className="font-medium text-gray-900 mx-1">{users.length}</span> users
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-3">Page 1 of 1</span>
            <div className="relative z-0 inline-flex shadow-sm rounded-md">
              <button 
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <button
                className="relative -ml-px inline-flex items-center px-4 py-2 border border-gray-200 bg-indigo-50 text-sm font-medium text-indigo-600"
              >
                1
              </button>
              <button
                className="relative -ml-px inline-flex items-center px-3 py-2 rounded-r-md border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true}
              >
                Next
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSection;