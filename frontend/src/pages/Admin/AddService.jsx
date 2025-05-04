// src/pages/admin/AddServicePage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateServiceMutation } from "../../redux/api/serviceApiSlice";

const AddServicePage = () => {
  const navigate = useNavigate();
  const [addService, { isLoading, error }] = useCreateServiceMutation();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    email: "",
    phone: "",
    workingHours: {
      start: "",
      end: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      setFormData((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addService(formData).unwrap();
      navigate("/admin/allservices"); // Redirect after success
    } catch (err) {
      console.error("Failed to add service:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium">Service Name</label>
          <input
            type="text"
            name="name"
            className="border p-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Category</label>
          <input
            type="text"
            placeholder="grooming or vet"
            name="category"
            className="border p-2 rounded"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            className="border p-2 rounded"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="border p-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            className="border p-2 rounded"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Working Hours</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="start"
              placeholder="Start (e.g., 09:00 AM)"
              className="border p-2 rounded w-1/2"
              value={formData.workingHours.start}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="end"
              placeholder="End (e.g., 06:00 PM)"
              className="border p-2 rounded w-1/2"
              value={formData.workingHours.end}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Service"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">Failed to add service. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default AddServicePage;
