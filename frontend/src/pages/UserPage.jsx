import React from "react";
import { useSelector } from "react-redux";
import { SelfProfile } from "../components/core/UserPage/SelfProfile";
import { OtherProfile } from "../components/core/UserPage/OtherProfile";

export const UserPage = () => {
  //importing imp info from redux
  const profile = useSelector((state) => state.auth.profile);
  //this email will be used to verify if the logged in user is viewing their own profile
  const email = useSelector((state) => state.auth.email);



  return (
    //this shit will always match
    <div>{email === profile.email ? <SelfProfile /> : <OtherProfile />}</div>
  );
};
