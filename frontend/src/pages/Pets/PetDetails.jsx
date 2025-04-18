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

const PetDetails = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: pet, isLoading, error } = useGetPetByIdQuery(id);
  
  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <Link to="/petshop" className="text-blue-500 font-medium hover:underline mb-4 block">
        ← Back to Pet Listings
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
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


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
