import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAddPackageMutation } from "../../redux/api/serviceApiSlice";  // Adjust import path

const AddPackagePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    petType: [],
    description: "",
    duration: "",
    price: "",
  });

  const [petTypeInput, setPetTypeInput] = useState(""); // temp input for pet types

  const [addPackage, { isLoading, error }] = useAddPackageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addPackage({
        serviceId,
        data: formData,
      }).unwrap();

      navigate(`/admin/allservices`);
    } catch (err) {
      console.error("Error adding package:", err);
    }
  };

  const handleAddPetType = () => {
    if (petTypeInput.trim() && !formData.petType.includes(petTypeInput.trim())) {
      setFormData({
        ...formData,
        petType: [...formData.petType, petTypeInput.trim()],
      });
      setPetTypeInput("");
    }
  };

  const handleRemovePetType = (type) => {
    setFormData({
      ...formData,
      petType: formData.petType.filter((t) => t !== type),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Add New Package</h1>

      {error && <div className="text-red-500 mb-2">Error adding package</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium">Package Name</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Pet Types</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border p-2 rounded flex-1"
              value={petTypeInput}
              onChange={(e) => setPetTypeInput(e.target.value)}
              placeholder="Enter pet type (e.g., dog, cat)"
            />
            <button
              type="button"
              onClick={handleAddPetType}
              className="bg-blue-500 text-white px-4 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.petType.map((type, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {type}
                <button
                  type="button"
                  onClick={() => handleRemovePetType(type)}
                  className="text-red-500 font-bold"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Description</label>
          <textarea
            className="border p-2 rounded"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Duration</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Price</label>
          <input
            type="number"
            className="border p-2 rounded"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Package"}
        </button>
      </form>
    </div>
  );
};

export default AddPackagePage;
