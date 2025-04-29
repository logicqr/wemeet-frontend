import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Icons
import { CgProfile } from 'react-icons/cg';
import {
  MdOutlineLogout,
  MdPeopleOutline,
  MdOutlineSettings,
} from 'react-icons/md';
import { TbReceiptRupee, TbFileReport } from 'react-icons/tb';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import { BiTime } from 'react-icons/bi';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { RiAdminLine } from 'react-icons/ri';

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Use this to set the role from your authentication system
  const [role, setRole] = useState('admin');
  const [employeeData, setEmployeeData] = useState('John Doe');

  const location = useLocation();
  const navigate = useNavigate();
  const id = sessionStorage.getItem('id');

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle outside clicks for dropdown menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.classList.contains('mobile-menu-button')
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Define menu items based on role
  const getMenuItems = () => {
    // Common menu items for all roles
    const commonItems = [
      {
        name: 'My Attendance',
        path: '/my-attendance',
        icon: <BiTime className="text-lg" />,
      },
      {
        name: 'Leave Requests',
        path: '/my-leave',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'Create Meetings',
        path: '/create-meetings',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'My Meetings',
        path: '/my-meetings',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
    ];

    // Admin menu items
    const adminItems = [
      {
        name: 'My Attendance',
        path: '/my-attendance',
        icon: <BiTime className="text-lg" />,
      },
      {
        name: 'Leave Requests',
        path: '/my-leave',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'Employees',
        path: '/employees-details',
        icon: <MdPeopleOutline className="text-lg" />,
      },
      {
        name: 'Leave Management',
        path: '/leave-management',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'Create Meetings',
        path: '/create-meetings',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'My Meetings',
        path: '/my-meetings',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'Reports',
        path: '/reports',
        icon: <HiOutlineDocumentReport className="text-lg" />,
      },
    ];

    // Super admin additional items
    const superAdminItems = [
      {
        name: 'Leave Management',
        path: '/leave-management',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'Employees',
        path: '/employees-details',
        icon: <MdPeopleOutline className="text-lg" />,
      },
      {
        name: 'Create Meetings',
        path: '/create-meetings',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'My Meetings',
        path: '/my-meetings',
        icon: <FaRegCalendarAlt className="text-lg" />,
      },
      {
        name: 'Reports',
        path: '/reports',
        icon: <HiOutlineDocumentReport className="text-lg" />,
      },
    ];

    // SaaS admin additional items
    const saasAdminItems = [
      {
        name: 'Tenants',
        path: '/tenants',
        icon: <RiAdminLine className="text-lg" />,
      },
      {
        name: 'Billing',
        path: '/billing',
        icon: <TbReceiptRupee className="text-lg" />,
      },
      {
        name: 'Analytics',
        path: '/analytics',
        icon: <TbFileReport className="text-lg" />,
      },
    ];

    switch (role) {
      case 'admin':
        return adminItems;
      case 'super-admin':
        return superAdminItems;
      case 'saas-admin':
        return saasAdminItems;
      case 'staff':
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  // Get role for display
  const getRoleDisplay = () => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'super-admin':
        return 'Super Administrator';
      case 'saas-admin':
        return 'SaaS Administrator';
      case 'staff':
      default:
        return 'Staff Member';
    }
  };

  // Logout function
  const handleLogout = () => {
    setShowLogoutPopup(false);
    // sessionStorage.clear();
    // window.location.href = '/login';
    console.log('User logged out');
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="bg-white text-gray-800 fixed w-full top-0 z-40 shadow-md border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">HRMS</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:ml-10 md:flex md:space-x-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                      location.pathname.includes(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <span className="mr-1.5 text-blue-500">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* User menu and mobile menu button */}
            <div className="flex items-center">
              {/* User dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {employeeData}
                    </span>
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <CgProfile className="h-5 w-5 text-blue-600" />
                    </div>
                  </button>
                </div>

                {userMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {employeeData}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getRoleDisplay()}
                      </p>
                    </div>

                    <Link
                      to="/my-profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <CgProfile className="mr-2 h-4 w-4" />
                      Your Profile
                    </Link>

                    <Link
                      to="/account-setting"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <MdOutlineSettings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>

                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={() => setShowLogoutPopup(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <MdOutlineLogout className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden ml-2">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-button p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <IoMdClose className="block h-6 w-6" />
                  ) : (
                    <IoMdMenu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          ref={mobileMenuRef}
          className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t shadow-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname.includes(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-blue-500">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile user menu */}
          <div className="pt-2 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 py-2">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CgProfile className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {employeeData}
                </div>
                <div className="text-sm text-gray-500">{getRoleDisplay()}</div>
              </div>
            </div>

            <div className="mt-3 px-2 space-y-1 border-t border-gray-100 pt-2">
              <Link
                to="/my-profile"
                className=" px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CgProfile className="mr-3 h-5 w-5" />
                Your Profile
              </Link>
              <Link
                to="/account-setting"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdOutlineSettings className="mr-3 h-5 w-5" />
                Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutPopup(true);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center"
              >
                <MdOutlineLogout className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content Container - just adds padding for navbar */}
      <div className="pt-16">{/* Your page content will go here */}</div>

      {/* Logout Confirmation Modal */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
