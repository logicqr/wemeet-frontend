// src/components/Testimonials.jsx
const Testimonials = () => {
    const testimonials = [
      {
        quote: "AttendEase has transformed how we manage our team's attendance and scheduling. The location tracking feature ensures everyone is where they need to be.",
        name: "Sarah Johnson",
        title: "HR Director, TechCorp Inc.",
        avatar: "https://randomuser.me/api/portraits/women/11.jpg"
      },
      {
        quote: "The leave management system has saved us countless hours of administrative work. Approvals are now seamless and our team loves the user-friendly interface.",
        name: "Michael Chen",
        title: "Operations Manager, Globex",
        avatar: "https://randomuser.me/api/portraits/men/24.jpg"
      },
      {
        quote: "Our meeting scheduling has become much more efficient. We've reduced scheduling conflicts by 80% and improved team productivity significantly.",
        name: "Aisha Patel",
        title: "Team Lead, Innovations Co.",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg"
      }
    ];
  
    return (
      <section id="testimonials" className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by businesses of all sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <svg className="h-8 w-8 text-indigo-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-600 mb-6">{testimonial.quote}</p>
                  </div>
                  <div className="flex items-center mt-auto">
                    <div className="flex-shrink-0 mr-3">
                      <img src="/api/placeholder/64/64" alt={testimonial.name} className="h-10 w-10 rounded-full" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;