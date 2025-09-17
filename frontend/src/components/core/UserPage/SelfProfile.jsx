import React from "react";
import { useSelector } from "react-redux";

export const SelfProfile = () => {
  //looading imp info from redux
  const profile = useSelector((state) => state.auth.profile);

  return <div className="card p-6">hello {profile.firstName}</div>;
};
