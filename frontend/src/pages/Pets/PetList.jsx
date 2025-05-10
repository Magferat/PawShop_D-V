import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAllPetsQuery } from "../../redux/api/petApiSlice";
import { FaEdit, FaPaw, FaMapMarkerAlt, FaHeartbeat, FaDog } from "react-icons/fa";
import { toast } from "react-toastify";

const PetList = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: pets = [], isLoading, isError, error } = useAllPetsQuery();

  if (!userInfo) {
    return (
      <div className="text-center p-10 text-red-500 text-xl font-semibold">
        🚫 Please login to view your pets.
      </div>
    );
  }

  const userPets = pets.filter((pet) => pet.ownerId?._id === userInfo._id);

  if (isLoading)
    return (
      <div className="text-center mt-12 text-xl text-blue-500 font-semibold animate-pulse">
        🐾 Loading your pets...
      </div>
    );

  if (isError) {
    toast.error(error?.data?.message || error?.error || "Failed to load pets");
    return (
      <div className="text-red-500 text-center mt-8 font-semibold">
        ❌ Error loading pets.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-pink-600 flex justify-center items-center gap-3">
        <FaPaw className="text-5xl text-pink-400" />
        My Pets
      </h1>

      {userPets.length === 0 ? (
        <p className="text-center text-gray-500 text-lg bg-pink-50 rounded-full py-3 px-6 mx-auto w-fit shadow">
          🐾 You haven't posted any pets yet. Time to share some cuteness!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userPets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white border border-pink-100 rounded-3xl shadow-lg p-5 relative hover:shadow-xl transition"
            >
              {/* Status badge */}
              <div className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {pet.status}
              </div>

              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-52 object-cover rounded-2xl mb-4 border border-pink-100"
              />

              <h2 className="text-2xl font-bold text-gray-800 mb-1">{pet.name}</h2>
              <p className="text-sm text-gray-500 mb-2 italic">
                {pet.species} • {pet.breed} • {pet.gender}
              </p>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <FaDog className="inline mr-2 text-pink-400" />
                  Age: {pet.age} years • Color: {pet.color} • Size: {pet.size}
                </p>
                <p>
                  <FaMapMarkerAlt className="inline mr-2 text-pink-400" />
                  Location: {pet.location}
                </p>
                <p>
                  💰 Price: {pet.price} • Duration: {pet.duration}
                </p>
                <p>
                  <FaHeartbeat className="inline mr-2 text-pink-400" />
                  Vaccinated: {pet.vaccinated ? "Yes" : "No"}, Neutered: {pet.neutered ? "Yes" : "No"}
                </p>
                <p className="line-clamp-3">
                  📝 {pet.description}
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <Link
                  to={`/pets/edit/${pet._id}`}
                  className="flex items-center gap-1 text-pink-600 hover:underline text-sm font-semibold"
                >
                  <FaEdit />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;
