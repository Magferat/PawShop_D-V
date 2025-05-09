import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-pink-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-6xl mx-auto">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          {userInfo && (
            <h2 className="text-5xl md:text-6xl font-extrabold text-green-700 leading-tight">
              Hello, {userInfo.username}!
            </h2>
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-700 leading-tight">
            Welcome to PawShop
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-md mx-auto md:mx-0">
            Discover your next best friend or treat your pets to top-quality products and love.
          </p>
          <div>
            <Link
              to="/productshop"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium text-lg transition duration-300"
            >
              Start Shopping
            </Link>
          </div>
        </div>
        <img
          src="https://thumbs.dreamstime.com/b/pet-store-visit-9547660.jpg"
          alt="Cute pets"
          className="w-full md:w-1/2 rounded-2xl mt-12 md:mt-0 shadow-2xl"
        />
      </section>

      {/* Features Section */}
      <section className="bg-yellow-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-14">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Healthy Pets</h3>
              <p className="text-gray-700">All pets are vaccinated, well-groomed, and ready for loving homes.</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-pink-600 mb-2">Quality Products</h3>
              <p className="text-gray-700">Only the best toys, food, and accessories for your furry friends.</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">Adoption Friendly</h3>
              <p className="text-gray-700">Give a pet a second chance at life with our adoption options.</p>
            </div>
          </div>
        </div>
      </section>

            {/* Footer-like CTA */}
            <div className="py-12 text-center bg-green-50 mt-auto">
        <h3 className="text-2xl font-bold text-green-700 mb-4">
          Ready to find your new best friend?
        </h3>
        <Link
          to="/petshop"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition duration-300"
        >
          Browse Pets
        </Link>
      </div>

      {/* Reviews Section */}
      <section className="py-20 bg-pink-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-12">What Our Customers Are Saying</h2>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-xl text-gray-700 italic">"PawShop made adopting my new furry friend so easy. The process was smooth and I found the perfect match for our family!"</p>
              <h4 className="mt-4 text-lg font-semibold text-green-600">Sarah W.</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-xl text-gray-700 italic">"Amazing quality products! My pets love their new toys and treats from PawShop. Highly recommend!"</p>
              <h4 className="mt-4 text-lg font-semibold text-green-600">John D.</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-xl text-gray-700 italic">"The grooming and vet services were top-notch! My dog looks and feels amazing after her spa day!"</p>
              <h4 className="mt-4 text-lg font-semibold text-green-600">Emily S.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-yellow-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-12">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-3xl font-bold text-green-700">500+</h3>
              <p className="text-lg text-gray-700">Happy Adoptions</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-3xl font-bold text-green-700">200+</h3>
              <p className="text-lg text-gray-700">Fostered</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-3xl font-bold text-green-700">100+</h3>
              <p className="text-lg text-gray-700">Trusted Customers</p>
            </div>
          </div>
        </div>
      </section>
      

    </div>
  );
};

export default HomePage;
