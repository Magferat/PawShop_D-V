import asyncHandler from "../middlewares/asyncHandler.js";
import Pet from "../models/petModel.js";

// Add a new pet
const addPet = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      size,
      color,
      status,
      price,
      description,
      vaccinated,
      neutered,
      microchipped,
      // image,
      location,
    } = req.fields;

    // const image = req.files?.image;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !species:
        return res.status(400).json({ error: "Species is required" });
      case !breed:
        return res.status(400).json({ error: "Breed is required" });
      case !age:
        return res.status(400).json({ error: "Age is required" });
      case !gender:
        return res.status(400).json({ error: "Gender is required" });
      case !size:
        return res.status(400).json({ error: "Size is required" });
      case !color:
        return res.status(400).json({ error: "Color is required" });
      case !status:
        return res.status(400).json({ error: "Status is required" });
      case !location:
        return res.status(400).json({ error: "Location is required" });
    }

    const pet = new Pet({
      ...req.fields,
      // image: image?.filepath || "",
      ownerId: req.user._id, // Assign the ownerId from the logged-in user
    });





    await pet.save();
    res.json(pet);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Update pet details (only for the user who uploaded the pet)
const updatePetDetails = asyncHandler(async (req, res) => {
  try {
    
    const pet = await Pet.findById(req.params.id);
    
    console.log("Request fields:", req.fields); // ✅ Debug log
    

    // Check if the pet exists
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Check if the logged-in user is the owner of the pet
    if (pet.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this pet" });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );


    await updatedPet.save();
    res.json(updatedPet);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Remove a pet (only for the user who uploaded the pet)
const removePet = asyncHandler(async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    // Check if the pet exists
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Check if the logged-in user is the owner of the pet
    if (pet.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this pet" });
    }

    await pet.deleteOne();
    res.json({ message: "Pet removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch all pets (pagination and search)
const fetchPets = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { species: { $regex: req.query.keyword, $options: "i" } },
            { breed: { $regex: req.query.keyword, $options: "i" } },
            { gender: { $regex: req.query.keyword, $options: "i" } },
            { size: { $regex: req.query.keyword, $options: "i" } },
            { color: { $regex: req.query.keyword, $options: "i" } },
            { status: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
            { location: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const count = await Pet.countDocuments({ ...keyword });
    const pets = await Pet.find({ ...keyword }).limit(pageSize);

    res.json({
      pets,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Fetch a specific pet by ID
const fetchPetById = asyncHandler(async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (pet) {
      return res.json(pet);
    } else {
      res.status(404);
      throw new Error("Pet not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Pet not found" });
  }
});

// Fetch all pets (admin only)
const fetchAllPets = asyncHandler(async (req, res) => {
  try {
    const pets = await Pet.find({})
      .populate("ownerId") // Populate owner information
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Fetch newly added pets
const fetchNewPets = asyncHandler(async (req, res) => {
  try {
    const pets = await Pet.find().sort({ _id: -1 }).limit(5);
    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});


const filterPets = asyncHandler(async (req, res) => {
  try {
    const { checked, search } = req.body;

    let query = {};

    if (checked.length > 0) {
      query.status = { $in: checked }; // filter by selected species
    }

    if (search?.trim()) {
      const searchRegex = new RegExp(search, 'i'); // case-insensitive regex
      query.$or = [
        { name: searchRegex },
        { species: searchRegex },
        { status: searchRegex },
        { location: searchRegex },
      ];
    }

    const pets = await Pet.find(query);
    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});



export {
  addPet,
  updatePetDetails,
  removePet,
  fetchPets,
  fetchPetById,
  fetchAllPets,
  fetchNewPets,
  filterPets,
};
