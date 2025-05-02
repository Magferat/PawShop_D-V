// src/pages/admin/AllServicesPage.jsx

import {
    useGetAllServicesQuery,
    useDeleteServiceMutation,
    useDeletePackageMutation,
  } from "../../redux/api/serviceApiSlice";
  import { Link, useLocation } from "react-router-dom";
  import { useEffect } from "react";
  
  const AllServicesPage = () => {
    const { data: services, isLoading, error, refetch } = useGetAllServicesQuery();
    const [deleteService] = useDeleteServiceMutation();
    const [deletePackage] = useDeletePackageMutation();
    const location = useLocation();
  
    // Handler to delete a service
    const handleDeleteService = async (id) => {
      if (window.confirm("Are you sure you want to delete this service?")) {
        try {
          await deleteService(id).unwrap();
          refetch();
        } catch (err) {
          console.error(err);
          alert("Failed to delete service");
        }
      }
    };
  
    // Handler to delete a package
    const handleDeletePackage = async (serviceId, packageId) => {
      if (window.confirm("Are you sure you want to delete this package?")) {
        try {
          await deletePackage({ serviceId, packageId }).unwrap();
          refetch();
        } catch (err) {
          console.error(err);
          alert("Failed to delete package");
        }
      }
    };
  
    // Refetch data every time the page is navigated to
    useEffect(() => {
      refetch();
    }, [location, refetch]);
  
    return (
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Services</h1>
  
        {isLoading && <p>Loading services...</p>}
        {error && <p className="text-red-500">Error loading services.</p>}
  
        {services?.length === 0 && <p>No services found.</p>}
  
        {services?.map((service) => (
          <div key={service._id} className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                {service.name} ({service.category})
              </h2>
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/editservice/${service._id}`}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  Edit Service
                </Link>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-100"
                >
                  Delete Service
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{service.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              Contact: {service.email} | {service.phone}
            </p>
            <p className="text-sm text-gray-500">
              Working Hours: {service.workingHours?.start} - {service.workingHours?.end}
            </p>
  
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Packages</h3>
                <Link
                  to={`/admin/${service._id}/addpackage`}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  Add Package
                </Link>
              </div>
  
              {service.packages.length === 0 ? (
                <p className="text-gray-500">No packages available.</p>
              ) : (
                <div className="space-y-3">
                  {service.packages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="border p-3 rounded flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-medium">
                          {pkg.name} ({pkg.petType.join(", ")})
                        </h4>
                        <p className="text-sm text-gray-500">{pkg.description}</p>
                        <p className="text-sm text-gray-500">
                          Duration: {pkg.duration} mins | Price: BDT {pkg.price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/${service._id}/editpackage/${pkg._id}`}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDeletePackage(service._id, pkg._id)
                          }
                          className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default AllServicesPage;
  