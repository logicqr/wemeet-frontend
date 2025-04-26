// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { FiMapPin, FiCalendar, FiCheckCircle, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Hero = () => {
  const [isHovering, setIsHovering] = useState(null);
  const [activeTab, setActiveTab] = useState('location');
  const [counter, setCounter] = useState(0);

  // Animate counter for "Trusted by" section
  useEffect(() => {
    if (counter < 1000) {
      const timer = setTimeout(() => setCounter(prev => prev + 25), 20);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const featureData = {
    location: {
      title: 'Geolocation Tracking',
      description: 'Record employee check-ins with precise location data to ensure accountability',
      icon: <FiMapPin className="text-indigo-600 text-4xl mb-3" />
    },
    attendance: {
      title: 'Smart Attendance',
      description: 'Automate attendance tracking with biometric verification and mobile check-ins',
      icon: <FiCheckCircle className="text-indigo-600 text-4xl mb-3" />
    },
    leave: {
      title: 'Leave Management',
      description: 'Streamline leave requests, approvals, and balance tracking in one place',
      icon: <FiCalendar className="text-indigo-600 text-4xl mb-3" />
    },
    meeting: {
      title: 'Team Scheduler',
      description: 'Coordinate meetings with built-in availability checking and calendar integration',
      icon: <FiUsers className="text-indigo-600 text-4xl mb-3" />
    }
  };

  const companies = [
    { name: 'ACME Inc.', logo: '🏢' },
    { name: 'TechCorp', logo: '💻' },
    { name: 'Globex', logo: '🌐' },
    { name: 'Initech', logo: '🔧' }
  ];

  return (
    <div className="relative py-20 bg-gradient-to-r from-indigo-600 to-blue-500 overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-2 px-3 py-1 bg-indigo-400 bg-opacity-30 rounded-full text-white text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Workplace Management Simplified
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Streamline <span className="text-yellow-300">Attendance</span> and Workforce Management
            </h1>
            
            <p className="text-lg md:text-xl text-white mb-8 opacity-90">
              All-in-one solution for attendance tracking, location monitoring, leave management, and meeting scheduling.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.a 
                href="#pricing" 
                className="bg-white text-indigo-600 font-medium py-3 px-8 rounded-md hover:bg-gray-100 transition-colors text-center shadow-lg transform hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Pricing
              </motion.a>
              
              <motion.a 
                href="#demo" 
                className="bg-transparent border-2 border-white text-white font-medium py-3 px-8 rounded-md hover:bg-white hover:text-indigo-600 transition-colors text-center"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Try Demo
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full backdrop-filter backdrop-blur-lg bg-opacity-95">
              <div className="mb-6">
                <div className="flex border-b">
                  {Object.keys(featureData).map((key) => (
                    <button
                      key={key}
                      className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                        activeTab === key
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                      onClick={() => setActiveTab(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="p-4">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center"
                  >
                    {featureData[activeTab].icon}
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      {featureData[activeTab].title}
                    </h3>
                    <p className="text-gray-600">
                      {featureData[activeTab].description}
                    </p>
                  </motion.div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.keys(featureData).map((key) => (
                  <motion.div
                    key={key}
                    className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center text-center cursor-pointer"
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "#e0e7ff" 
                    }}
                    onHoverStart={() => setIsHovering(key)}
                    onHoverEnd={() => setIsHovering(null)}
                    onClick={() => setActiveTab(key)}
                  >
                    {React.cloneElement(featureData[key].icon, { 
                      className: `${isHovering === key ? 'text-indigo-700' : 'text-indigo-600'} text-3xl mb-2 transition-colors` 
                    })}
                    <h3 className={`font-semibold ${isHovering === key ? 'text-indigo-700' : 'text-gray-800'} transition-colors`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h3>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="bg-indigo-100 p-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center text-gray-800 mb-3 font-semibold">
                  Trusted by over <span className="text-indigo-600 font-bold">{counter}+</span> companies
                </div>
                <div className="flex justify-around items-center">
                  {companies.map((company, index) => (
                    <motion.div 
                      key={index}
                      className="flex flex-col items-center"
                      whileHover={{ y: -3 }}
                    >
                      <span className="text-2xl mb-1">{company.logo}</span>
                      <div className="text-gray-600 text-xs font-medium">{company.name}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-white"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-white"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;