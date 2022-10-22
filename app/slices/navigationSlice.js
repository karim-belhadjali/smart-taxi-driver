import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  travelTimeInfo: null,
  currentLocation: "Waiting..",
  currentUser: null,
  clientLocation: null,
  occupied: false,
  resting: true,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInfo: (state, action) => {
      state.travelTimeInfo = action.payload;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setOccupied: (state, action) => {
      state.occupied = action.payload;
    },
    setResting: (state, action) => {
      state.resting = action.payload;
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setTravelTimeInfo,
  setCurrentLocation,
  setCurrentUser,
  setOccupied,
  setResting,
} = navigationSlice.actions;

export const selectOrigin = (state) => state.navigation.origin;
export const selectDestination = (state) => state.navigation.destination;
export const selectTravelTimeInfo = (state) => state.navigation.travelTimeInfo;
export const selectCurrentUser = (state) => state.navigation.currentUser;
export const selectOccupied = (state) => state.navigation.occupied;
export const selectResting = (state) => state.navigation.resting;
export const selectCurrentLocation = (state) =>
  state.navigation.currentLocation;

export default navigationSlice.reducer;
