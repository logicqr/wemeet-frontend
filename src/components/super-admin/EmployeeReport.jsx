import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaFilter,
  FaChevronDown,
  FaSearch,
  FaTimes,
  FaDownload,
  FaArrowLeft,
  FaEye,
  FaCloudDownloadAlt,
} from 'react-icons/fa';

export default function ModernEmployeeReport() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState(getTodayMinusDays(2));
  const [endDate, setEndDate] = useState(getToday());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState(getTodayMinusDays(30));
  const [exportEndDate, setExportEndDate] = useState(getToday());
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  // New state for multi-select staff
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showBulkExportModal, setShowBulkExportModal] = useState(false);

  const companyId = 'cm9yglvn40000dg2ovt5v0rrq';

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetchingUsers(true);
        const response = await axios.post(
          'https://wemeet-backend-latest.onrender.com/api/all-users',
          { company_id: companyId }
        );
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError(
          `Error loading users: ${err.response?.data?.error || err.message}`
        );
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, [companyId]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Reset selected records when report changes
  useEffect(() => {
    if (report) {
      setSelectedRecords([]);
      setSelectAll(false);
    }
  }, [report]);

  // Handle select all toggle
  useEffect(() => {
    if (selectAll && report?.attendance) {
      setSelectedRecords(
        report.attendance.map((record) => record.attendance_id)
      );
    } else if (!selectAll) {
      setSelectedRecords([]);
    }
  }, [selectAll, report]);

  // Handle staff selection
  const toggleStaffSelection = (userId) => {
    if (selectedStaff.includes(userId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== userId));
    } else {
      setSelectedStaff([...selectedStaff, userId]);
    }
  };

  // Select all staff toggle
  const toggleSelectAllStaff = () => {
    if (selectedStaff.length === filteredUsers.length) {
      // If all are selected, deselect all
      setSelectedStaff([]);
    } else {
      // Otherwise select all
      setSelectedStaff(filteredUsers.map((user) => user.user_id));
    }
  };

  // Fetch user report
  const fetchReport = async (userId = selectedUser) => {
    if (!userId) {
      setError('Please select a user');
      return;
    }

    setLoading(true);
    setError('');
    console.log(selectedUser);

    try {
      const response = await axios.get(
        `https://wemeet-backend-latest.onrender.com/api/user-report/${userId}`,
        {
          params: { startDate, endDate },
        }
      );
      setReport(response.data);
      setSelectedUser(userId);
    } catch (err) {
      setError(
        `Error loading report: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Export functions
  const exportToPDF = () => {
    alert(
      `Exporting PDF data from ${formatDate(exportStartDate)} to ${formatDate(exportEndDate)}`
    );
    setShowExportModal(false);
  };

  const exportToExcel = () => {
    alert(
      `Exporting Excel data from ${formatDate(exportStartDate)} to ${formatDate(exportEndDate)}`
    );
    setShowExportModal(false);
  };

  const bulkExport = () => {
    alert(
      `Exporting data for ${selectedStaff.length} staff members from ${formatDate(exportStartDate)} to ${formatDate(exportEndDate)} in ${exportFormat} format`
    );
    setShowBulkExportModal(false);
  };

  const downloadRecord = (record) => {
    alert(`Downloading record for ${formatDate(record.date)}`);
  };

  const downloadSelected = () => {
    if (selectedRecords.length === 0) {
      alert('Please select at least one record to download');
      return;
    }
    alert(`Downloading ${selectedRecords.length} selected records`);
  };

  const viewRecord = (record) => {
    setCurrentRecord(record);
    setViewModalOpen(true);
  };

  const handleRecordSelection = (id) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter((recordId) => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  // Helper functions
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function calculateHoursWorked(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end - start;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return diffHrs.toFixed(2);
  }

  function getToday() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  function getTodayMinusDays(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  function calculateTotalHours() {
    if (!report?.attendance || report.attendance.length === 0) return 0;

    return report.attendance
      .reduce((total, record) => {
        return (
          total +
          parseFloat(calculateHoursWorked(record.checkIn, record.checkOut))
        );
      }, 0)
      .toFixed(2);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Reset filters
  const resetFilters = () => {
    setStartDate(getTodayMinusDays(2));
    setEndDate(getToday());
    if (selectedUser) {
      fetchReport();
    }
    setShowFilters(false);
  };

  const handleBackToList = () => {
    setReport(null);
    setSelectedUser('');
  };

  // Export Modal
  const ExportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Export Report</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="exportFormat"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={() => setExportFormat('pdf')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">PDF</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="exportFormat"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Excel</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={() => setShowExportModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={exportFormat === 'pdf' ? exportToPDF : exportToExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );

  // Bulk Export Modal for multiple staff
  const BulkExportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Bulk Export Reports</h3>
        <p className="text-sm text-gray-600 mb-4">
          Exporting data for {selectedStaff.length} selected staff members
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="exportFormat"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={() => setExportFormat('pdf')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">PDF</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="exportFormat"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Excel</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Content
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={true}
                  className="form-checkbox h-4 w-4 text-blue-600"
                  readOnly
                />
                <span className="ml-2 text-gray-700">Attendance</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={true}
                  className="form-checkbox h-4 w-4 text-blue-600"
                  readOnly
                />
                <span className="ml-2 text-gray-700">Leave Requests</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={() => setShowBulkExportModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={bulkExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );

  // View Record Modal
  const ViewRecordModal = () => {
    if (!currentRecord) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Record Details</h3>
            <button
              onClick={() => setViewModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-gray-900 font-medium">
                {formatDate(currentRecord.date)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  currentRecord.status === 'PRESENT'
                    ? 'bg-green-100 text-green-800'
                    : currentRecord.status === 'LATE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {currentRecord.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Check In Time</p>
              <p className="text-gray-900">
                {formatDateTime(currentRecord.checkIn)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Check Out Time
              </p>
              <p className="text-gray-900">
                {formatDateTime(currentRecord.checkOut)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hours Worked</p>
              <p className="text-gray-900">
                {calculateHoursWorked(
                  currentRecord.checkIn,
                  currentRecord.checkOut
                )}{' '}
                hrs
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Report</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-900">
                {currentRecord.report || 'No report submitted'}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => downloadRecord(currentRecord)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaDownload className="mr-2 h-4 w-4" />
              Download Record
            </button>
            <button
              onClick={() => setViewModalOpen(false)}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white p-4 shadow">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-semibold mb-2 sm:mb-0">
              Staff Attendance Reports
            </h1>
            {report ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaDownload size={16} className="mr-2" />
                  Export Report
                </button>
                {selectedRecords.length > 0 && (
                  <button
                    onClick={downloadSelected}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaCloudDownloadAlt size={16} className="mr-2" />
                    Download Selected ({selectedRecords.length})
                  </button>
                )}
              </div>
            ) : (
              /* Show bulk export button when staff are selected */
              selectedStaff.length > 0 && (
                <button
                  onClick={() => setShowBulkExportModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-green-500 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <FaDownload size={16} className="mr-2" />
                  Export Selected ({selectedStaff.length})
                </button>
              )
            )}
          </div>
        </header>

        <div className="p-4 md:p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {!report ? (
            <>
              {/* Search and filter */}

              <div className="flex flex-col md:flex-row justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search staff..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5"
                    >
                      <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter size={16} />
                    <span>Filters</span>
                    <FaChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform ${showFilters ? 'transform rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>
              {showFilters && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow animate-fadeIn">
                  <h3 className="font-medium mb-4">Date Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="pl-10 pr-3 py-2 w-full border rounded-md"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="pl-10 pr-3 py-2 w-full border rounded-md"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Staff List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Staff Directory
                  </h2>
                  <div className="flex items-center">
                    <input
                      id="select-all-staff"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                      checked={
                        selectedStaff.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={toggleSelectAllStaff}
                    />
                    <label
                      htmlFor="select-all-staff"
                      className="text-sm text-gray-700"
                    >
                      Select All
                    </label>
                  </div>
                </div>

                {fetchingUsers ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading staff list...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                            Select
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Department
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr
                              key={user.user_id}
                              className={`hover:bg-blue-50 ${selectedUser === user.user_id ? 'bg-blue-50' : ''} ${
                                selectedStaff.includes(user.user_id)
                                  ? 'bg-blue-50'
                                  : ''
                              }`}
                            >
                              <td className="px-2 py-3 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedStaff.includes(user.user_id)}
                                  onChange={() =>
                                    toggleStaffSelection(user.user_id)
                                  }
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold flex-shrink-0">
                                    {user.userName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">
                                      {user.userName}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <p className="text-sm text-gray-900">
                                  {user.position || 'N/A'}
                                </p>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                                <p className="text-sm text-gray-900">
                                  {user.department || 'N/A'}
                                </p>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                                <p className="text-sm text-gray-500">
                                  {user.email || 'N/A'}
                                </p>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap ">
                                <button
                                  onClick={() => fetchReport(user.user_id)}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  View Report
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center">
                              <p className="text-gray-500 text-sm">
                                No staff members found
                              </p>
                              {searchQuery && (
                                <button
                                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  onClick={() => setSearchQuery('')}
                                >
                                  Clear search
                                </button>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Report view
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200">
                <div className="flex flex-col">
                  <button
                    onClick={handleBackToList}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                  >
                    <FaArrowLeft className="mr-2" size={14} />
                    Back to staff list
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">
                    {users.find((user) => user.user_id === selectedUser)
                      ?.userName || 'Staff Member'}
                    's Report
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </p>
                </div>
                <div className="flex items-center mt-3 sm:mt-0 space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaFilter size={16} className="mr-2" />
                    Adjust Dates
                  </button>
                </div>
              </div>

              {/* Filters when viewing report */}
              {showFilters && (
                <div className="p-4 border-b border-gray-200 bg-gray-50 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="pl-10 pr-3 py-2 w-full border rounded-md"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="pl-10 pr-3 py-2 w-full border rounded-md"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        fetchReport();
                        setShowFilters(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Update Report
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading report data...</p>
                </div>
              ) : (
                <>
                  {/* Report navigation tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        className={`px-4 py-2 border-b-2 text-sm font-medium ${
                          activeTab === 'attendance'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('attendance')}
                      >
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2" size={14} />
                          Attendance Records
                        </div>
                      </button>
                    </nav>
                  </div>

                  {/* Report content */}
                  <div className="p-4">
                    {activeTab === 'attendance' && (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">
                            Attendance Records
                          </h3>
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={() => setSelectAll(!selectAll)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Select All
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  <span className="sr-only">Select</span>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                  Check In
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                  Check Out
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Hours
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {report?.attendance &&
                              report.attendance.length > 0 ? (
                                report.attendance.map((record) => (
                                  <tr
                                    key={record.attendance_id}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="px-2 py-4 whitespace-nowrap">
                                      <input
                                        type="checkbox"
                                        checked={selectedRecords.includes(
                                          record.attendance_id
                                        )}
                                        onChange={() =>
                                          handleRecordSelection(
                                            record.attendance_id
                                          )
                                        }
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-sm font-medium text-gray-900">
                                        {formatDate(record.date)}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${
                                          record.status === 'PRESENT'
                                            ? 'bg-green-100 text-green-800'
                                            : record.status === 'LATE'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                        }`}
                                      >
                                        {record.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                      <div className="text-sm text-gray-900">
                                        {formatDateTime(record.checkIn)}
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                      <div className="text-sm text-gray-900">
                                        {formatDateTime(record.checkOut)}
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {calculateHoursWorked(
                                          record.checkIn,
                                          record.checkOut
                                        )}{' '}
                                        hrs
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        onClick={() => viewRecord(record)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                      >
                                        <FaEye size={16} />
                                      </button>
                                      <button
                                        onClick={() => downloadRecord(record)}
                                        className="text-gray-600 hover:text-gray-900"
                                      >
                                        <FaDownload size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="7"
                                    className="px-6 py-8 text-center"
                                  >
                                    <p className="text-gray-500">
                                      No attendance records found for the
                                      selected date range
                                    </p>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && <ExportModal />}

      {/* Bulk Export Modal */}
      {showBulkExportModal && <BulkExportModal />}

      {/* View Record Modal */}
      {viewModalOpen && <ViewRecordModal />}
    </div>
  );
}
