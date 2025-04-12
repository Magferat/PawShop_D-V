import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPetByIdQuery,
  useUpdatePetMutation,
  useDeletePetMutation,
  useUploadPetImageMutation,
} from "../../redux/api/petApiSlice";
import { toast } from "react-toastify";

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const { data: petData, isLoading } = useGetPetByIdQuery(id);
  const [updatePet] = useUpdatePetMutation();
  const [deletePet] = useDeletePetMutation();
  const [uploadPetImage] = useUploadPetImageMutation();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);

  useEffect(() => {
    if (petData) {
      setImage(petData.image);
      setName(petData.name);
      setSpecies(petData.species);
      setBreed(petData.breed);
      setAge(petData.age);
      setGender(petData.gender);
      setSize(petData.size);
      setColor(petData.color);
      setStatus(petData.status);
      setPrice(petData.price);
      setDuration(petData.duration);
      setDescription(petData.description);
      setLocation(petData.location);
      setVaccinated(petData.vaccinated);
      setNeutered(petData.neutered);
    }
  }, [petData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadPetImage(formData).unwrap();
      setImage(res.image);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
   
    if (!id) {
      toast.error("Invalid pet ID");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("species", species);
      formData.append("breed", breed);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("size", size);
      formData.append("color", color);
      formData.append("status", status);
      formData.append("price", status === "Adoptable" || status === "Foster" ? 0 : price);
      formData.append("duration", status === "For Sale" || status === "Adoptable" ? "" : duration);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("vaccinated", vaccinated);
      formData.append("neutered", neutered);
  
     
  
      const response = await updatePet({ petId: id, formData }).unwrap();
  
      
      toast.success("Pet updated");
      navigate("/petlist");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed");
    }
  };

  // const handleDelete = async () => {
  //   if (!id) {
  //     toast.error("Invalid pet ID");
  //     return;
  //   }

  //   if (window.confirm("Are you sure you want to delete this pet?")) {
  //     try {
  //       await deletePet(id).unwrap();
  //       toast.success("Pet deleted");
  //       navigate("/petlist");
  //     } catch (err) {
  //       toast.error("Delete failed");
  //     }
  //   }
  // };

  const handleDelete = async () => {
      try {
        let answer = window.confirm(
          "Are you sure you want to delete this pet?"
        );
        if (!answer) return;
  
        const { data } = await deletePet(id);
        toast.success(`"${name}" is deleted`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/petlist");
      } catch (err) {
        console.log(err);
        toast.error("Delete failed. Try again.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Pet</h1>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block mb-1">Image</label>
          <input type="file" accept="image/*" onChange={uploadFileHandler} />
          {image && <img src={image} alt="Preview" className="w-40 mt-2 rounded" />}
        </div>

        <div>
          <label className="block mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-box" />
        </div>

        <div>
          <label className="block mb-1">Species</label>
          <input value={species} onChange={(e) => setSpecies(e.target.value)} className="input-box" />
        </div>

        <div>
          <label className="block mb-1">Breed</label>
          <input value={breed} onChange={(e) => setBreed(e.target.value)} className="input-box" />
        </div>

        <div>
          <label className="block mb-1">Age</label>
          <input value={age} onChange={(e) => setAge(e.target.value)} className="input-box" />
        </div>

        <div>
          <label className="block mb-1">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="text-black input-box">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="text-black input-box">
            <option value="">Select Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Color</label>
          <input value={color} onChange={(e) => setColor(e.target.value)} className="input-box" />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-black input-box">
            <option value="">Select Status</option>
            <option value="For Sale">For Sale</option>
            <option value="Adoptable">Adoptable</option>
            <option value="Foster">Foster</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-box"
            disabled={status === "Adoptable" || status === "Foster"}
          />
        </div>

        <div>
          <label className="block mb-1">Duration</label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-box"
            disabled={status === "For Sale" || status === "Adoptable"}
          />
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-box" />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-box" />
        </div>

        <div className="flex gap-4 items-center">
          <label>
            <input type="checkbox" checked={vaccinated} onChange={(e) => setVaccinated(e.target.checked)} /> Vaccinated
          </label>
          <label>
            <input type="checkbox" checked={neutered} onChange={(e) => setNeutered(e.target.checked)} /> Neutered
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit"  className="bg-green-600 text-white px-6 py-2 rounded">
            Update
          </button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPet;
