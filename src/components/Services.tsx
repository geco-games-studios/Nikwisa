import React from "react";

const services = [
  {
    icon: "🛠️",
    title: "Skilled Taskers",
    description:
      "Find skilled professionals for various tasks like plumbing, electrical work, and more, right in your locality.",
  },
  {
    icon: "🏬",
    title: "Local Stores",
    description:
      "Browse multiple stores in your area, view products, compare prices, and shop with ease.",
  },
  {
    icon: "💼",
    title: "Jobs",
    description:
      "Discover job opportunities and connect with employers in your city.",
  },
  {
    icon: "🛍️",
    title: "Best Deals",
    description:
      "Find the best deals and discounts available from local businesses near you.",
  },
  {
    icon: "⭐",
    title: "Ratings & Reviews",
    description:
      "Check reviews and ratings from other users to make informed decisions.",
  },
  {
    icon: "📞",
    title: "Contact Providers",
    description:
      "Easily get in touch with local businesses and service providers directly.",
  },
];

const Services = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
