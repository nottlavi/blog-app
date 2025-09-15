import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearEmail, clearProfile, clearToken } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export const NavBar = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/logout`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("profile");
      dispatch(clearToken());
      dispatch(clearProfile());
      dispatch(clearEmail());
      navigate("/");
    } catch (err) {
      console.log("something went wrong");
    }
  };

  const logInHandler = () => {
    navigate("/login");
  };

  const signUpHandler = () => {
    navigate("/signup");
  };

  useEffect(() => {}, [token]);

  return (
    <div className="h-10 flex items-center justify-between">
      {/* div for website title */}
      <div className="text-3xl">website title</div>
      {/* div for buttons */}
      {token ? (
        <button onClick={logOutHandler}>Log Out</button>
      ) : (
        <div className="flex gap-4">
          <button onClick={logInHandler}>Log In</button>
          <button onClick={signUpHandler}>Sign Up</button>
        </div>
      )}
    </div>
  );
};
