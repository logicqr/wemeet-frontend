import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    amount: '',
    duration: '',
    type: ''
  });
  const [newPlanData, setNewPlanData] = useState({
    name: '',
    amount: '',
    duration: '',
    type: ''
  });
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });
  const [addMessage, setAddMessage] = useState({ text: '', type: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://wemeet-backend-latest-1.onrender.com/api/plans');
      setPlans(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to fetch plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan.plan_id);
    setEditFormData({
      name: plan.name,
      amount: plan.amount,
      duration: plan.duration,
      type: plan.type
    });
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setUpdateMessage({ text: '', type: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'amount' || name === 'duration' ? Number(value) : value
    });
  };

  const handleTypeSelect = (selectedType) => {
    setEditFormData({
      ...editFormData,
      type: selectedType
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlanData({
      ...newPlanData,
      [name]: name === 'amount' || name === 'duration' ? Number(value) : value
    });
  };

  const handleAddTypeSelect = (selectedType) => {
    setNewPlanData({
      ...newPlanData,
      type: selectedType
    });
  };

  const handleUpdate = async (planId) => {
    setIsUpdating(true);
    setUpdateMessage({ text: '', type: '' });
    console.log("Updating plan data:", editFormData);

    try {
      const response = await axios.put(
        `https://wemeet-backend-latest-1.onrender.com/api/update-plan/${planId}`, 
        editFormData
      );
      
      setUpdateMessage({ text: 'Plan updated successfully!', type: 'success' });
      fetchPlans(); // Refresh the plans list
      
      // Close edit form after a short delay
      setTimeout(() => {
        setEditingPlan(null);
        setUpdateMessage({ text: '', type: '' });
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update plan';
      setUpdateMessage({ text: errorMsg, type: 'error' });
      console.error('Error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setAddMessage({ text: '', type: '' });
    console.log("Submitting new plan data:", newPlanData);
    
    try {
      const response = await axios.post(
        'https://wemeet-backend-latest-1.onrender.com/api/create-plan',
        newPlanData,
      );
      
      setAddMessage({ text: 'Plan created successfully!', type: 'success' });
      setNewPlanData({
        name: '',
        amount: '',
        duration: '',
        type: ''
      });
      
      fetchPlans(); // Refresh the plans list
      
      // Reset add form after success
      setTimeout(() => {
        setAddMessage({ text: '', type: '' });
        setShowAddForm(false);
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create plan';
      setAddMessage({ text: errorMsg, type: 'error' });
      console.error('Error:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Subscription Plans</h2>
          <div className="mt-2 h-1 w-20 bg-indigo-500 mx-auto rounded"></div>
        </div>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showAddForm ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Hide Add Form
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Plan
              </>
            )}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-6">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Add New Subscription Plan</h3>
            </div>
            
            <div className="p-6">
              {addMessage.text && (
                <div className={`mb-4 rounded-md p-3 ${addMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  <p className="text-sm">{addMessage.text}</p>
                </div>
              )}
              
              <form onSubmit={handleAddPlan} className="space-y-4">
                <div>
                  <label htmlFor="new-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="new-name"
                    value={newPlanData.name}
                    onChange={handleAddInputChange}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="new-amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (in ₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="new-amount"
                      min="1"
                      value={newPlanData.amount}
                      onChange={handleAddInputChange}
                      className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="new-duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (in days)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    id="new-duration"
                    min="1"
                    value={newPlanData.duration}
                    onChange={handleAddInputChange}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      onClick={() => handleAddTypeSelect('MONTHLY')}
                      className={`flex items-center justify-center py-2 px-2 border ${
                        newPlanData.type === 'MONTHLY' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } rounded-md cursor-pointer transition-colors duration-150`}
                    >
                      <span className="text-sm font-medium">Monthly</span>
                    </div>
                    <div 
                      onClick={() => handleAddTypeSelect('YEARLY')}
                      className={`flex items-center justify-center py-2 px-2 border ${
                        newPlanData.type === 'YEARLY' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } rounded-md cursor-pointer transition-colors duration-150`}
                    >
                      <span className="text-sm font-medium">Yearly</span>
                    </div>
                    <div 
                      onClick={() => handleAddTypeSelect('CUSTOM')}
                      className={`flex items-center justify-center py-2 px-2 border ${
                        newPlanData.type === 'CUSTOM' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } rounded-md cursor-pointer transition-colors duration-150`}
                    >
                      <span className="text-sm font-medium">Custom</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAdding || !newPlanData.type}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating plan...
                      </>
                    ) : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div key={plan.plan_id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  {editingPlan === plan.plan_id ? (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Plan</h3>
                      
                      {updateMessage.text && (
                        <div className={`mb-4 rounded-md p-3 ${updateMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                          <p className="text-sm">{updateMessage.text}</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (in ₹)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                              type="number"
                              name="amount"
                              id="amount"
                              min="1"
                              value={editFormData.amount}
                              onChange={handleInputChange}
                              className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (in days)
                          </label>
                          <input
                            type="number"
                            name="duration"
                            id="duration"
                            min="1"
                            value={editFormData.duration}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plan Type
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <div 
                              onClick={() => handleTypeSelect('MONTHLY')}
                              className={`flex items-center justify-center py-2 px-2 border ${
                                editFormData.type === 'MONTHLY' 
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              } rounded-md cursor-pointer transition-colors duration-150`}
                            >
                              <span className="text-sm font-medium">Monthly</span>
                            </div>
                            <div 
                              onClick={() => handleTypeSelect('YEARLY')}
                              className={`flex items-center justify-center py-2 px-2 border ${
                                editFormData.type === 'YEARLY' 
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              } rounded-md cursor-pointer transition-colors duration-150`}
                            >
                              <span className="text-sm font-medium">Yearly</span>
                            </div>
                            <div 
                              onClick={() => handleTypeSelect('CUSTOM')}
                              className={`flex items-center justify-center py-2 px-2 border ${
                                editFormData.type === 'CUSTOM' 
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              } rounded-md cursor-pointer transition-colors duration-150`}
                            >
                              <span className="text-sm font-medium">Custom</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => handleUpdate(plan.plan_id)}
                            disabled={isUpdating || !editFormData.type}
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating plan...
                              </>
                            ) : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                          {plan.name}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            plan.type === 'MONTHLY' ? 'bg-blue-100 text-blue-800' : 
                            plan.type === 'YEARLY' ? 'bg-purple-100 text-purple-800' : 
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {plan.type}
                          </span>
                        </h3>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Amount</dt>
                            <dd className="mt-1 text-sm text-gray-900">₹{plan.amount}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Duration</dt>
                            <dd className="mt-1 text-sm text-gray-900">{plan.duration} days</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Created</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(plan.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => handleEdit(plan)}
                          className="inline-flex items-center px-3 py-2 border border-indigo-300 text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit Plan
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">No plans found. Create some plans to see them here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}