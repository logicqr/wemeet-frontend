import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';

export default function Login() {
  const initialFormState = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);

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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data for API
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      // Make API call
      await axiosInstance.post('/login', loginData);

      setSuccess('Login successful! Redirecting...');

      // Simulate redirect after login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Invalid email or password. Please try again.';
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
            <h2 className="text-white text-4xl font-bold mb-6">Welcome back</h2>
            <p className="text-blue-100 text-xl mb-8">
              Access your HR portal to manage attendance, leave requests, and
              more
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
                Join thousands of professionals using WebzSpot
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
            <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-600 mt-2">
              Access your WebzSpot HRMS portal
            </p>
          </div>

          {error && (
            <div
              className="mt-6 flex items-center p-4 mb-6 text-sm text-red-800 border-l-4 border-red-500 bg-red-50"
              role="alert"
            >
              <svg
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
              </svg>
              <div>
                <span className="font-medium">Login Error:</span> {error}
              </div>
            </div>
          )}

          {success && (
            <div
              className="mt-6 flex items-center p-4 mb-6 text-sm text-green-800 border-l-4 border-green-500 bg-green-50"
              role="alert"
            >
              <svg
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
              </svg>
              <div>
                <span className="font-medium">Success:</span> {success}
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                    className={`block w-full px-4 py-3 border ${focusedField === 'email' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                  />
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
                    autoComplete="current-password"
                    required
                    className={`block w-full px-4 py-3 border ${focusedField === 'password' ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
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
                    Logging in...
                  </div>
                ) : (
                  <span className="flex items-center">
                    Sign In
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
                <span className="text-gray-600">Don't have an account?</span>
                <a
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 ml-2"
                >
                  Register now
                </a>
              </div>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-6">
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.68 17.57V20.13H19.12C21.16 18.24 22.56 15.49 22.56 12.25Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23C14.97 23 17.46 22.02 19.12 20.13L15.68 17.57C14.7 18.23 13.45 18.63 12 18.63C9.05 18.63 6.57 16.64 5.73 13.97H2.19V16.61C3.84 20.43 7.62 23 12 23Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.73 13.97C5.5 13.31 5.37 12.59 5.37 11.84C5.37 11.09 5.5 10.37 5.73 9.71V7.07H2.19C1.46 8.51 1 10.14 1 11.84C1 13.54 1.46 15.17 2.19 16.61L5.73 13.97Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.05C13.65 5.05 15.14 5.63 16.32 6.77L19.36 3.73C17.46 1.93 14.97 0.81 12 0.81C7.62 0.81 3.84 3.38 2.19 7.2L5.73 9.84C6.57 7.17 9.05 5.05 12 5.05Z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>

              <button className="flex items-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" />
                </svg>
                Sign in with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
