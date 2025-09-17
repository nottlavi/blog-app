import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearEmail, clearProfile, clearToken } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { IoSearch } from "react-icons/io5";

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
    <div className="flex items-center justify-between gap-4">
      {/* Brand */}
      <Link to={"/"} className="group">
        <div className="text-xl sm:text-2xl font-semibold tracking-tight">
          <span className="text-white">Blog</span>
          <span className="text-indigo-400 group-hover:text-indigo-300 transition">App</span>
        </div>
      </Link>

      {/* Search icon */}
      <Link to={"/search"} className="text-gray-300 hover:text-white transition">
        <div className="p-2 rounded-md hover:bg-gray-800">
          <IoSearch size={20} />
        </div>
      </Link>

      {/* Auth buttons */}
      {token ? (
        <button onClick={logOutHandler} className="btn-secondary">
          Log Out
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={logInHandler} className="btn-secondary">Log In</button>
          <button onClick={signUpHandler} className="btn-primary">Sign Up</button>
        </div>
      )}
    </div>
  );
};
