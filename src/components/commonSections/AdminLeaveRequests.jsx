import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  // Admin ID - in production this would come from authentication context
  const ADMIN_ID = 'd0dca25f-15f8-4f4d-b1eb-3dd80a1f15c3';
  const ROLE = 'admin';

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://wemeet-backend-latest.onrender.com/api/${ROLE}-leave-request`
      );
      if (response.data && response.data.LeaveRequests) {
        setLeaveRequests(response.data.LeaveRequests || []);
      } else {
        setLeaveRequests([]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leave requests:', err);
      setError('Failed to load leave requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (leaveId, status) => {
    setProcessingId(leaveId);
    try {
      await axios.post(
        'https://wemeet-backend-latest.onrender.com/api/leave-request/update-status',
        {
          leave_id: leaveId,
          status: status,
          approvedBy: ADMIN_ID,
        }
      );

      // Update local state to reflect the change
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.leave_id === leaveId
            ? { ...request, status: status, approvedBy: ADMIN_ID }
            : request
        )
      );
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} leave request:`, err);
      setError(
        `Failed to ${status.toLowerCase()} the request. Please try again.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Function to format date in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date for mobile view (shorter)
  const formatDateShort = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate duration between dates
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Filter leave requests based on selected filter
  const filteredRequests =
    activeTab === 'ALL'
      ? leaveRequests
      : leaveRequests.filter((request) => request.status === activeTab);

  // Count leave requests by status
  const statusCounts = leaveRequests.reduce((counts, request) => {
    counts[request.status] = (counts[request.status] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Leave Request Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage employee leave requests
          </p>
        </div>

        <div className="flex flex-col bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Tabs - Desktop */}
          <div className="hidden sm:block px-4 sm:px-6 border-b border-gray-200">
            <div className="flex -mb-px overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`py-4 px-4 md:px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
              >
                All Requests
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-700">
                  {leaveRequests.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('PENDING')}
                className={`py-4 px-4 md:px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'PENDING'
                    ? 'border-b-2 border-yellow-500 text-yellow-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
              >
                Pending
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-yellow-50 text-yellow-700">
                  {statusCounts.PENDING || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('APPROVED')}
                className={`py-4 px-4 md:px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'APPROVED'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
              >
                Approved
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-green-50 text-green-700">
                  {statusCounts.APPROVED || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('REJECTED')}
                className={`py-4 px-4 md:px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'REJECTED'
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
              >
                Rejected
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-red-50 text-red-700">
                  {statusCounts.REJECTED || 0}
                </span>
              </button>

              <div className="ml-auto flex items-center pr-2">
                <button
                  onClick={fetchLeaveRequests}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-3.5 w-3.5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
            </div>
          </div>

          {/* Tabs - Mobile */}
          <div className="sm:hidden sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="relative w-full max-w-[200px]">
                <div className="relative">
                  <button
                    type="button"
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onClick={() =>
                      document.getElementById('mobile-tabs').focus()
                    }
                  >
                    <span className="flex items-center">
                      <span className="block truncate">
                        {activeTab === 'ALL'
                          ? 'All Requests'
                          : activeTab === 'PENDING'
                            ? 'Pending'
                            : activeTab === 'APPROVED'
                              ? 'Approved'
                              : 'Rejected'}
                      </span>
                      {activeTab !== 'ALL' && (
                        <span
                          className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${
                            activeTab === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : activeTab === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {statusCounts[activeTab] || 0}
                        </span>
                      )}
                      {activeTab === 'ALL' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {leaveRequests.length}
                        </span>
                      )}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>

                  <select
                    id="mobile-tabs"
                    name="tabs"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    aria-label="Select a tab"
                  >
                    <option value="ALL">
                      All Requests ({leaveRequests.length})
                    </option>
                    <option value="PENDING">
                      Pending ({statusCounts.PENDING || 0})
                    </option>
                    <option value="APPROVED">
                      Approved ({statusCounts.APPROVED || 0})
                    </option>
                    <option value="REJECTED">
                      Rejected ({statusCounts.REJECTED || 0})
                    </option>
                  </select>
                </div>
              </div>
              <button
                onClick={fetchLeaveRequests}
                className="flex items-center ml-2 px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50"
              >
                <svg
                  className="h-3.5 w-3.5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
          </div>

          {/* Error message */}
          {error && (
            <div className="m-4 sm:m-6 border border-red-100 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-500">
                  Loading requests...
                </span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No leave requests
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'ALL'
                    ? 'There are no leave requests to display.'
                    : `There are no ${activeTab.toLowerCase()} leave requests.`}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.leave_id}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 hidden sm:block">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="sm:ml-4 flex-1">
                        <div className="flex items-center justify-between sm:justify-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {request.user?.userName || 'Employee'}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {request.user?.position || ''}
                            </span>
                          </div>
                          <div className="sm:hidden ml-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                              ${
                                request.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : request.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="hidden sm:inline">
                              {formatDate(request.startDate)} —{' '}
                              {formatDate(request.endDate)}
                            </span>
                            <span className="sm:hidden">
                              {formatDateShort(request.startDate)} —{' '}
                              {formatDateShort(request.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              {calculateDuration(
                                request.startDate,
                                request.endDate
                              )}{' '}
                              day
                              {calculateDuration(
                                request.startDate,
                                request.endDate
                              ) !== 1
                                ? 's'
                                : ''}
                            </span>
                          </div>
                          <div className="flex items-center xs:col-span-2 sm:col-span-1">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            <span className="hidden sm:inline">
                              Requested on {formatDate(request.createdAt)}
                            </span>
                            <span className="sm:hidden">
                              Requested {formatDateShort(request.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 hidden sm:flex sm:flex-col sm:items-end">
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            request.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      {request.user?.role && (
                        <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {request.user.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <div className="sm:col-span-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-500">
                            Reason:{' '}
                          </span>
                          <span className="text-gray-700">
                            {request.reason || 'No reason provided'}
                          </span>
                        </div>
                      </div>

                      {request.status === 'PENDING' && (
                        <div className="mt-3 sm:mt-0 flex justify-end space-x-2 sm:space-x-3">
                          <button
                            disabled={processingId === request.leave_id}
                            onClick={() =>
                              updateLeaveStatus(request.leave_id, 'REJECTED')
                            }
                            className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            {processingId === request.leave_id ? (
                              <>
                                <svg
                                  className="animate-spin -ml-0.5 mr-1.5 h-3 w-3"
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
                                <span className="hidden sm:inline">
                                  Processing...
                                </span>
                                <span className="sm:hidden">...</span>
                              </>
                            ) : (
                              'Reject'
                            )}
                          </button>
                          <button
                            disabled={processingId === request.leave_id}
                            onClick={() =>
                              updateLeaveStatus(request.leave_id, 'APPROVED')
                            }
                            className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {processingId === request.leave_id ? (
                              <>
                                <svg
                                  className="animate-spin -ml-0.5 mr-1.5 h-3 w-3"
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
                                <span className="hidden sm:inline">
                                  Processing...
                                </span>
                                <span className="sm:hidden">...</span>
                              </>
                            ) : (
                              'Approve'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
