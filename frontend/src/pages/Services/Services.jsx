import { useGetAllServicesQuery } from "../../redux/api/serviceApiSlice";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const { data: services, isLoading, error } = useGetAllServicesQuery();

  if (isLoading) return <p className="text-center p-6 text-lg text-gray-700">Loading services...</p>;
  if (error) return <p className="text-center text-red-500 p-6">Something went wrong. Please try again later.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Our Partnered Grooming & Vet Services</h1>
      <p className="text-center text-gray-600 mb-8">
        PawShop is proud to collaborate with trusted grooming salons and veterinary clinics to bring the best care for your pets. Browse and book a service below!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Link
            key={service._id}
            to={`/services/${service._id}`}
            className="border rounded-2xl p-6 hover:shadow-lg transition bg-dustyyellow/20 border-dustybrown hover:bg-dustyyellow/30 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{service.name}</h2>
              <p className="mt-2 text-gray-700">{service.description}</p>

              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p><span className="font-semibold">Category:</span> {service.category}</p>
                <p><span className="font-semibold">Address:</span> {service.address}</p>
                <p><span className="font-semibold">Email:</span> {service.email}</p>
                <p><span className="font-semibold">Phone:</span> {service.phone}</p>
                <p>
                  <span className="font-semibold">Working Hours:</span>{" "}
                  {service.workingHours?.start} - {service.workingHours?.end}
                </p>
              </div>
            </div>

            <div className="mt-4 text-right">
              <span className="inline-block text-dustybrown hover:underline text-sm font-medium">
                View Details →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
