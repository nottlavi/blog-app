import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SelfProfile } from "../components/core/UserPage/SelfProfile";
import { OtherProfile } from "../components/core/UserPage/OtherProfile";
import { useParams } from "react-router-dom";
import axios from "axios";

export const UserPage = () => {
  //importing imp info from redux
  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);
  const [tempProfile, setTempProfile] = useState({});

  //importing BASE_URL from env
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { userId } = useParams();

  useEffect(() => {
    //fetching profile from backend
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/get-user-by-id`, {
          params: { userId },
        });
        if (res) {
          console.log(res);
          setTempProfile(res.data.data);
        }
      } catch (err) {
        if (err.response) {
          console.log(err.response);
        } else {
          console.log("something went wrong");
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      hello {profile.firstName}
      {/* {tempProfile.email === profile.email ? <SelfProfile /> : <OtherProfile />} */}
    </div>
  );
};
