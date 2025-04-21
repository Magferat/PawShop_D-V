import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

import {
  useGetOutgoingRequestsQuery,
  useDeletePetRequestMutation,
} from "../../redux/api/petrequestsApiSlice";
import Loader from "../../components/Loader";

const statusOptions = ["pending", "accepted", "rejected"];

const OutgoingRequests = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useGetOutgoingRequestsQuery(selectedStatus);

  useEffect(() => {
    refetch();
  }, [userInfo, refetch]);

  const [deletePetRequest] = useDeletePetRequestMutation();

  const handleCancel = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this request?");
    if (!confirm) return;

    try {
      await deletePetRequest(id).unwrap();
      toast.success("Request cancelled");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel request");
    }
  };

  const renderRequestCard = (req) => (
    <div
      key={req._id}
      className="bg-white rounded-xl shadow p-4 mb-4 flex items-center gap-4"
    >
      {/* Pet Image */}
      <img
        src={req.pet.image}
        alt={req.pet.name}
        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
      />

      {/* Pet Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-pink-700">{req.pet.name}</h3>
        <p className="text-sm text-gray-600">
          📍 {req.pet.location} | 🐾 {req.pet.species}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Last updated: {new Date(req.updatedAt).toLocaleDateString()}
        </p>
        <Link
          to={`/pet/${req.pet._id}`}
          className="text-pink-600 underline text-sm mt-1 inline-block"
        >
          View Pet Details
        </Link>
      </div>

      {/* Cancel Button (Pending only) */}
      {selectedStatus === "pending" && (
        <button
          onClick={() => handleCancel(req._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Remove Request
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-rose-100 to-pink-200">
      <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
        📤 Outgoing Pet Requests
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedStatus === status
                ? "bg-pink-600 text-white"
                : "bg-white text-pink-600 border border-pink-300"
            } transition duration-200`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {isLoading ? (
        <Loader />
      ) : requests.length === 0 ? (
        <p className="text-gray-600 text-center">No {selectedStatus} requests</p>
      ) : (
        requests.map((req) => renderRequestCard(req))
      )}
    </div>
  );
};

export default OutgoingRequests;
