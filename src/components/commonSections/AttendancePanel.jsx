import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiLogOut,
  FiLoader,
  FiCalendar,
  FiUserCheck,
  FiAlertCircle,
} from 'react-icons/fi';

const AttendancePanel = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const user_id = 'ad2b1a16-6720-45d9-87a8-a2e8a4d7bfb2';

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

  // Calculate completed work duration
  // const getWorkDuration = () => {
  //     if (status && status.checkOut && status.checkIn) {
  //         const checkInTime = new Date(status.checkIn).getTime();
  //         const checkOutTime = new Date(status.checkOut).getTime();
  //         const durationSeconds = Math.floor((checkOutTime - checkInTime) / 1000);
  //         return formatDuration(durationSeconds);
  //     }
  //     return "0h 0m";
  // };

  // Fetch current attendance status
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://wemeet-backend-latest.onrender.com/api/attendance/status',
        { user_id }
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
        console.log(checkInTime);
        console.log(checkOutTime);

        const durationSeconds = Math.floor((checkOutTime - checkInTime) / 1000);
        const hours = Math.floor(durationSeconds / 3600);
        const minutes = Math.floor((durationSeconds % 3600) / 60);

        return `${hours}h ${minutes}m`;
      }
    } catch (error) {
      console.error('Error calculating duration:', error);
    }
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
          user_id,
          latitude: location.latitude,
          longitude: location.longitude,
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
        { user_id }
      );
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

    // Debug logged-in time calculation
    if (status && status.checkOut) {
      console.log('Check-in time:', new Date(status.checkIn));
      console.log('Check-out time:', new Date(status.checkOut));
      const duration =
        (new Date(status.checkOut) - new Date(status.checkIn)) / 1000;
      console.log('Duration in seconds:', duration);
    }
  }, []);

  // Running timer effect when checked in but not out
  useEffect(() => {
    let timer;
    if (status && !status.checkOut) {
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Notification */}
      <div
        className={`fixed top-4 right-4 left-4 md:left-auto md:w-80 transition-all duration-300 z-50 ${showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div
          className={`rounded-lg shadow-lg p-4 flex items-center ${message.includes('failed') || message.includes('error') ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}
        >
          <div className="mr-3">
            {message.includes('failed') || message.includes('error') ? (
              <FiAlertCircle className="text-red-500" size={20} />
            ) : (
              <FiCheckCircle className="text-green-500" size={20} />
            )}
          </div>
          <p
            className={`text-sm ${message.includes('failed') || message.includes('error') ? 'text-red-700' : 'text-green-700'}`}
          >
            {message}
          </p>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Attendance</h1>
          <div className="flex items-center justify-center text-gray-500">
            <FiCalendar size={16} className="mr-1.5" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-4 flex-1 flex flex-col">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 relative mb-3">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-gray-500">Loading your status...</p>
              </div>
            </div>
          )}

          {!loading && (
            <div className="p-6 flex-1 flex flex-col">
              {/* Status Section */}
              <div className="mb-6 flex-1">
                {status ? (
                  <>
                    {/* Active Session */}
                    {!status.checkOut && (
                      <div className="text-center mb-6">
                        <div className="mb-2">
                          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            <FiUserCheck size={14} className="mr-1" />
                            Active Session
                          </div>
                        </div>

                        <div className="w-48 h-48 mx-auto relative my-6">
                          <div className="absolute inset-0 rounded-full border-8 border-blue-100"></div>
                          <div className="absolute inset-2 rounded-full border-4 border-blue-400 border-dashed animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <div className="text-4xl font-mono font-bold text-blue-800">
                              {formatTime(elapsedTime)}
                            </div>
                            <div className="text-blue-500 text-sm mt-1">
                              Hours Worked
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <FiClock size={18} className="text-blue-500 mr-2" />
                            <span className="text-gray-700">Checked In</span>
                          </div>
                          <span className="font-medium text-blue-700">
                            {new Date(status.checkIn).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Completed Session */}
                    {status.checkOut && (
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="inline-flex items-center justify-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                          <FiCheckCircle size={14} className="mr-1" />
                          Completed
                        </div>

                        <div className="flex justify-center items-center gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">
                              Checked In
                            </div>
                            <div className="font-semibold text-gray-800">
                              {new Date(status.checkIn).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>

                          <div className="relative w-16 h-0 border-t-2 border-gray-300">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              <FiClock size={14} className="text-gray-400" />
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">
                              Checked Out
                            </div>
                            <div className="font-semibold text-gray-800">
                              {new Date(status.checkOut).toLocaleTimeString(
                                [],
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-600 mb-1">
                            Total Work Duration
                          </div>
                          <div className="text-2xl font-bold text-green-800">
                            {getWorkDuration()}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 h-full">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiClock size={36} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      Ready to Start
                    </h3>
                    <p className="text-gray-500 text-center">
                      You haven't checked in yet today. Start your workday when
                      you're ready.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                {!status && (
                  <button
                    onClick={handleCheckIn}
                    disabled={actionLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-medium text-lg shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:transform-none disabled:shadow-none flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <FiLoader className="animate-spin mr-2" size={20} />
                    ) : (
                      <FiCheckCircle className="mr-2" size={20} />
                    )}
                    {actionLoading ? 'Processing...' : 'Check In'}
                  </button>
                )}

                {status && !status.checkOut && (
                  <button
                    onClick={handleCheckOut}
                    disabled={actionLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 px-6 rounded-xl font-medium text-lg shadow-lg shadow-amber-200 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:transform-none disabled:shadow-none flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <FiLoader className="animate-spin mr-2" size={20} />
                    ) : (
                      <FiLogOut className="mr-2" size={20} />
                    )}
                    {actionLoading ? 'Processing...' : 'Check Out'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Location indicator */}

        <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
          <FiMapPin size={12} className="mr-1" />
          <span>Location captured</span>
        </div>
      </div>
    </div>
  );
};

export default AttendancePanel;
