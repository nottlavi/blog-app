import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CreatorHome } from "../components/core/HomePage/CreatorHome";
import { GuestHome } from "../components/core/HomePage/GuestHome";
import { ReaderHome } from "../components/core/HomePage/ReaderHome";
import axios from "axios";
import { setProfile } from "../slices/authSlice";

export const HomePage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  //below three values were setup on login page
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.auth.profile);
  const email = useSelector((state) => state.auth.email);
  //setting the profile in local storage because redux-store resets to initial state on reload

  useEffect(() => {
    if (profile && profile._id) {
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }, [profile]);

  return (
    <div className="space-y-6">
      {profile?.role === "Creator" && token ? (
        <CreatorHome />
      ) : profile?.role === "Reader" && token ? (
        <ReaderHome />
      ) : (
        <GuestHome />
      )}
    </div>
  );
};
