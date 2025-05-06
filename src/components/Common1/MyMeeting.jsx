import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiRefreshCw,
  FiArrowUp,
  FiArchive,
  FiVideo,
} from 'react-icons/fi';
import axiosInstance from '../auth/AxiosInstance';

function MyMeeting() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('all'); // 'all', 'today', 'upcoming', 'past'

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      // Assuming userId is available from your auth context or similar
      const user_id = '42ddbf40-32f0-4e90-9957-56bf33b2a0e7'; // Replace with actual user ID from your auth system
      const response = await axiosInstance.post(
        '/my-meetings',
        { user_id }
      );
      setMeetings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load meetings. Please try again.');
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Helper function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to check if a meeting has already happened
  const isPastMeeting = (dateString) => {
    const now = new Date();
    const meetingDate = new Date(dateString);
    return meetingDate < now;
  };

  // Filter meetings for today - split into upcoming and past
  const todaysFutureMeetings = meetings
    .filter(
      (meeting) =>
        isToday(meeting.scheduledAt) && !isPastMeeting(meeting.scheduledAt)
    )
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  const todaysPastMeetings = meetings
    .filter(
      (meeting) =>
        isToday(meeting.scheduledAt) && isPastMeeting(meeting.scheduledAt)
    )
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

  // Combine with future meetings first, then past meetings
  const todaysMeetings = [...todaysFutureMeetings, ...todaysPastMeetings];

  // Filter meetings for future days (beyond today)
  const upcomingMeetings = meetings
    .filter((meeting) => {
      const meetingDate = new Date(meeting.scheduledAt);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      return meetingDate > today;
    })
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  // Filter meetings for past days
  const pastMeetings = meetings
    .filter((meeting) => {
      const meetingDate = new Date(meeting.scheduledAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      return meetingDate < today;
    })
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)); // Most recent first

  const getMeetingStatus = (meeting) => {
    const meetingDate = new Date(meeting.scheduledAt);
    const now = new Date();

    if (isToday(meeting.scheduledAt)) {
      return meetingDate < now ? 'Ended' : 'Upcoming Today';
    } else if (meetingDate > now) {
      return 'Upcoming';
    } else {
      return 'Past';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming Today':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-green-100 text-green-800';
      case 'Ended':
        return 'bg-red-100 text-red-800';
      case 'Past':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinMeeting = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const renderMeetingCard = (meeting) => {
    const status = getMeetingStatus(meeting);
    const isCurrentMeeting = status === 'Upcoming Today';
    const now = new Date();
    const meetingDate = new Date(meeting.scheduledAt);
    const canJoinMeeting =
      isToday(meeting.scheduledAt) && !isPastMeeting(meeting.scheduledAt);

    return (
      <div
        key={meeting.id}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-800">{meeting.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <FiCalendar size={16} className="mr-2" />
            <span>{formatDate(meeting.scheduledAt)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiClock size={16} className="mr-2" />
            <span>{formatTime(meeting.scheduledAt)}</span>
          </div>

          {meeting.user && (
            <div className="flex items-center text-gray-600">
              <FiUsers size={16} className="mr-2" />
              <span>
                {meeting.user.userName} ({meeting.user.position})
              </span>
            </div>
          )}
        </div>

        {meeting.link && (
          <div className="flex items-center text-gray-600 mt-2">
            <span className="text-sm truncate">{meeting.link}</span>
          </div>
        )}

        {meeting.description && (
          <p className="mt-3 text-gray-600 text-sm line-clamp-2">
            {meeting.description}
          </p>
        )}

        <div className="mt-4 flex justify-end items-center">
          {canJoinMeeting && meeting.link && (
            <button
              onClick={() => handleJoinMeeting(meeting.link)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <FiVideo size={16} className="mr-2" />
              Join Meeting
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderMeetingsList = (meetingsList, emptyMessage) => {
    if (meetingsList.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No meetings found
          </h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">{meetingsList.map(renderMeetingCard)}</div>
    );
  };

  // Filter tabs handler
  const handleFilterChange = (view) => {
    setActiveView(view);
  };

  const renderFilterTabs = () => (
    <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 md:pb-0 px-1">
      <button
        onClick={() => handleFilterChange('all')}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm flex items-center gap-2 ${
          activeView === 'all'
            ? 'bg-blue-600 text-white shadow-blue-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        <FiCalendar className="text-base" />
        All Meetings
      </button>

      <button
        onClick={() => handleFilterChange('today')}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm flex items-center gap-2 ${
          activeView === 'today'
            ? 'bg-blue-600 text-white shadow-blue-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        <FiClock className="text-base" />
        Today's Meetings ({todaysMeetings.length})
      </button>

      <button
        onClick={() => handleFilterChange('upcoming')}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm flex items-center gap-2 ${
          activeView === 'upcoming'
            ? 'bg-blue-600 text-white shadow-blue-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        <FiArrowUp className="text-base" />
        Upcoming Meetings ({upcomingMeetings.length})
      </button>

      <button
        onClick={() => handleFilterChange('past')}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm flex items-center gap-2 ${
          activeView === 'past'
            ? 'bg-blue-600 text-white shadow-blue-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        <FiArchive className="text-base" />
        Past Meetings ({pastMeetings.length})
      </button>
    </div>
  );

  const renderContent = () => {
    if (activeView === 'all') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border-t-4 border-blue-500 rounded-lg bg-white p-4 shadow">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Today</h2>
              <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {todaysMeetings.length}
              </span>
            </div>
            {renderMeetingsList(
              todaysMeetings,
              'No meetings scheduled for today.'
            )}
          </div>

          <div className="border-t-4 border-green-500 rounded-lg bg-white p-4 shadow">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming</h2>
              <span className="ml-3 px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {upcomingMeetings.length}
              </span>
            </div>
            {renderMeetingsList(
              upcomingMeetings,
              'No upcoming meetings scheduled.'
            )}
          </div>

          <div className="border-t-4 border-gray-400 rounded-lg bg-white p-4 shadow">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Past</h2>
              <span className="ml-3 px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                {pastMeetings.length}
              </span>
            </div>
            {renderMeetingsList(pastMeetings, 'No past meetings found.')}
          </div>
        </div>
      );
    } else if (activeView === 'today') {
      return (
        <div className="border-t-4 border-blue-500 rounded-lg bg-white p-6">
          {renderMeetingsList(
            todaysMeetings,
            'No meetings scheduled for today.'
          )}
        </div>
      );
    } else if (activeView === 'upcoming') {
      return (
        <div className="border-t-4 border-green-500 rounded-lg bg-white p-6">
          {renderMeetingsList(
            upcomingMeetings,
            'No upcoming meetings scheduled.'
          )}
        </div>
      );
    } else if (activeView === 'past') {
      return (
        <div className="border-t-4 border-gray-400 rounded-lg bg-white p-6">
          {renderMeetingsList(pastMeetings, 'No past meetings found.')}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative bg-blue-500 rounded-lg mb-8">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0 rounded-lg"
            style={{
              backgroundImage:
                "url('https://ik.imagekit.io/69rzkdyiaw/guh7.png')",
              filter: 'brightness(0.7)',
            }}
          ></div>

          {/* Gradient overlay */}

          {/* Content */}
          <div className="relative z-20 px-6 py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                My Meetings
              </h1>
              <p className="text-blue-100 text-sm">
                Manage your scheduled meetings
              </p>
            </div>

            <button
              onClick={fetchMeetings}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
            >
              <FiRefreshCw size={16} className="animate-pulse" />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {renderFilterTabs()}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}

export default MyMeeting;
