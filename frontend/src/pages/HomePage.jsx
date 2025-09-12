import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CreatorHome } from "../components/core/HomePage/CreatorHome";
import { GuestHome } from "../components/core/HomePage/GuestHome";
import { ReaderHome } from "../components/core/HomePage/ReaderHome";
import axios from "axios";

export const HomePage = () => {
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchProfile = async (email) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
      });
      if (res) {
        setProfile(res.data.data);
        setRole(res.data.data.role);
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log("something went wrong");
      }
    }
  };

  const email = useSelector((state) => state.auth.email);

  useEffect(() => {
    fetchProfile(email);
  }, [email]);

  return (
    <div>
      {role === "Creator" ? (
        <CreatorHome profile={profile} />
      ) : role === "Reader" ? (
        <ReaderHome profile={profile} />
      ) : (
        <GuestHome />
      )}
    </div>
  );
};
