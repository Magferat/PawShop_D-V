import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredPetsQuery } from "../redux/api/petApiSlice";
import { setPets } from "../redux/features/petshop/petshopSlice";
import Loader from "../components/Loader";
import PetCard from "./Pets/PetCard";

const PetShop = () => {
  const dispatch = useDispatch();
  const { checked = [], pets = [] } = useSelector((state) => state.petShop);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  

  // This query fetches pets based on Redux-checked filters and local search input
  const { data: petData = [], isLoading: loadingPets } = useGetFilteredPetsQuery({
    checked,
    search,
  });
  console.log("Fetched pets from RTK Query:", petData);

  // This only runs ONCE when the filtered petData is fetched
  useEffect(() => {
    if (!loadingPets && petData.length) {
      dispatch(setPets(petData));
    }
  }, [loadingPets, petData, dispatch]);

  // Local filtering based on species
  const filteredPets = status
    ? pets.filter((p) => p.status === status)
    : pets;

  const uniqueStatus = [...new Set(pets.map((p) => p.status).filter(Boolean))];

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="bg-[#e5f0dc] p-4 w-[220px] min-h-screen shadow-md space-y-4">
        <h2 className="text-lg text-black font-bold text-center mb-4">Filter By</h2>

        <div>
          <h3 className="text-black font-semibold mt-6 mb-2">Status</h3>
          {uniqueStatus.map((statusItem) => (
            <button
              key={statusItem}
              onClick={() => setStatus(statusItem)}
              className="text-black w-full mb-2 py-2 rounded-full bg-green-200 hover:bg-green-300 font-semibold"
            >
              {statusItem}
            </button>
          ))}
        </div>

        <div>

</div>

        <button
          onClick={() => {
            setStatus("");
            setSearch("");
          }}
          className="text-black mt-4 w-full bg-red-200 hover:bg-red-300 py-2 rounded-full"
        >
          Reset Filters
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-center">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-black w-full max-w-2xl px-6 py-3 border-2 border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
          />
        </div>

        {/* Pet Grid */}
        <h2 className="text-2xl text-black font-bold mb-6">Pet Shop</h2>
        {loadingPets ? (
          <Loader />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPets.map((p) => (
              <PetCard key={p._id} pet={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PetShop;
