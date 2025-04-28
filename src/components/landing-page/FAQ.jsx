// src/components/FAQ.jsx
import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How does the location tracking feature work?',
      answer:
        'Our location tracking uses GPS technology to verify that employees are at their designated workplace when they clock in. The system is configurable to allow for a reasonable radius around the workplace and can also accommodate remote work settings.',
    },
    {
      question: 'Can I customize the leave management workflow?',
      answer:
        "Yes! Our leave management system is fully customizable. You can set up approval chains, define leave types, set accrual rules, and configure notifications according to your organization's policies.",
    },
    {
      question:
        'Is the meeting scheduler integrated with popular calendar apps?',
      answer:
        'Absolutely. Our meeting scheduler integrates seamlessly with Google Calendar, Microsoft Outlook, and other popular calendar applications to avoid scheduling conflicts and make the process efficient.',
    },
    {
      question: 'How secure is the attendance data?',
      answer:
        'Security is our top priority. All data is encrypted both in transit and at rest. We use industry-standard security protocols and regularly undergo security audits to ensure your data remains protected.',
    },
    {
      question: 'Can I generate custom reports for attendance and leave?',
      answer:
        'Yes, our Professional and Enterprise plans include custom reporting capabilities. You can create reports based on various parameters like departments, time periods, leave types, etc., and export them in different formats.',
    },
    {
      question: 'Do you offer a free trial?',
      answer:
        'Yes, we offer a 14-day free trial for all our plans. You can experience the full functionality of your chosen plan with no credit card required for the trial period.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="flex justify-between items-center w-full p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-gray-900 text-left">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FiMinus className="h-5 w-5 text-indigo-600" />
                ) : (
                  <FiPlus className="h-5 w-5 text-indigo-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-50 rounded-b-lg">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
