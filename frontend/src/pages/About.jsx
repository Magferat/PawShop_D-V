import React from "react";
import {
  FaPaw,
  FaShoppingCart,
  FaHeart,
  FaUserFriends,
  FaClinicMedical,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-4 flex justify-center items-center gap-2">
        <FaPaw className="text-5xl text-pink-400" />
        About Us
      </h1>
      <p className="text-lg text-gray-700 mb-10">
        Welcome to <span className="font-semibold text-pink-500">Pawfect Place</span>, your one-stop destination for everything pets! 🐶🐱🐾 Whether you're looking to buy pet products, find a loving home for your furry friend, or book essential services, we’ve got you covered.
      </p>

      <div className="grid md:grid-cols-2 gap-8 text-left">
        <div className="bg-pink-50 rounded-2xl shadow p-6 hover:shadow-lg transition">
          <FaShoppingCart className="text-3xl text-pink-400 mb-3" />
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Pet Products</h2>
          <p className="text-gray-600">
            We offer a wide variety of pet products, from food and toys to accessories and care essentials. Browse our shop and spoil your pets with the best!
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl shadow p-6 hover:shadow-lg transition">
          <FaHeart className="text-3xl text-blue-400 mb-3" />
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Adopt, Buy & Foster</h2>
          <p className="text-gray-600">
            Have a pet to rehome? List your pets for sale, adoption, or foster care. Users can explore listings and send requests to provide a new home or temporary care.
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl shadow p-6 hover:shadow-lg transition">
          <FaUserFriends className="text-3xl text-green-400 mb-3" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Community & Trust</h2>
          <p className="text-gray-600">
            Our platform is built on trust. Sign in to manage your listings, view reviews, and interact with a community of pet lovers. We make pet adoption and care safe and easy.
          </p>
        </div>

        <div className="bg-yellow-50 rounded-2xl shadow p-6 hover:shadow-lg transition">
          <FaClinicMedical className="text-3xl text-yellow-400 mb-3" />
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">Grooming & Vet Services</h2>
          <p className="text-gray-600">
            Book top-notch grooming and veterinary services tailored to your pet’s needs. Choose from a range of species-specific options to keep your pet happy and healthy.
          </p>
        </div>
      </div>

      <div className="mt-12 text-gray-700 text-lg">
        At <span className="font-semibold text-pink-500">Pawfect Place</span>, we believe every pet deserves love, care, and a happy home. 🐾 Join our growing family today and make a difference in the lives of animals.
      </div>

      {/* Contact Us Footer */}
      <footer className="mt-16 bg-pink-100 rounded-xl p-6 text-left shadow-inner">
        <h3 className="text-2xl font-bold text-pink-700 mb-4">Contact Us</h3>
        <div className="flex flex-col md:flex-row md:justify-between gap-6 text-gray-700">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-pink-500" />
            <span>Email: support@pawshop.com</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-pink-500" />
            <span>Phone: +1 (234) 567-890</span>
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-pink-500" />
            <span>123 Pet Lane, Pawville, PA 12345</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
