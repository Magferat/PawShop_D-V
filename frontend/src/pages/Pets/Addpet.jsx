import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePetMutation, useUploadPetImageMutation } from "../../redux/api/petApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddPet = () => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [createPet, { isLoading, isError, error }] = useCreatePetMutation();
  const [uploadPetImage] = useUploadPetImageMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!userInfo) {
    return <div className="text-center p-8 text-red-500 text-xl">Please login to add a pet.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petData = new FormData();
      petData.append("image", image);
      petData.append("name", name);
      petData.append("description", description);
      petData.append("price", price);
      petData.append("species", species);
      petData.append("breed", breed);
      petData.append("age", age);
      petData.append("gender", gender);
      petData.append("size", size);
      petData.append("color", color);
      petData.append("status", status);
      petData.append("duration", duration);
      petData.append("vaccinated", vaccinated);
      petData.append("neutered", neutered);
      petData.append("location", location);

      await createPet(petData).unwrap();
      navigate("/petshop");
    } catch (err) {
      console.error("Failed to create pet", err);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadPetImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Logic to disable fields
  const disablePrice = status === "Adoptable" || status === "Foster";
  const disableDuration = status === "For Sale" || status === "Adoptable";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-yellow-50 shadow-xl rounded-3xl mt-10 border border-yellow-200">
  <h1 className="text-5xl font-bold text-center text-yellow-700 mb-2">
    🐶 Add Your Pet 🐱
  </h1>
  <h2 className="text-xl font-medium mb-4 text-center text-gray-700">
    Fill in the details to help them find a new home!
  </h2>
  <h3 className="text-md mb-6 text-center text-gray-600 italic">
    (Write "unknown" if you're not sure about a field)
  </h3>

  {isError && (
    <p className="text-red-500 mb-4 text-center">
      {error?.data?.message || "Error adding pet"}
    </p>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="name" placeholder="Pet's Name 🐾" onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
      <input name="species" placeholder="Species (e.g., Dog, Cat)" onChange={(e) => setSpecies(e.target.value)} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
      <input name="breed" placeholder="Breed" onChange={(e) => setBreed(e.target.value)} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
      <input name="age" placeholder="Age (e.g., 6 months, 2 years)" onChange={(e) => setAge(e.target.value)} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

      <select name="gender" onChange={(e) => setGender(e.target.value)} required className="text-black w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <select name="size" onChange={(e) => setSize(e.target.value)} required className="text-black w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
        <option value="">Select Size</option>
        <option>Small</option>
        <option>Medium</option>
        <option>Large</option>
      </select>

      <input name="color" placeholder="Color" onChange={(e) => setColor(e.target.value)} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

      <select name="status" onChange={(e) => setStatus(e.target.value)} required className="text-black w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
        <option value="">Select Status</option>
        <option>For Sale</option>
        <option>Adoptable</option>
        <option>Foster</option>
      </select>

      <input name="price" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} disabled={disablePrice} required={!disablePrice} className="text-black w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

      <input name="duration" placeholder="Foster Duration" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={disableDuration} required={!disableDuration} className="text-black w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

      <input name="location" placeholder="Location 📍" onChange={(e) => setLocation(e.target.value)} required className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
    </div>

    {/* Image Preview */}
    {imageUrl && (
      <div className="text-center mb-4">
        <img src={imageUrl} alt="Pet" className="block mx-auto max-h-[200px] rounded-lg shadow-md border border-yellow-300" />
      </div>
    )}

    {/* Upload */}
    <div>
      <label htmlFor="imageUpload" className="block text-gray-700 font-medium mb-2">
        🖼️ Upload Pet Photo
      </label>
      <label htmlFor="imageUpload" className="cursor-pointer flex items-center justify-center border-2 border-dashed border-yellow-300 rounded-lg py-10 bg-white hover:bg-yellow-100 transition text-center text-yellow-600 font-medium">
        {image ? image.name : "Click here to choose a cute pic!"}
      </label>
      <input id="imageUpload" type="file" name="image" accept="image/*" onChange={uploadFileHandler} className="hidden" />
    </div>

    <textarea name="description" placeholder="Add a friendly description..." onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

    <div className="flex items-center space-x-6">
      <label className="text-black bg-white flex items-center space-x-2">
        <input type="checkbox" name="vaccinated" onChange={(e) => setVaccinated(e.target.checked)} className="h-4 w-4" />
        <span>✅ Vaccinated</span>
      </label>
      <label className="text-black bg-white flex items-center space-x-2">
        <input type="checkbox" name="neutered" onChange={(e) => setNeutered(e.target.checked)} className="h-4 w-4" />
        <span>✂️ Neutered</span>
      </label>
    </div>

    <button type="submit" disabled={isLoading} className="w-full bg-yellow-500 text-white py-3 rounded-xl text-lg font-bold hover:bg-yellow-600 transition-colors disabled:bg-gray-400">
      {isLoading ? "Adding..." : "Add Pet 🐾"}
    </button>
  </form>
</div>

  );
};

export default AddPet;
