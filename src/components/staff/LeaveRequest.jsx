import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveRequest() {
  // Set a constant user ID for now as requested
  const USER_ID = "42ddbf40-32f0-4e90-9957-56bf33b2a0e7";

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split("T")[0];

  const initialFormState = {
    startDate: "",
    endDate: "",
    reason: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [daysRequested, setDaysRequested] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  // Calculate days between selected dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      // Add 1 to include both start and end dates
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
      timer = setTimeout(() => {
        setSuccess("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If end date is before start date, update end date
    if (name === "startDate" && formData.endDate && value > formData.endDate) {
      setFormData((prevState) => ({
        ...prevState,
        endDate: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setError("Please fill all fields");
      return;
    }

    // Reset states
    setError("");
    setSuccess("");
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
      console.log(leaveData);
      console.log(
        `startDate: ${leaveData.startDate}, type: ${typeof leaveData.startDate}`
      );
      console.log(
        `endDate: ${leaveData.endDate}, type: ${typeof leaveData.endDate}`
      );
      console.log(
        `reason: ${leaveData.reason}, type: ${typeof leaveData.reason}`
      );
      console.log(
        `user_id: ${leaveData.user_id}, type: ${typeof leaveData.user_id}`
      );
      const response = await axios.post("https://wemeet-backend-latest.onrender.com/api/leave-request", leaveData);

      setSuccess(
        `Leave request submitted successfully for ${daysRequested} day(s)!`
      );
      // Reset form after successful submission
      setFormData(initialFormState);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to submit leave request. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Leave Request</h2>
              <p className="mt-1 text-blue-100">Request time off from work</p>
            </div>
            <div className="h-14 w-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
          </div>
        </div>

        <div className="px-6 py-8">
          {error && (
            <div
              className="mb-6 flex items-center p-4 text-sm text-red-800 border-l-4 border-red-500 bg-red-50 rounded"
              role="alert"
            >
              {/* <svg
                className="w-5 h-5 mr-2 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                ></path>
              </svg> */}
              <div>
                <span className="font-medium">Error:</span> {error}
              </div>
            </div>
          )}

          {success && (
            <div
              className="mb-6 flex items-center p-4 text-sm text-green-800 border-l-4 border-green-500 bg-green-50 rounded"
              role="alert"
            >
              {/* <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg> */}
              <div>
                <span className="font-medium">Success:</span> {success}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className={`block text-sm font-medium ${
                    focusedField === "startDate"
                      ? "text-blue-600"
                      : "text-gray-700"
                  } transition-colors duration-200`}
                >
                  Start Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    min={today}
                    value={formData.startDate}
                    onChange={handleChange}
                    onFocus={() => handleFocus("startDate")}
                    onBlur={handleBlur}
                    className={`block w-full px-4 py-3 border ${
                      focusedField === "startDate"
                        ? "border-blue-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className={`block text-sm font-medium ${
                    focusedField === "endDate"
                      ? "text-blue-600"
                      : "text-gray-700"
                  } transition-colors duration-200`}
                >
                  End Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    min={formData.startDate || today}
                    value={formData.endDate}
                    onChange={handleChange}
                    onFocus={() => handleFocus("endDate")}
                    onBlur={handleBlur}
                    className={`block w-full px-4 py-3 border ${
                      focusedField === "endDate"
                        ? "border-blue-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    required
                  />
                </div>
              </div>
            </div>

            {daysRequested > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
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
                You are requesting {" "}
                <span className="font-semibold">{` ${daysRequested}`}day(s)</span> of
                leave
              </div>
            )}

            <div>
              <label
                htmlFor="reason"
                className={`block text-sm font-medium ${
                  focusedField === "reason" ? "text-blue-600" : "text-gray-700"
                } transition-colors duration-200`}
              >
                Reason for Leave
              </label>
              <div className="mt-1">
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  onFocus={() => handleFocus("reason")}
                  onBlur={handleBlur}
                  placeholder="Please provide a brief explanation for your leave request"
                  className={`block w-full px-4 py-3 border ${
                    focusedField === "reason"
                      ? "border-blue-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setFormData(initialFormState)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
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
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Leave Policy Highlights
            </h3>
          </div>
          <div className="px-6 py-4">
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-500 flex-shrink-0"
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
                <span>
                  Requests must be submitted at least 48 hours in advance
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-500 flex-shrink-0"
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
                <span>
                  Annual leave allowance is 20 days plus public holidays
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-500 flex-shrink-0"
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
                <span>
                  Sick leave requires documentation for absences over 3 days
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
