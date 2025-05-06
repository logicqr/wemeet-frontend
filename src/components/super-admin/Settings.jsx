import React, { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt,
  FaRuler,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLink,
  FaMapPin,
  FaCrosshairs,
  FaInfoCircle,
  FaLocationArrow,
  FaCog,
  FaGlobeAmericas,
  FaBuilding,
  FaArrowRight,
} from 'react-icons/fa';
import axiosInstance from '../auth/AxiosInstance';


export default function LocationSettingsForm() {
  // Set company ID as a constant
  const COMPANY_ID = 'cm9yglvn40000dg2ovt5v0rrq';

  const [formData, setFormData] = useState({
    officeLatitude: '',
    officeLongitude: '',
    allowedRadius: 300,
  });

  const [placeName, setPlaceName] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const radiusOptions = [100, 200, 300, 400, 500];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGoogleMapsLinkChange = (e) => {
    setGoogleMapsLink(e.target.value);
  };

  const extractCoordinatesFromLink = () => {
    setError('');
    setPlaceName('');

    try {
      // Try to extract place name from the URL
      const placePattern = /\/place\/([^/]+)\//;
      const placeMatch = googleMapsLink.match(placePattern);

      if (placeMatch && placeMatch[1]) {
        const decodedPlace = decodeURIComponent(
          placeMatch[1].replace(/\+/g, ' ')
        );
        setPlaceName(decodedPlace);
      }

      // Try to extract exact coordinates using different patterns
      let lat, lng;

      // Pattern 1: https://www.google.com/maps/place/.../@LAT,LNG,...
      const atPattern = /@([-\d.]+),([-\d.]+)/;

      // Pattern 2: https://www.google.com/maps?q=LAT,LNG
      const qPattern = /[?&]q=([-\d.]+),([-\d.]+)/;

      // Pattern 3: https://goo.gl/maps/... or other shortened URLs that contain ll parameter
      const llPattern = /[?&]ll=([-\d.]+),([-\d.]+)/;

      // Pattern 4: https://www.google.com/maps/search/...data=...!3m1!4b1!...!8m2!3d23.0225!4d72.5714
      const dataPattern = /!3d([-\d.]+)!4d([-\d.]+)/;

      // Try each pattern in turn
      let match =
        googleMapsLink.match(atPattern) ||
        googleMapsLink.match(qPattern) ||
        googleMapsLink.match(llPattern) ||
        googleMapsLink.match(dataPattern);

      if (match && match.length >= 3) {
        // Parse to float, convert to string with full precision (no rounding)
        lat = match[1];
        lng = match[2];

        if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
          setFormData({
            ...formData,
            officeLatitude: lat,
            officeLongitude: lng,
          });
          return;
        }
      }

      throw new Error('Could not extract coordinates from the provided link');
    } catch (err) {
      setError(
        'Invalid Google Maps link. Please make sure it contains coordinates.'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Always include the company_id in the submission data
      const submissionData = {
        company_id: COMPANY_ID,
        officeLatitude: parseFloat(formData.officeLatitude),
        officeLongitude: parseFloat(formData.officeLongitude),
        allowedRadius: parseInt(formData.allowedRadius),
        ...(placeName && { placeName }),
      };

      console.log('Submitting data:', submissionData);

      const response = await axiosInstance.put(
        '/settings',
        {
          ...submissionData,
          // Convert to number only for the API call
          officeLatitude: parseFloat(formData.officeLatitude),
          officeLongitude: parseFloat(formData.officeLongitude),
        }
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  // Actual Google Maps embeded preview
  const renderMapPreview = () => {
    if (!formData.officeLatitude || !formData.officeLongitude) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-center p-6">
            <FaGlobeAmericas className="mx-auto text-gray-300 text-5xl mb-4" />
            <p className="text-gray-500 font-medium">
              Enter location coordinates to preview
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Map preview will appear here
            </p>
          </div>
        </div>
      );
    }

    // Create embeddable Google Maps URL with marker and circle overlay
    const mapUrl = `https://maps.google.com/maps?q=${formData.officeLatitude},${formData.officeLongitude}&z=15&output=embed`;

    return (
      <div className="relative h-full rounded-xl overflow-hidden">
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        {/* Radius overlay (simulated) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="rounded-full border-2 border-blue-500 border-dashed opacity-60"
            style={{
              width: `${Math.min(250, formData.allowedRadius / 2)}px`,
              height: `${Math.min(250, formData.allowedRadius / 2)}px`,
            }}
          ></div>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3">
          <div className="text-sm">
            <div className="font-medium">{placeName || 'Office Location'}</div>
            <div className="text-gray-600 text-xs flex justify-between">
              <span>
                {formData.officeLatitude}, {formData.officeLongitude}
              </span>
              <span>Radius: {formData.allowedRadius}m</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}

      {/* Main content */}
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Page title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Location Settings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure your office location and check-in parameters
            </p>
          </div>

          {/* Mobile Map Preview - Visible only on small screens */}
          <div className="block lg:hidden mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-4 py-3">
                  <div className="flex items-center">
                    <FaGlobeAmericas className="text-blue-600 mr-2" />
                    <h3 className="text-md font-medium text-gray-900">
                      Location Preview
                    </h3>
                  </div>
                </div>
              </div>

              <div className="h-64">{renderMapPreview()}</div>
            </div>
          </div>

          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form section: 3/5 width on large screens */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="px-6 py-5">
                    <div className="flex items-center">
                      <FaLocationArrow className="text-blue-600 mr-3" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Office Location Details
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Notifications */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start animate-fadeIn">
                      <FaExclamationTriangle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start animate-fadeIn">
                      <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-green-700 text-sm">
                        Settings saved successfully! Your location has been
                        updated.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Google Maps Link Section */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Google Maps Location Link
                      </label>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2">
                          <input
                            type="text"
                            value={googleMapsLink}
                            onChange={handleGoogleMapsLinkChange}
                            placeholder="Paste Google Maps link"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={extractCoordinatesFromLink}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium flex items-center justify-center shadow-sm"
                          >
                            <FaCrosshairs className="mr-2" />
                            Extract
                          </button>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                          <FaInfoCircle className="mr-2 text-blue-500" />
                          Right-click on your office location in Google Maps and
                          select "Copy link"
                        </div>
                      </div>
                    </div>

                    {/* Extracted Place Name */}
                    {placeName && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center shadow-sm animate-fadeIn">
                        <div className="bg-blue-100 rounded-full p-2 mr-4">
                          <FaMapPin className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium">
                            {placeName}
                          </p>
                          <p className="text-blue-600 text-xs">
                            Location successfully identified
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Coordinates Section */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Office Coordinates
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">
                            Latitude
                          </div>
                          <input
                            type="text"
                            name="officeLatitude"
                            value={formData.officeLatitude}
                            onChange={handleInputChange}
                            placeholder="e.g. 37.7749"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">
                            Longitude
                          </div>
                          <input
                            type="text"
                            name="officeLongitude"
                            value={formData.officeLongitude}
                            onChange={handleInputChange}
                            placeholder="e.g. -122.4194"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Radius Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Check-in Radius
                        </label>
                        <div className="relative">
                          <FaInfoCircle
                            className="text-blue-500 cursor-pointer"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onClick={() => setShowTooltip(!showTooltip)}
                          />
                          {showTooltip && (
                            <div className="absolute right-0 transform translate-y-1 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg z-10">
                              This is the maximum distance (in meters) from the
                              office location where employees can check in.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <select
                          name="allowedRadius"
                          value={formData.allowedRadius}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all duration-200"
                          required
                        >
                          {radiusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option} meters
                            </option>
                          ))}
                        </select>

                        <div className="space-y-2">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                              style={{
                                width: `${(formData.allowedRadius / Math.max(...radiusOptions)) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>100m</span>
                            <span>500m</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        ) : null}
                        {loading
                          ? 'Saving Changes...'
                          : 'Update Location Settings'}
                      </button>
                    </div>

                    {/* Footer text */}
                    <div className="text-center mt-4 px-6">
                      <p className="text-xs text-gray-500">
                        Location data is securely stored and only used for
                        employee check-in verification.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Map & Info section: 2/5 width on large screens - hidden on small screens */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="space-y-6">
                {/* Map preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200">
                    <div className="px-6 py-5">
                      <div className="flex items-center">
                        <FaGlobeAmericas className="text-blue-600 mr-3" />
                        <h3 className="text-lg font-medium text-gray-900">
                          Location Preview
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="h-80 lg:h-96">{renderMapPreview()}</div>
                </div>

                {/* Information panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200">
                    <div className="px-6 py-5">
                      <div className="flex items-center">
                        <FaInfoCircle className="text-blue-600 mr-3" />
                        <h3 className="text-lg font-medium text-gray-900">
                          Location Information
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FaCheckCircle />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">
                            Employees must be physically present within the
                            specified radius to check in.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FaCheckCircle />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">
                            GPS coordinates are automatically verified during
                            check-in.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FaCheckCircle />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">
                            Consider local geography when setting the radius
                            (buildings, landscapes can affect GPS accuracy).
                          </p>
                        </div>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 flex items-center">
                        <FaInfoCircle className="mr-2" />
                        Need Help?
                      </h4>
                      <p className="mt-2 text-sm text-blue-700">
                        Contact support for assistance with location
                        configuration or check-in issues.
                      </p>
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View documentation <FaArrowRight className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Info Panel - Only visible on small screens */}
          <div className="block lg:hidden mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-4 py-3">
                  <div className="flex items-center">
                    <FaInfoCircle className="text-blue-600 mr-2" />
                    <h3 className="text-md font-medium text-gray-900">
                      Location Information
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-4 w-4 text-blue-500 mt-0.5">
                      <FaCheckCircle />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-700">
                        Employees must be physically present within the
                        specified radius to check in.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-4 w-4 text-blue-500 mt-0.5">
                      <FaCheckCircle />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-700">
                        GPS coordinates are automatically verified during
                        check-in.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 text-sm flex items-center">
                    <FaInfoCircle className="mr-2" />
                    Need Help?
                  </h4>
                  <p className="mt-1 text-xs text-blue-700">
                    Contact support for assistance with location issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
