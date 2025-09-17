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
  // this is the user id fetched from the url and the url is derived from BlogPage.jsx
  const { userId } = useParams();

  return (
    <div className="space-y-6">
      {userId === profile._id ? <SelfProfile /> : <OtherProfile />}
    </div>
  );
};
