import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pets: [], // List of pets
  
};

const petShopSlice = createSlice({
  name: "petShop",
  initialState,
  reducers: {
    setPets: (state, action) => {
      state.pets = action.payload;
    },
  },
});

export const { setPets } = petShopSlice.actions;

export default petShopSlice.reducer;