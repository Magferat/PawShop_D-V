import { Link } from "react-router-dom";

const PetCard = ({ pet }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-black font-semibold text-md">{pet.name}</h3>
        <p className="text-black text-sm">{pet.status}</p>
        <p className="text-black text-sm">Species: {pet.species}</p>
        <p className="text-black text-sm">Location: {pet.location}</p>
        <div className="mt-4">
          <Link
            to={`/pet/${pet._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;