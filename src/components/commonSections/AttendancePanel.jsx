import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaSpinner,
  FaCalendarAlt,
  FaUserCheck,
  FaExclamationCircle,
  FaClipboardList,
  FaBriefcase,
  FaChartLine,
  FaHistory,
  FaRegBuilding,
  FaInfoCircle,
} from 'react-icons/fa';

const AttendancePanel = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [workReport, setWorkReport] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const userId = 'ad2b1a16-6720-45d9-87a8-a2e8a4d7bfb2';

  // Format elapsed time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get work duration in hours and minutes from seconds
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://wemeet-backend-latest.onrender.com/api/attendance/status',
        { user_id: userId }
      );
      setStatus(res.data.attendanceStatus);
    } catch (err) {
      console.error('Error fetching attendance status', err);
    } finally {
      setLoading(false);
    }
  };

  const getWorkDuration = () => {
    try {
      if (status?.checkIn && status?.checkOut) {
        const checkInTime = new Date(status.checkIn).getTime();
        const checkOutTime = new Date(status.checkOut).getTime();
        const durationSeconds = Math.floor((checkOutTime - checkInTime) / 1000);
        return formatDuration(durationSeconds);
      }
    } catch (error) {
      console.error('Error calculating duration:', error);
    }
    return '0h 0m';
  };

  // Get current geolocation
  const getLocation = () => {
    if (!navigator.geolocation) {
      showMessage('Geolocation not supported', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error', error);
        showMessage('Failed to get your location', 'error');
      }
    );
  };

  // Display message with auto-dismiss
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => setMessage(''), 300); // Clear after fade animation
    }, 3000);
  };

  // Check-in handler
  const handleCheckIn = async () => {
    if (!location.latitude || !location.longitude) {
      showMessage('Location required for check-in', 'error');
      getLocation();
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        'https://wemeet-backend-latest.onrender.com/api/check-in',
        {
          user_id: userId,
          currentLatitude: location.latitude,
          currentLongitude: location.longitude,
        }
      );
      showMessage('Check-in successful');
      fetchStatus(); // refresh status
    } catch (err) {
      showMessage(err.response?.data?.message || 'Check-in failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Check-out handler
  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await axios.post(
        'https://wemeet-backend-latest.onrender.com/api/attendance/check-out',
        {
          user_id: userId,
          report: workReport,
        }
      );
      setShowReportModal(false);
      setWorkReport('');
      showMessage('Checked out successfully');
      fetchStatus();
    } catch (err) {
      showMessage('Check-out failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Initialize data and location
  useEffect(() => {
    fetchStatus();
    getLocation();
  }, []);

  // Running timer effect when checked in but not out
  useEffect(() => {
    let timer;
    if (status && status.checkIn && !status.checkOut) {
      const startTime = new Date(status.checkIn).getTime();

      // Initialize elapsed time
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));

      // Start timer
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Notification */}
      <div
        className={`fixed top-4 right-4 transition-all duration-300 z-50 ${showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div
          className={`rounded-lg shadow-lg p-3 flex items-center ${message.includes('failed') || message.includes('error') ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}
        >
          <div className="mr-2">
            {message.includes('failed') || message.includes('error') ? (
              <FaExclamationCircle className="text-red-500" size={20} />
            ) : (
              <FaCheckCircle className="text-green-500" size={20} />
            )}
          </div>
          <p
            className={`text-sm font-medium ${message.includes('failed') || message.includes('error') ? 'text-red-700' : 'text-green-700'}`}
          >
            {message}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto max-w-6xl px-4 py-4">
        {/* Header */}
        <header className="bg-white shadow-sm rounded-lg sticky top-0 z-10 mb-4">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3">
                <FaRegBuilding className="text-white" size={16} />
              </div>
              <h1 className="text-lg font-bold text-gray-800">Attendance</h1>
            </div>
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt size={14} className="mr-2" />
              <span className="font-medium text-sm">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 relative mb-2">
                <div className="absolute top-0 left-0 w-full h-full border-3 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-3 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="text-gray-500 text-sm">Loading your status...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FaUserCheck className="text-purple-600" size={16} />
                  </div>
                  <p className="ml-2 text-sm font-medium text-gray-700">
                    Status
                  </p>
                </div>
                <div className="flex items-center">
                  {status && !status.checkOut ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-semibold text-green-600 text-sm">
                        Active
                      </span>
                    </div>
                  ) : status && status.checkOut ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-blue-600 text-sm">
                        Completed
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-500 text-sm">
                        Not Started
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FaClock className="text-blue-600" size={16} />
                  </div>
                  <p className="ml-2 text-sm font-medium text-gray-700">
                    Check-in
                  </p>
                </div>
                <div className="font-semibold text-gray-800 text-sm">
                  {status && status.checkIn
                    ? new Date(status.checkIn).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Not checked in'}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FaSignOutAlt className="text-amber-600" size={16} />
                  </div>
                  <p className="ml-2 text-sm font-medium text-gray-700">
                    Check-out
                  </p>
                </div>
                <div className="font-semibold text-gray-800 text-sm">
                  {status && status.checkOut
                    ? new Date(status.checkOut).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Not checked out'}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <FaChartLine className="text-green-600" size={16} />
                  </div>
                  <p className="ml-2 text-sm font-medium text-gray-700">
                    Duration
                  </p>
                </div>
                <div className="font-semibold text-gray-800 text-sm">
                  {status && !status.checkOut
                    ? formatDuration(elapsedTime)
                    : status && status.checkOut
                      ? getWorkDuration()
                      : '0h 0m'}
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden">
              {/* Not Checked In */}
              {!status?.checkIn && (
                <div className="md:flex">
                  <div className="md:w-1/3 p-6 flex flex-col items-center md:items-start">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                      <FaClock size={36} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Ready to Start
                    </h3>
                    <p className="text-gray-500 text-sm text-center md:text-left mb-3">
                      Start your workday by clicking check-in.
                    </p>

                    <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-medium mb-4">
                      <FaMapMarkerAlt className="mr-1" size={12} />
                      Location required for check-in
                    </div>

                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm shadow-sm transition-all disabled:opacity-70 flex items-center justify-center"
                    >
                      {actionLoading ? (
                        <FaSpinner className="animate-spin mr-2" size={16} />
                      ) : (
                        <FaCheckCircle className="mr-2" size={16} />
                      )}
                      {actionLoading ? 'Processing...' : 'Check In'}
                    </button>
                  </div>

                  <div className="md:w-2/3 bg-gray-50 p-6 md:border-l border-gray-100 md:border-t-0 border-t">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-4">
                      Today's Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                            <FaClock size={14} className="text-blue-600" />
                          </div>
                          <div className="ml-2 font-medium text-sm text-gray-700">
                            Working Hours
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs">
                          Work hours are tracked automatically from check-in to
                          check-out.
                        </p>
                      </div>

                      <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
                            <FaClipboardList
                              size={14}
                              className="text-green-600"
                            />
                          </div>
                          <div className="ml-2 font-medium text-sm text-gray-700">
                            Work Summary
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs">
                          Submit a work report when checking out at the end of
                          your day.
                        </p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <FaInfoCircle
                          size={14}
                          className="text-indigo-600 mr-2"
                        />
                        <h4 className="font-medium text-sm text-indigo-800">
                          Getting Started
                        </h4>
                      </div>
                      <p className="text-indigo-700 text-xs mb-2">
                        Check in to start your workday. Your attendance will be
                        recorded automatically.
                      </p>
                      <div className="flex items-center text-indigo-700 text-xs">
                        <FaCheckCircle size={12} className="mr-1" />
                        <span>Location services required</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Session */}
              {status?.checkIn && !status?.checkOut && (
                <div className="md:flex">
                  <div className="md:w-1/3 p-6 flex flex-col items-center md:items-start">
                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center mb-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-1 animate-pulse"></div>
                      Active Session
                    </div>

                    <div className="w-32 h-32 relative mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-50"></div>
                      <div className="absolute inset-2 rounded-full border-2 border-blue-300 border-dashed animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className="text-xl font-mono font-bold text-blue-800">
                          {formatTime(elapsedTime)}
                        </div>
                        <div className="text-blue-600 text-xs mt-1 font-medium">
                          Hours Worked
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 mb-4 text-xs">
                      <FaMapMarkerAlt size={12} className="mr-1" />
                      <span>Location verified</span>
                    </div>

                    <button
                      onClick={() => setShowReportModal(true)}
                      disabled={actionLoading}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm shadow-sm transition-all disabled:opacity-70 flex items-center justify-center"
                    >
                      {actionLoading ? (
                        <FaSpinner className="animate-spin mr-2" size={16} />
                      ) : (
                        <FaSignOutAlt className="mr-2" size={16} />
                      )}
                      {actionLoading ? 'Processing...' : 'Check Out'}
                    </button>
                  </div>

                  <div className="md:w-2/3 bg-gray-50 p-6 md:border-l border-gray-100 md:border-t-0 border-t">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-4">
                      Session Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                            <FaClock size={14} className="text-blue-600" />
                          </div>
                          <div className="ml-2">
                            <div className="text-xs text-gray-500">
                              Check-in Time
                            </div>
                            <div className="font-semibold text-gray-800 text-sm">
                              {new Date(status.checkIn).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
                            <FaUserCheck size={14} className="text-green-600" />
                          </div>
                          <div className="ml-2">
                            <div className="text-xs text-gray-500">Status</div>
                            <div className="font-semibold text-green-600 text-sm">
                              Active
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
                        Current Session
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span className="text-gray-600 text-xs">
                            Elapsed Time
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {formatDuration(elapsedTime)}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-gray-600 text-xs">
                            Today's Date
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {new Date().toLocaleDateString()}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-gray-600 text-xs">
                            Location Status
                          </span>
                          <span className="font-semibold text-green-600 text-sm">
                            Verified
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-indigo-50 rounded-md p-3 flex items-start">
                      <FaInfoCircle
                        className="text-indigo-600 mt-0.5 flex-shrink-0 mr-2"
                        size={14}
                      />
                      <p className="text-xs text-indigo-700">
                        Your active session is being tracked. When checking out,
                        you'll be asked to submit a work report.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Completed Session */}
              {status?.checkIn && status?.checkOut && (
                <div className="md:flex">
                  <div className="md:w-1/3 p-6 flex flex-col items-center md:items-start">
                    <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center mb-4">
                      <FaCheckCircle size={12} className="mr-1" />
                      Completed
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm text-center w-full mb-4">
                      <div className="inline-block p-4 bg-green-50 rounded-full mb-4">
                        <FaCheckCircle size={24} className="text-green-600" />
                      </div>

                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                        Total Work Duration
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {getWorkDuration()}
                      </div>
                      <div className="inline-flex items-center text-green-600 font-medium text-xs">
                        <FaCheckCircle size={12} className="mr-1" />
                        <span>Workday complete</span>
                      </div>
                    </div>

                    <button
                      disabled={true}
                      className="w-full bg-gray-300 text-gray-600 py-2.5 px-4 rounded-lg font-medium text-sm shadow-sm flex items-center justify-center cursor-not-allowed"
                    >
                      <FaCheckCircle className="mr-2" size={16} />
                      Day Completed
                    </button>
                  </div>

                  <div className="md:w-2/3 bg-gray-50 p-6 md:border-l border-gray-100 md:border-t-0 border-t">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-4">
                      Session Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                            <FaClock size={14} className="text-blue-600" />
                          </div>
                          <div className="ml-2">
                            <div className="text-xs text-gray-500">
                              Check-in Time
                            </div>
                            <div className="font-semibold text-gray-800 text-sm">
                              {new Date(status.checkIn).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
                            <FaSignOutAlt
                              size={14}
                              className="text-green-600"
                            />
                          </div>
                          <div className="ml-2">
                            <div className="text-xs text-gray-500">
                              Check-out Time
                            </div>
                            <div className="font-semibold text-gray-800 text-sm">
                              {new Date(status.checkOut).toLocaleTimeString(
                                [],
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-sm mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase">
                          Work Summary
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <FaClipboardList
                          size={14}
                          className="text-gray-400 mr-1"
                        />
                        <span className="font-medium text-gray-700 text-xs">
                          Work Report
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700 text-xs">
                          {status.report || 'No report submitted.'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-md p-3 border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Check-in Date
                        </div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {new Date(status.checkIn).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-white rounded-md p-3 border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Total Hours
                        </div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {getWorkDuration()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                    <FaInfoCircle className="text-blue-600" size={12} />
                  </div>
                  <h3 className="ml-2 font-medium text-gray-700 text-sm">
                    Working Hours
                  </h3>
                </div>
                <p className="text-gray-600 text-xs">
                  Your hours are tracked automatically from check-in to
                  check-out. Remember to submit a report before checking out.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-purple-600" size={12} />
                  </div>
                  <h3 className="ml-2 font-medium text-gray-700 text-sm">
                    Location Tracking
                  </h3>
                </div>
                <p className="text-gray-600 text-xs">
                  Your location is only captured at check-in to verify your
                  presence. No continuous tracking is performed.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
                    <FaClipboardList className="text-green-600" size={12} />
                  </div>
                  <h3 className="ml-2 font-medium text-gray-700 text-sm">
                    Work Reports
                  </h3>
                </div>
                <p className="text-gray-600 text-xs">
                  Detailed summaries help track accomplishments. Be specific
                  about tasks completed and goals achieved.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-center text-xs text-gray-500 mb-2 sm:mb-0">
                  <FaRegBuilding size={10} className="mr-1" />
                  <span>Enterprise HR System v2.5</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <FaMapMarkerAlt size={10} className="mr-1" />
                    <span>Location enabled</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <FaCalendarAlt size={10} className="mr-1" />
                    <span>Attendance system</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                Work Report
              </h2>
              <p className="text-gray-500 text-sm">
                Summarize your accomplishments for today
              </p>
            </div>
            <div className="mb-4">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32 text-gray-700 placeholder-gray-400 text-sm"
                placeholder="Describe what you've worked on today..."
                value={workReport}
                onChange={(e) => setWorkReport(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setWorkReport('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckOut}
                disabled={actionLoading || !workReport.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-60 disabled:shadow-none flex items-center"
              >
                {actionLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-1.5" size={14} />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-1.5" size={14} />
                    <span>Submit & Check Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePanel;
