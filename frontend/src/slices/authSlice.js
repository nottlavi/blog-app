import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    token: "",
    profile: {},
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearEmail: (state) => {
      state.email = "";
    },
    clearToken: (state) => {
      state.token = "";
    },
    clearProfile: (state) => {
      state.profile = {};
    },
  },
});

export const {
  setEmail,
  setToken,
  setProfile,
  clearEmail,
  clearToken,
  clearProfile,
} = authSlice.actions;
export default authSlice.reducer;
