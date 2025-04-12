import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAllPetsQuery } from "../../redux/api/petApiSlice";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

//shows the list of pets added by the user 


const PetList = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: pets = [], isLoading, isError, error } = useAllPetsQuery();
//   console.log("Fetched pets:", pets);

  if (!userInfo) {
    return (
      <div className="text-center p-8 text-red-500 text-xl">
        Please login to view your pets.
      </div>
    );
  }

  const userPets = pets.filter((pet) => pet.ownerId?._id === userInfo._id);

  if (isLoading)
    return (
      <div className="text-center mt-8 text-xl">Loading your pets...</div>
    );

  if (isError) {
    toast.error(error?.data?.message || error?.error || "Failed to load pets");
    return (
      <div className="text-red-500 text-center mt-8">
        Error loading pets.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        My Pets
      </h1>

      {userPets.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't posted any pets yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPets.map((pet) => (
            <div
              key={pet._id}
              className="border rounded-lg shadow-md p-4 bg-white relative"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {pet.name}
              </h2>
              <h2 className="text-xl font-semibold text-gray-800">
                Status: {pet.status}
              </h2>
              <p className="text-sm text-gray-600">
                Price: {pet.price}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {pet.duration}
              </p>
              <p className="text-sm text-gray-600">
                Species: {pet.species}, Breed:  {pet.breed}
              </p>
              <p className="text-sm text-gray-600">
                Gender: {pet.gender}
              </p>
              <p className="text-sm text-gray-600">
                Age: {pet.age} years, Color: {pet.color}, Size: {pet.size}
              </p>
              <p className="text-sm text-gray-600">
                Location: {pet.location}
              </p>
              <p className="text-sm text-gray-600">
                Vaccinated: {pet.vaccinated ? "Yes" : "No"}, Neutered: {pet.neutered ? "Yes" : "No"}
                </p>
              <p className="text-sm text-gray-600">
                Description: {pet.description}
              </p>

              <div className="flex justify-between items-center mt-4">


                <Link
                  to={`/pets/edit/${pet._id}`}
                  className="flex items-center gap-1 text-yellow-600 hover:underline"
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
