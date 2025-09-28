import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setEmail as setAuthEmail } from "../../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../../slices/authSlice";
import { LoadingPage } from "../../../pages/LoadingPage";
import { setProfile } from "../../../slices/authSlice";
import { toast, ToastContainer } from "react-toastify";

export const FormTemplate = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState("");
  const token = useSelector((state) => state.auth.token);

  const logInHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (res) {
        fetchProfile();
        dispatch(setAuthEmail(res.data.email));
        dispatch(setToken(res.data.token));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.email);
        fetchProfile();
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        setLoading(false);
        toast.error(err.response.data.message);
      }
    }
  };

  const fetchProfile = async (email) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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

  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/user/signup`, {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        role,
      });
      if (res) {
        console.log(res);
        navigate("/verify-email");
        dispatch(setAuthEmail(email));
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.log(err.response);
        toast.error(err.response.data.message);
      } else {
        console.log("something went wrong");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <ToastContainer />

      {type === "login" ? (
        <form onSubmit={logInHandler} className="card p-6 space-y-4 flex items-center flex-col ">
          {/* login form */}
          {/* div for email */}
          <div className="w-full">
            <label htmlFor="email" className="label">
              {" "}
              email{" "}
            </label>
            <input
              className="input"
              placeholder="enter email"
              value={email}
              id="email"
              name="email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          {/* div for password */}
          <div className="w-full">
            <label htmlFor="password" className="label">
              password
            </label>
            <input
              className="input"
              placeholder="enter password"
              value={password}
              id="password"
              name="password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          {loading ? (
            <LoadingPage />
          ) : (
            <button type="submit" className="btn-primary w-full">
              Log In
            </button>
          )}
        </form>
      ) : (
        <form onSubmit={signUpHandler} className="card p-6 space-y-5">
          {/* form for sign up */}
          {/* div for firstName */}
          <div>
            <label htmlFor="firstName" className="label">
              first name
            </label>
            <input
              className="input"
              placeholder="enter first name"
              value={firstName}
              id="firstName"
              name="firstName"
              type="text"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>
          {/* div for lastName */}
          <div>
            <label htmlFor="lastName" className="label">
              last name
            </label>
            <input
              className="input"
              placeholder="enter last name"
              value={lastName}
              id="lastName"
              name="lastName"
              type="text"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          {/* div for email */}
          <div>
            <label htmlFor="email" className="label">
              {" "}
              email{" "}
            </label>
            <input
              className="input"
              placeholder="enter email"
              value={email}
              id="email"
              name="email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          {/* div for password */}
          <div>
            <label htmlFor="password" className="label">
              password
            </label>
            <input
              className="input"
              placeholder="enter password"
              value={password}
              id="password"
              name="password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          {/* div for confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="label">
              confirm password
            </label>
            <input
              className="input"
              placeholder="re-enter password"
              value={confirmPassword}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          {/* div for role */}
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                className="accent-indigo-500"
                type="radio"
                name="role"
                value="Creator"
                checked={role === "Creator"}
                onChange={(e) => setRole(e.target.value)}
              />
              <span>Creator</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                className="accent-indigo-500"
                type="radio"
                name="role"
                value="Reader"
                checked={role === "Reader"}
                onChange={(e) => setRole(e.target.value)}
              />
              <span>Reader</span>
            </label>
          </div>
          <button className="btn-primary w-full">Sign Up</button>
        </form>
      )}
    </div>
  );
};
