// src/pages/admin/EditServicePage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "../../redux/api/serviceApiSlice";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, error } = useGetServiceByIdQuery(id);
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [workingStart, setWorkingStart] = useState("");
  const [workingEnd, setWorkingEnd] = useState("");

  useEffect(() => {
    if (service) {
      setName(service.name || "");
      setDescription(service.description || "");
      setCategory(service.category || "");
      setEmail(service.email || "");
      setPhone(service.phone || "");
      setWorkingStart(service.workingHours?.start || "");
      setWorkingEnd(service.workingHours?.end || "");
    }
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateService({
        id,
        data: {
          name,
          description,
          category,
          email,
          phone,
          workingHours: {
            start: workingStart,
            end: workingEnd,
          },
        },
      }).unwrap();
      navigate("/admin/allservices");
    } catch (err) {
      console.error(err);
      alert("Failed to update service");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Service</h1>

      {isLoading ? (
        <p>Loading service...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load service.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              rows={3}
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Working Hours Start</label>
              <input
                type="time"
                value={workingStart}
                onChange={(e) => setWorkingStart(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Working Hours End</label>
              <input
                type="time"
                value={workingEnd}
                onChange={(e) => setWorkingEnd(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Service"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditServicePage;
