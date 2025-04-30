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
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

export default function ModernEmployeeReport() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState(getTodayMinusDays(30));
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
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showBulkExportModal, setShowBulkExportModal] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const companyId = "cm9yglvn40000dg2ovt5v0rrq";

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetchingUsers(true);
        const response = await axios.post('https://wemeet-backend-latest.onrender.com/api/all-users', { company_id: companyId });
        setUsers(response.data);
        setFilteredUsers(response.data);
        
        // Calculate total pages for staff list
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (err) {
        setError(`Error loading users: ${err.response?.data?.error || err.message}`);
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, [companyId, itemsPerPage]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      setTotalPages(Math.ceil(users.length / itemsPerPage));
    } else {
      const filtered = users.filter(user =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, users, itemsPerPage]);

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
      setSelectedRecords(report.attendance.map(record => record.attendance_id));
    } else if (!selectAll) {
      setSelectedRecords([]);
    }
  }, [selectAll, report]);

  // Get current users for pagination
  const getCurrentUsers = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Get current attendance records for pagination
  const getCurrentAttendanceRecords = () => {
    if (!report?.attendance) return [];
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return report.attendance.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Update total pages when report changes
  useEffect(() => {
    if (report?.attendance) {
      setTotalPages(Math.ceil(report.attendance.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when viewing a new report
    }
  }, [report, itemsPerPage]);

  // Handle staff selection
  const toggleStaffSelection = (userId) => {
    if (selectedStaff.includes(userId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== userId));
    } else {
      setSelectedStaff([...selectedStaff, userId]);
    }
  };

  // Select all staff toggle
  const toggleSelectAllStaff = () => {
    if (selectedStaff.length === filteredUsers.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredUsers.map(user => user.user_id));
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

    try {
      const response = await axios.get(`https://wemeet-backend-latest.onrender.com/api/user-report/${userId}`, {
        params: { startDate, endDate }
      });
      setReport(response.data);
      setSelectedUser(userId);
    } catch (err) {
      setError(`Error loading report: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Export functions
  const exportToPDF = () => {
    alert(`Exporting PDF data from ${formatDate(exportStartDate)} to ${formatDate(exportEndDate)}`);
    setShowExportModal(false);
  };

  const exportToExcel = () => {
    alert(`Exporting Excel data from ${formatDate(exportStartDate)} to ${formatDate(exportEndDate)}`);
    setShowExportModal(false);
  };

  const bulkExport = () => {
    alert(`Exporting data for ${selectedStaff.length} staff members from ${formatDate(exportStartDate)} to ${formatDate(exportEndDate)} in ${exportFormat} format`);
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
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  // Helper functions
  function formatDateTime(dateString) {
    if (!dateString) return "No data";
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function calculateHoursWorked(checkIn, checkOut) {
    if (!checkIn || !checkOut) return "No data";
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

    return report.attendance.reduce((total, record) => {
      if (!record.checkIn || !record.checkOut) return total;
      return total + parseFloat(calculateHoursWorked(record.checkIn, record.checkOut) || 0);
    }, 0).toFixed(2);
  }

  function formatDate(dateString) {
    if (!dateString) return "No data";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Reset filters
  const resetFilters = () => {
    setStartDate(getTodayMinusDays(30));
    setEndDate(getToday());
    if (selectedUser) {
      fetchReport();
    }
    setShowFilters(false);
  };

  const handleBackToList = () => {
    setReport(null);
    setSelectedUser('');
    setCurrentPage(1);
  };

  // Export Modal
  const ExportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Export Report</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
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
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={exportFormat === 'pdf' ? exportToPDF : exportToExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
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
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Bulk Export Reports</h3>
        <p className="text-sm text-gray-600 mb-4">
          Exporting data for {selectedStaff.length} selected staff members
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Content</label>
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
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={bulkExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
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
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Record Details</h3>
            <button
              onClick={() => setViewModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
              <p className="text-gray-900 font-medium text-lg">{formatDate(currentRecord.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${currentRecord.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                  currentRecord.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {currentRecord.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Check In Time</p>
              <p className="text-gray-900">{currentRecord.checkIn ? formatDateTime(currentRecord.checkIn) : "No data"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Check Out Time</p>
              <p className="text-gray-900">{currentRecord.checkOut ? formatDateTime(currentRecord.checkOut) : "No data"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Hours Worked</p>
              <p className="text-gray-900 font-medium">
                {currentRecord.checkIn && currentRecord.checkOut 
                  ? `${calculateHoursWorked(currentRecord.checkIn, currentRecord.checkOut)} hrs` 
                  : "No data"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Report</p>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-gray-900">{currentRecord.report || "No report submitted"}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => downloadRecord(currentRecord)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <FaDownload className="mr-2 h-4 w-4" />
              Download Record
            </button>
            <button
              onClick={() => setViewModalOpen(false)}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    
    // Limit displayed page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Always show at least 5 pages if available
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else {
        startPage = Math.max(1, endPage - 4);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, report ? report.attendance?.length || 0 : filteredUsers.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{report ? report.attendance?.length || 0 : filteredUsers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'} ring-1 ring-inset ring-gray-300 focus:outline-offset-0`}
              >
                <span className="sr-only">Previous</span>
                <FaChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0`}
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                </>
              )}
              
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => goToPage(number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === number ? 'bg-blue-600 text-white' : 'text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0`}
                >
                  {number}
                </button>
              ))}
              
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'} ring-1 ring-inset ring-gray-300 focus:outline-offset-0`}
              >
                <span className="sr-only">Next</span>
                <FaChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">Staff Attendance Reports</h1>
            {report ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-white text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 transition-colors duration-200"
                >
                  <FaDownload size={16} className="mr-2" />
                  Export Report
                </button>
                {selectedRecords.length > 0 && (
                  <button
                    onClick={downloadSelected}
                    className="inline-flex items-center px-3 py-2 border border-white text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 transition-colors duration-200"
                  >
                    <FaCloudDownloadAlt size={16} className="mr-2" />
                    Download Selected
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (selectedStaff.length > 0) {
                    setShowBulkExportModal(true);
                  } else {
                    alert('Please select at least one staff member');
                  }
                }}
                className="inline-flex items-center px-3 py-2 border border-white text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 transition-colors duration-200"
                disabled={selectedStaff.length === 0}
              >
                <FaDownload size={16} className="mr-2" />
                Bulk Export
              </button>
            )}
          </div>
        </header>

        <div className="p-4">
          {/* Back to staff list button */}
          {report && (
            <div className="mb-4">
              <button
                onClick={handleBackToList}
                className="inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <FaArrowLeft size={16} className="mr-2" />
                Back to Staff List
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* User List */}
          {!report && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Staff List</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, department..."
                      className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FaFilter className="mr-2 h-4 w-4 text-gray-500" />
                      Filters
                      <FaChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </button>
                    
                    {/* Filter dropdown */}
                    {showFilters && (
                      <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
                          <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">From</label>
                            <input
                              type="date"
                              className="w-full border rounded-md p-2 text-sm"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">To</label>
                            <input
                              type="date"
                              className="w-full border rounded-md p-2 text-sm"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-between mt-4">
                            <button
                              onClick={resetFilters}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Staff list table */}
              {fetchingUsers ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={selectedStaff.length === filteredUsers.length && filteredUsers.length > 0}
                                onChange={toggleSelectAllStaff}
                              />
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getCurrentUsers().map((user) => (
                          <tr key={user.user_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  checked={selectedStaff.includes(user.user_id)}
                                  onChange={() => toggleStaffSelection(user.user_id)}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.department || 'Not assigned'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.position || 'Not assigned'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => fetchReport(user.user_id)}
                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                              >
                                View Report
                              </button>
                            </td>
                          </tr>
                        ))}
                        
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                              No staff members found matching your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredUsers.length > 0 && <Pagination />}
                </>
              )}
            </div>
          )}

          {/* User Report */}
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : report && (
            <div className="bg-white rounded-lg shadow-md">
              {/* User info header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-t-lg border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{report.userName}</h2>
                    <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                      <p>{report.department || 'No Department'}</p>
                      <p>•</p>
                      <p>{report.position || 'No Position'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <FaFilter className="mr-2 h-4 w-4 text-gray-500" />
                        Filters
                        <FaChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                      </button>
                      
                      {/* Filter dropdown */}
                      {showFilters && (
                        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
                            <div className="mb-3">
                              <label className="block text-xs text-gray-500 mb-1">From</label>
                              <input
                                type="date"
                                className="w-full border rounded-md p-2 text-sm"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="block text-xs text-gray-500 mb-1">To</label>
                              <input
                                type="date"
                                className="w-full border rounded-md p-2 text-sm"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-between mt-4">
                              <button
                                onClick={resetFilters}
                                className="text-sm text-gray-600 hover:text-gray-800"
                              >
                                Reset
                              </button>
                              <button
                                onClick={() => {
                                  fetchReport();
                                  setShowFilters(false);
                                }}
                                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Date range info */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="inline-flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    Report Period:
                  </span>
                  <span className="font-medium">{formatDate(startDate)}</span>
                  <span>to</span>
                  <span className="font-medium">{formatDate(endDate)}</span>
                </div>
              </div>
              
              {/* Report stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">Total Days</p>
                  <p className="text-2xl font-semibold mt-1">{report.attendance?.length || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-700">Total Hours</p>
                  <p className="text-2xl font-semibold mt-1">{calculateTotalHours()} hrs</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-yellow-700">Average Hours/Day</p>
                  <p className="text-2xl font-semibold mt-1">
                    {report.attendance?.length > 0 
                      ? (calculateTotalHours() / report.attendance.length).toFixed(2)
                      : "0.00"} hrs
                  </p>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'attendance'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('attendance')}
                  >
                    Attendance
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'leave'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('leave')}
                  >
                    Leave Requests
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'summary'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('summary')}
                  >
                    Summary
                  </button>
                </nav>
              </div>
              
              {/* Tab content */}
              {activeTab === 'attendance' && (
                <div className="p-4">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectAll}
                        onChange={() => setSelectAll(!selectAll)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700">
                        Select All
                      </label>
                    </div>
                    {selectedRecords.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {selectedRecords.length} records selected
                      </div>
                    )}
                  </div>
                  
                  {report.attendance && report.attendance.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Select
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Check In
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Check Out
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hours
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getCurrentAttendanceRecords().map((record) => (
                            <tr key={record.attendance_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedRecords.includes(record.attendance_id)}
                                  onChange={() => handleRecordSelection(record.attendance_id)}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDate(record.date)}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                    record.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "No data"}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "No data"}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {record.checkIn && record.checkOut 
                                    ? `${calculateHoursWorked(record.checkIn, record.checkOut)} hrs` 
                                    : "No data"}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => viewRecord(record)}
                                  className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200"
                                >
                                  <FaEye className="inline h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => downloadRecord(record)}
                                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                >
                                  <FaDownload className="inline h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No attendance records found for the selected period.
                    </div>
                  )}
                  
                  {report.attendance && report.attendance.length > 0 && <Pagination />}
                </div>
              )}
              
              {activeTab === 'leave' && (
                <div className="p-8 text-center text-gray-500">
                  Leave request history will be displayed here.
                </div>
              )}
              
              {activeTab === 'summary' && (
                <div className="p-8 text-center text-gray-500">
                  Attendance summary and statistics will be displayed here.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {showExportModal && <ExportModal />}
      {showBulkExportModal && <BulkExportModal />}
      {viewModalOpen && <ViewRecordModal />}
    </div>
  );
}