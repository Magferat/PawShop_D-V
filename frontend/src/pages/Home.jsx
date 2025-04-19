import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-pink-200 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-16 max-w-6xl mx-auto">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-6">
            Welcome to PawShop 🐶🐾
          </h1>
          <p className="text-gray-700 mb-6 text-lg">
            Your one-stop shop for adorable pets, premium pet products, and loving adoption services.
          </p>
          <Link
            to="/productshop"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition duration-300"
          >
            Start Shopping
          </Link>
        </div>

        <img
          src="https://www.nicepng.com/png/detail/362-3623221_pet-store-clipart-clip-art-pet-store.png"
          alt="Cute pets"
          className="w-full md:w-1/2 rounded-xl mt-10 md:mt-0 shadow-xl"
        />
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-pink-600 mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-rose-50 p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Healthy Pets</h3>
              <p className="text-gray-600">All pets are vaccinated, well-groomed, and ready for loving homes.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Quality Products</h3>
              <p className="text-gray-600">Only the best toys, food, and accessories for your furry friends.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Adoption Friendly</h3>
              <p className="text-gray-600">Give a pet a second chance at life with our adoption options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer-like CTA */}
      <div className="py-12 text-center bg-pink-100 mt-auto">
        <h3 className="text-2xl font-bold text-pink-600 mb-4">
          Ready to find your new best friend?
        </h3>
        <Link
          to="/petshop"
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
        >
          Browse Pets 🐾
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
