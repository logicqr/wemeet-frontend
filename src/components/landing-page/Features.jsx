// src/components/Features.jsx
import React, { useState } from 'react';
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiSend,
  FiBarChart2,
} from 'react-icons/fi';

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <FiMapPin className="h-8 w-8 text-indigo-600" />,
      title: 'Location Tracking',
      description:
        'Track attendance with location verification to ensure employees are at the designated workplace.',
    },
    {
      icon: <FiCalendar className="h-8 w-8 text-indigo-600" />,
      title: 'Leave Management',
      description:
        'Streamline leave requests, approvals, and track time-off balances with automated workflows.',
    },
    {
      icon: <FiClock className="h-8 w-8 text-indigo-600" />,
      title: 'Time Tracking',
      description:
        'Monitor work hours, breaks, and overtime with detailed reporting and insights.',
    },
    {
      icon: <FiUsers className="h-8 w-8 text-indigo-600" />,
      title: 'Meeting Scheduler',
      description:
        'Easily coordinate team meetings with availability checking and room booking integration.',
    },
    {
      icon: <FiSend className="h-8 w-8 text-indigo-600" />,
      title: 'Notifications',
      description:
        'Automated alerts for pending approvals, schedule changes, and important reminders.',
    },
    {
      icon: <FiBarChart2 className="h-8 w-8 text-indigo-600" />,
      title: 'Analytics Dashboard',
      description:
        'Comprehensive reports on attendance patterns, leave trends, and meeting statistics.',
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-white to-indigo-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Feature-Rich Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools you need to manage your
            workforce efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl transition-all duration-300 ${
                hoveredFeature === index
                  ? 'bg-white shadow-xl transform -translate-y-1'
                  : 'bg-white shadow-md hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`p-4 rounded-full inline-block mb-4 transition-all duration-300 ${
                  hoveredFeature === index ? 'bg-indigo-100' : 'bg-gray-100'
                }`}
              >
                {React.cloneElement(feature.icon, {
                  className: `h-8 w-8 ${
                    hoveredFeature === index
                      ? 'text-indigo-700'
                      : 'text-indigo-600'
                  }`,
                })}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>

              <div
                className={`w-16 h-1 bg-indigo-600 rounded mt-4 transition-all duration-300 ${
                  hoveredFeature === index ? 'w-24' : 'w-16'
                }`}
              ></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
