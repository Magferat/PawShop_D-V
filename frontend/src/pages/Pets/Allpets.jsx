import { useSelector } from "react-redux";
import { useAllPetsQuery } from "../../redux/api/petApiSlice";


const Allpets = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: pets = [] } = useAllPetsQuery();


  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        All Pets
      </h1>


       
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="border rounded-lg shadow-md p-4 bg-white relative"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-20 h-20 object-cover rounded mb-3"
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

            </div>
          ))}
        </div>
  
  );
};

export default Allpets;
