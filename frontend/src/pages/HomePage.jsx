import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CreatorHome } from "../components/core/HomePage/CreatorHome";
import { GuestHome } from "../components/core/HomePage/GuestHome";
import { ReaderHome } from "../components/core/HomePage/ReaderHome";
import axios from "axios";
import { setProfile } from "../slices/authSlice";

export const HomePage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  //this token was setup on login page
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);

  const email = useSelector((state) => state.auth.email);

  useEffect(() => {
    const fetchProfile = async (email) => {
      try {
        const res = await axios.get(`${BASE_URL}/user/profile`, {
          withCredentials: true,
        });
        if (res) {
          dispatch(setProfile(res.data.data));
        }
      } catch (err) {
        if (err.response) {
          console.log(err.response);
        } else {
          console.log("something went wrong");
        }
      }
    };
    fetchProfile(email);
  }, []);

  // useEffect(() => {
  //   if (email && token) {
  //     fetchProfile(email);
  //   }
  // }, [email, token]);

  return (
    <div>
      {profile?.role === "Creator" ? (
        <CreatorHome />
      ) : profile?.role === "Reader" ? (
        <ReaderHome />
      ) : (
        <GuestHome />
      )}
    </div>
  );
};
