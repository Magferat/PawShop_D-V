import { useState, useEffect } from "react";
import { useGetIncomingRequestsQuery, useUpdatePetRequestStatusMutation } from "../../redux/api/petrequestsApiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const IncomingRequests = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("pending");

  const { data: requests = [], isLoading, refetch } = useGetIncomingRequestsQuery(activeTab);
  const [updateStatus] = useUpdatePetRequestStatusMutation();

  useEffect(() => {
    refetch();
  }, [userInfo, refetch]);

  const handleStatusUpdate = async (requestId, status) => {
    const confirmed = window.confirm(`Are you sure you want to ${status} this request?`);
    if (!confirmed) return;

    try {
      await updateStatus({ requestId, status }).unwrap();
      toast.success(`Request ${status}`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update request status");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          📥 Incoming Pet Requests
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          {["pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                activeTab === status
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border border-indigo-300"
              }`}
              onClick={() => setActiveTab(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loader />
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-600">No {activeTab} requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white p-4 rounded-xl shadow flex gap-4 items-center"
              >
                <img
                  src={req.pet.image}
                  alt={req.pet.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{req.pet.name}</h3>
                  <p className="text-sm text-gray-600">
                    {req.pet.species} • {req.pet.location} • {req.type}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Requested by:{" "}
                    <Link
                      to={`/owner/${req.requester._id}`}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      {req.requester.username}
                    </Link>{" "}
                    ({req.requester.email})
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(req.updatedAt).toLocaleString()}
                  </p>
                </div>

                {activeTab === "pending" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleStatusUpdate(req._id, "accepted")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req._id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingRequests;
