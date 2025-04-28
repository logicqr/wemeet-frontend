import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

export default function Price() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://wemeet-backend-latest.onrender.com/api/plans'
      );
      if (response.data && response.data.data) {
        setPlans(response.data.data);
      } else {
        setError('Invalid response format from API');
      }
    } catch (err) {
      console.error('Failed to fetch pricing plans:', err);
      setError('Failed to load pricing plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get a friendly name for the billing cycle
  const getBillingCycleName = (cycle) => {
    if (cycle === 'MONTHLY') return 'Monthly';
    if (cycle === 'YEARLY') return 'Yearly';
    if (cycle === 'ANNUAL') return 'Annual';
    return cycle;
  };

  return (
    <section
      id="pricing"
      className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600">Loading pricing plans...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6 max-w-lg mx-auto">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchPlans}
                className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.plan_id}
                className={`bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 shadow hover:transform hover:scale-105`}
              >
                <div
                  className={`p-4 text-white font-medium text-center ${plan.billingCycle === 'MONTHLY' ? 'bg-blue-500' : 'bg-blue-600'}`}
                >
                  {getBillingCycleName(plan.billingCycle)} Plan
                </div>
                <div className="p-6">
                  <div className="mb-6 text-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{plan.price}
                    </span>
                  </div>
                  <div className="mb-4 text-center">
                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {plan.billingCycle === 'MONTHLY'
                        ? 'Pay Monthly'
                        : 'Annual Billing'}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">
                        Duration: {plan.durationInDays} days
                      </span>
                    </li>
                    <li className="flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">
                        Renew every{' '}
                        {plan.billingCycle === 'MONTHLY' ? '28 days' : 'year'}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Attendance tracking</span>
                    </li>
                    <li className="flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Leave management</span>
                    </li>
                    <li className="flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Email notifications</span>
                    </li>
                    {plan.billingCycle !== 'MONTHLY' && (
                      <>
                        <li className="flex items-center">
                          <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">
                            Advanced reporting
                          </span>
                        </li>
                        <li className="flex items-center">
                          <FaCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">
                            Priority support
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                  <button className="w-full py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Choose {getBillingCycleName(plan.billingCycle)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show message if no plans are available */}
        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              No pricing plans are currently available.
            </p>
            <button
              onClick={fetchPlans}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Refresh Plans
            </button>
          </div>
        )}

        {plans.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Have Questions About Our Pricing?
            </h3>
            <p className="text-gray-600 mb-4">
              Contact our sales team for custom enterprise solutions or any
              questions about our pricing plans.
            </p>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 font-medium transition-colors">
              Contact Sales
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
