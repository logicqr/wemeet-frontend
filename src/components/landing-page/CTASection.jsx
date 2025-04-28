// src/components/CTASection.jsx
const CTASection = () => {
  return (
    <section className="py-20 bg-indigo-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Workforce Management?
          </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Join thousands of companies that use AttendEase to streamline their
            attendance and scheduling.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="#"
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
