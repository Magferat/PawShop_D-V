import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPetByIdQuery } from "../../redux/api/petApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import moment from "moment";
import {
  FaMapMarkerAlt,
  FaClock,
  FaPaw,
  FaMoneyBill,
  FaHeartbeat,
  FaInfoCircle,
  FaDog,
  FaPalette,
  FaVenusMars,
  FaWeight
} from "react-icons/fa";
import {
  useAddPetRequestMutation,
  useDeletePetRequestMutation,
  useGetOutgoingRequestsQuery
} from "../../redux/api/petrequestsApiSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const PetDetails = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: pet, isLoading, error } = useGetPetByIdQuery(id);

  const [addPetRequest, { isLoading: requestLoading }] = useAddPetRequestMutation();
  const [deletePetRequest, { isLoading: deleteLoading }] = useDeletePetRequestMutation();
  const { data: outgoingRequests, isLoading: loadingOutgoing } = useGetOutgoingRequestsQuery();

  const [existingRequest, setExistingRequest] = useState(null);

  useEffect(() => {
    if (outgoingRequests && pet?._id) {
      const request = outgoingRequests.find((r) => r.pet._id === pet._id);
      setExistingRequest(request || null);
    }
  }, [outgoingRequests, pet]);

  const handleSendRequest = async () => {
    try {
      const res = await addPetRequest(pet._id).unwrap();
      toast.success("Request sent successfully!");
      setExistingRequest(res);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send request");
    }
  };

  const handleCancelRequest = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this request?");
    if (!confirmCancel) return;

    try {
      await deletePetRequest(existingRequest._id).unwrap();
      toast.success("Request cancelled.");
      setExistingRequest(null);
    } catch (err) {
      console.error("Error deleting request:", err);
      toast.error("Failed to cancel request.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <Link to="/petshop" className="text-blue-500 font-medium hover:underline mb-4 block">
        ← Back to Pet Listings
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full lg:w-[400px] h-auto object-cover rounded-xl shadow"
          />

          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{pet.name}</h2>
            <p className="text-gray-600 mb-4 italic">{pet.description}</p>

            <div className="space-y-2 text-gray-700 text-[17px]">
              <p className="flex items-center gap-2">
                <FaPaw className="text-pink-500" /> Species: {pet.species}
              </p>
              <p className="flex items-center gap-2">
                <FaDog className="text-orange-500" /> Breed: {pet.breed}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-yellow-500" /> Age: {pet.age} year{pet.age !== 1 ? "s" : ""}
              </p>
              <p className="flex items-center gap-2">
                <FaVenusMars className="text-purple-500" /> Gender: {pet.gender}
              </p>
              <p className="flex items-center gap-2">
                <FaWeight className="text-sky-500" /> Size: {pet.size}
              </p>
              <p className="flex items-center gap-2">
                <FaPalette className="text-rose-400" /> Color: {pet.color}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" /> Location: {pet.location}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-yellow-600" /> Added: {moment(pet.createdAt).fromNow()}
              </p>
              <p className="flex items-center gap-2">
                <FaInfoCircle className="text-indigo-600" /> Status: {pet.status}
              </p>

              {pet.status === "For Sale" && (
                <p className="flex items-center gap-2">
                  <FaMoneyBill className="text-indigo-500" /> Price: ${pet.price}
                </p>
              )}
              {pet.status === "Foster" && pet.duration && (
                <p className="flex items-center gap-2">
                  <FaClock className="text-teal-500" /> Foster Duration: {pet.duration}
                </p>
              )}

              <p className="flex items-center gap-2">
                <FaHeartbeat className="text-red-400" /> Health:{" "}
                {pet.vaccinated ? "Vaccinated" : "Not Vaccinated"},{" "}
                {pet.neutered ? "Neutered" : "Not Neutered"}
              </p>

              <Link
                to={`/owner/${pet.ownerId}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                View Owner Profile
              </Link>

              <br />

              {userInfo && userInfo._id !== pet.ownerId && !loadingOutgoing &&(
                <>
                  {existingRequest ? (
                    <>
                      {existingRequest.status === "pending" ? (
                        <button
                          onClick={handleCancelRequest}
                          disabled={deleteLoading}
                          className="inline-flex items-center px-3 py-2 mt-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                        >
                          {deleteLoading ? "Cancelling..." : "Cancel Request"}
                        </button>
                      ) : (
                        <p className="mt-3 text-sm text-gray-500">
                          Request already <span className="font-semibold">{existingRequest.status}</span>. You can't cancel it.
                        </p>
                      )}

                      <p className="mt-2 text-sm text-gray-600">
                        Request Status:{" "}
                        <span className="font-semibold">{existingRequest.status}</span>
                      </p>
                    </>
                  ) : (
                    <button
                      onClick={handleSendRequest}
                      disabled={requestLoading}
                      className="inline-flex items-center px-3 py-2 mt-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300"
                    >
                      {requestLoading ? "Sending..." : "Send Request to Owner"}
                    </button>
                  )}

                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
