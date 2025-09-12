import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null,
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearEmail: (state) => {
      state.email = "";
    },
    clearToken: (state) => {
      state.token = "";
    },
  },
});

export const { setEmail, setToken, clearEmail, clearToken } = authSlice.actions;
export default authSlice.reducer;
