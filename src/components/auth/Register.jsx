import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Register() {
  const initialFormState = {
    companyName: '',
    userName: '',
    email: '',
    position: '',
    password: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Clear success message after 5 seconds
  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess('');
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

    // Clear specific validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Company name validation
    if (formData.companyName.trim().length < 2) {
      errors.companyName = 'Company name is too short';
    }

    // Username validation
    if (formData.userName.trim().length < 3) {
      errors.userName = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Position validation
    if (formData.position.trim().length < 2) {
      errors.position = 'Please enter your position';
    }

    // Password validation
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Reset states
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data for API (exclude confirmPassword)
      const dataToSend = {
        companyName: formData.companyName,
        userName: formData.userName,
        email: formData.email,
        position: formData.position,
        password: formData.password,
      };

      // Make API call
      await axios.post(
        'https://wemeet-backend-latest.onrender.com/api/register',
        dataToSend
      );

      setSuccess('Registration successful! Welcome to WebzSpot HRMS.');
      // Reset form after successful submission
      setFormData(initialFormState);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);

      // If server returns specific field errors, update validation errors
      if (err.response?.data?.errors) {
        setValidationErrors({
          ...validationErrors,
          ...err.response.data.errors,
        });
      }
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Image and branding */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 opacity-90 z-10"></div>
        <img
          src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Profiles/checking-girl.webp?updatedAt=1745517085183"
          alt="Professional HR Management"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-between z-20 p-12">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold ml-3">
              WebzSpot HRMS
            </h1>
          </div>

          <div className="mb-16">
            <h2 className="text-white text-4xl font-bold mb-6">
              Simplify your HR operations
            </h2>
            <p className="text-blue-100 text-xl mb-8">
              Seamless attendance tracking, employee management, and HR
              analytics in one place
            </p>
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Profiles/medium-shot-smiley-man-posing.jpg?updatedAt=1741542639142"
                  alt="User"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Profiles/stylish-handsome-indian-man-tshirt-pastel-wall.jpg?updatedAt=1741541251874"
                  alt="User"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Profiles/eastern-woman.jpg?updatedAt=1741541236840"
                  alt="User"
                />
              </div>
              <span className="text-sm text-blue-100">
                Join thousands of companies using WebzSpot
              </span>
            </div>
          </div>

          <div className="text-blue-100 text-sm">
            <p>&copy; 2025 WebzSpot. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <p className="text-gray-600 mt-2">Get started with WebzSpot HRMS</p>
          </div>

          {error && (
            <div
              className="mt-6 flex items-center p-4 mb-6 text-sm text-red-800 border-l-4 border-red-500 bg-red-50"
              role="alert"
            >
              {/* <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
              </svg> */}
              <div>
                <span className="font-medium">Registration Error:</span> {error}
              </div>
            </div>
          )}

          {success && (
            <div
              className="mt-6 flex items-center p-4 mb-6 text-sm text-green-800 border-l-4 border-green-500 bg-green-50"
              role="alert"
            >
              {/* <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg> */}
              <div>
                <span className="font-medium">Success:</span> {success}
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="companyName"
                  className={`block text-sm font-medium ${focusedField === 'companyName' ? 'text-blue-600' : 'text-gray-700'} transition-colors duration-200`}
                >
                  Company Name
                </label>
                <div className="mt-1 relative">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className={`block w-full px-4 py-3 border ${validationErrors.companyName ? 'border-red-300' : focusedField === 'companyName' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('companyName')}
                    onBlur={handleBlur}
                  />
                  {validationErrors.companyName && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.companyName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="userName"
                  className={`block text-sm font-medium ${focusedField === 'userName' ? 'text-blue-600' : 'text-gray-700'} transition-colors duration-200`}
                >
                  Username
                </label>
                <div className="mt-1 relative">
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    required
                    className={`block w-full px-4 py-3 border ${validationErrors.userName ? 'border-red-300' : focusedField === 'userName' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Choose a username"
                    value={formData.userName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('userName')}
                    onBlur={handleBlur}
                  />
                  {validationErrors.userName && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.userName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-700'} transition-colors duration-200`}
                >
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full px-4 py-3 border ${validationErrors.email ? 'border-red-300' : focusedField === 'email' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="position"
                  className={`block text-sm font-medium ${focusedField === 'position' ? 'text-blue-600' : 'text-gray-700'} transition-colors duration-200`}
                >
                  Position
                </label>
                <div className="mt-1 relative">
                  <input
                    id="position"
                    name="position"
                    type="text"
                    required
                    className={`block w-full px-4 py-3 border ${validationErrors.position ? 'border-red-300' : focusedField === 'position' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Your role in the company"
                    value={formData.position}
                    onChange={handleChange}
                    onFocus={() => handleFocus('position')}
                    onBlur={handleBlur}
                  />
                  {validationErrors.position && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.position}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-700'} transition-colors duration-200`}
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`block w-full px-4 py-3 border ${validationErrors.password ? 'border-red-300' : focusedField === 'password' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium ${focusedField === 'confirmPassword' ? 'text-blue-600' : 'text-gray-700'} transition-colors duration-200`}
                >
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`block w-full px-4 py-3 border ${validationErrors.confirmPassword ? 'border-red-300' : focusedField === 'confirmPassword' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={handleBlur}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Creating your account...
                  </div>
                ) : (
                  <span className="flex items-center">
                    Register Account
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center mt-6">
              <div className="text-sm">
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
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
                      d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    />
                  </svg>
                  Already have an account? Sign in
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
