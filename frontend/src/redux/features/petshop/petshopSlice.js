import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pets: [], // List of pets
  checked: [], // Selected filters
  species: [], // Unique species for filtering
};

const petShopSlice = createSlice({
  name: "petShop",
  initialState,
  reducers: {
    setPets: (state, action) => {
      state.pets = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setSpecies: (state, action) => {
      state.species = action.payload;
    },
  },
});

export const { setPets, setChecked, setSpecies } = petShopSlice.actions;

export default petShopSlice.reducer;