import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPackageByIdQuery, useUpdatePackageMutation } from "../../redux/api/serviceApiSlice";

const EditPackagePage = () => {
  const { serviceId, packageId } = useParams();
  const navigate = useNavigate();
  
  // Get package details
  const { data: pkg, isLoading, error } = useGetPackageByIdQuery({
    serviceId,
    packageId,
  });

  const [formData, setFormData] = useState({
    name: "",
    petType: "",
    description: "",
    duration: "",
    price: "",
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || "",
        petType: (pkg.petType || []).join(", "),  // Convert array to comma-separated string
        description: pkg.description || "",
        duration: pkg.duration || "",
        price: pkg.price || "",
      });
    }
  }, [pkg]);

  const [updatePackage, { isLoading: isUpdating, error: updateError }] = useUpdatePackageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      petType: formData.petType
        .split(",")
        .map((pt) => pt.trim())
        .filter((pt) => pt.length > 0),  // Ensure it's an array of trimmed values
    };

    try {
      await updatePackage({
        serviceId,
        packageId,
        data: submitData,
      }).unwrap();

      navigate(`/admin/allservices`);
    } catch (err) {
      console.error("Error updating package:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching package details</div>;
  if (updateError) return <div>Error updating package</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold">Edit Package</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium">Package Name</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Pet Type (comma-separated)</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={formData.petType}
            onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
            required
          />
          <small className="text-gray-500">Example: dog, cat, rabbit</small>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Description</label>
          <textarea
            className="border p-2 rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Duration</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Price</label>
          <input
            type="number"
            className="border p-2 rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Package"}
        </button>
      </form>
    </div>
  );
};

export default EditPackagePage;
