import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const OtherProfile = () => {
  //fetching url from the url
  const { userId } = useParams();
  const followedId = userId;
  const [tempProfile, setTempProfile] = useState({});

  //importing backend url from enviorment variables file
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  //fetching logic for following user from backend here
  const followHandler = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/follow-user`,
        { followedId },
        { withCredentials: true }
      );
    } catch (err) {
      if (err.response) {
        console.log(err.response || "something went wrong");
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/user/get-user-by-id`, {
          userId,
        });
        if (res) {
          setTempProfile(res.data.data);
        }
      } catch (err) {
        console.log(err.response || "something went wrong");
      }
    };
    fetchProfile();
  });

  return (
    <div className="flex flex-col gap-4">
      this is the profile of {tempProfile.firstName}
      <div>
        followers: {tempProfile.followers?.length}
      </div>
      <button onClick={followHandler}>follow him!</button>
      
    </div>
  );
};
