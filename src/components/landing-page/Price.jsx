import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

export default function Price() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://wemeet-backend-latest.onrender.com/api/plans')
      .then((res) => {
        setPlans(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch pricing plans:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Pricing Plans</h2>
      
      {loading ? (
        <div className="text-center text-lg">Loading plans...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.plan_id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.billingCycle} Plan</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">₹{plan.price}</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Duration: {plan.durationInDays} days
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Renew every {plan.billingCycle === 'MONTHLY' ? '28 days' : 'year'}
                </li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
                Choose {plan.billingCycle}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
