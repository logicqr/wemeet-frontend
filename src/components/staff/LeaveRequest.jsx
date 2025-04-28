import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaveRequest() {
  // Constants
  const USER_ID = '793e7fd2-8586-4677-9dda-f08b9d188ca9';
  const today = new Date().toISOString().split('T')[0];

  // State management
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [daysRequested, setDaysRequested] = useState(0);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [activeTab, setActiveTab] = useState('request');

  // Calculate days between selected dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDaysRequested(diffDays);
    } else {
      setDaysRequested(0);
    }
  }, [formData.startDate, formData.endDate]);

  // Clear success message after 5 seconds
  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => setSuccess(''), 5000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  // Fetch leave history on component mount
  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const response = await axios.get(
        `https://wemeet-backend-latest.onrender.com/api/leave-request/${USER_ID}`
      );

      if (response.data && response.data.data) {
        const sortedData = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLeaveHistory(sortedData);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to fetch leave history. Please try again.';
      setHistoryError(errorMessage);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If end date is before start date, update end date
    if (name === 'startDate' && formData.endDate && value > formData.endDate) {
      setFormData((prev) => ({
        ...prev,
        endDate: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setError('Please fill all fields');
      return;
    }

    // Reset states
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data for API
      const leaveData = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        user_id: USER_ID,
      };

      // Make API call
      await axios.post(
        'https://wemeet-backend-latest.onrender.com/api/leave-request',
        leaveData
      );

      setSuccess(
        `Leave request submitted successfully for ${daysRequested} day(s)!`
      );
      setFormData({ startDate: '', endDate: '', reason: '' });
      fetchLeaveHistory();
      setActiveTab('history');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to submit leave request. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Format date in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate the duration of leave in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 lg:py-8 xl:py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Leave Management
          </h1>
          <p className="text-gray-600 mt-2">
            Request and track your time off efficiently
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 py-4 text-center font-medium text-sm ${
                activeTab === 'request'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Request Leave
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 text-center font-medium text-sm ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Leave History
              </div>
            </button>
          </div>

          {/* Request Form */}
          {activeTab === 'request' && (
            <div className="p-5">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        min={today}
                        value={formData.startDate}
                        onChange={handleChange}
                        className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        min={formData.startDate || today}
                        value={formData.endDate}
                        onChange={handleChange}
                        className="pl-10 block w-full border border-gray-300 rounded-lg py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {daysRequested > 0 && (
                  <div className="flex items-center text-sm text-blue-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      You are requesting{' '}
                      <span className="font-semibold">
                        {daysRequested} day(s)
                      </span>{' '}
                      of leave
                    </span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for Leave
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Brief explanation for your leave request"
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end pt-4 space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ startDate: '', endDate: '', reason: '' })
                    }
                    className="py-2.5 px-5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reset
                    </div>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 shadow-sm transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Submit Request
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Leave History */}
          {activeTab === 'history' && (
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Leave Requests
                </h3>
                <button
                  onClick={fetchLeaveHistory}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>

              {historyError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {historyError}
                </div>
              )}

              {historyLoading ? (
                <div className="py-8 flex justify-center">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : leaveHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-300 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>No leave requests found</p>
                  <p className="text-sm mt-1">
                    Submit a request to see your history
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {leaveHistory.map((leave) => (
                    <div
                      key={leave.leave_id}
                      className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                    >
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {formatDate(leave.startDate)} -{' '}
                            {formatDate(leave.endDate)}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(leave.status)}`}
                        >
                          {leave.status}
                        </span>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-gray-500">
                            Submitted on {formatDate(leave.createdAt)}
                          </span>
                          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {calculateDuration(leave.startDate, leave.endDate)}{' '}
                            day(s)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Reason:</span>{' '}
                          {leave.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="p-2.5 bg-blue-100 rounded-lg mr-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Processing Time</h4>
                <p className="text-sm text-blue-700 mt-1">
                  24-48 hours processing time
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="p-2.5 bg-green-100 rounded-lg mr-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-900">Approval Process</h4>
                <p className="text-sm text-green-700 mt-1">
                  Manager and HR review required
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="p-2.5 bg-purple-100 rounded-lg mr-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-purple-900">Need Help?</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Contact <span className="font-medium">hr@company.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
