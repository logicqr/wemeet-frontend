// src/components/Navbar.jsx
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                Attend<span className="text-pink-600">Ease</span>
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              FAQ
            </a>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </a>
            <button className="w-full mt-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
