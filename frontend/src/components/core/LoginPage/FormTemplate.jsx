import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setEmail as setAuthEmail } from "../../../slices/authSlice";
import { useDispatch } from "react-redux";
import { setToken } from "../../../slices/authSlice";
import { LoadingPage } from "../../../pages/LoadingPage";

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
        dispatch(setAuthEmail(res.data.email));
        dispatch(setToken(res.data.token));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.email);
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        setLoading(false);
        console.log(err.response);
      } else {
        console.log("something went wrong");
      }
    }
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
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
      if (err.response) {
        console.log(err.response);
      } else {
        console.log("something went wrong");
      }
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : type === "login" ? (
        <form onSubmit={logInHandler}>
          {/* login form */}
          {/* div for email */}
          <div>
            <label htmlFor="email"> email: </label>
            <input
              className="text-black"
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
            <label htmlFor="password">password: </label>
            <input
              className="text-black"
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
          <button type="submit">Log In</button>
        </form>
      ) : (
        <form onSubmit={signUpHandler}>
          {/* form for sign up */}
          {/* div for firstName */}
          <div>
            <label htmlFor="firstName">first name: </label>
            <input
              className="text-black"
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
            <label htmlFor="lastName">last name: </label>
            <input
              className="text-black"
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
            <label htmlFor="email"> email: </label>
            <input
              className="text-black"
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
            <label htmlFor="password">password: </label>
            <input
              className="text-black"
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
            <label htmlFor="confirmPassword">confirm password: </label>
            <input
              className="text-black"
              placeholder="re-enter password"
              value={confirmPassword}
              id="confirmPassword"
              name="confirmPassword"
              type="confirmPassword"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          {/* div for role */}
          <div>
            <label>
              <input
                className="text-black"
                type="radio"
                name="role"
                value="Creator"
                checked={role === "Creator"}
                onChange={(e) => setRole(e.target.value)}
              />
              Creator
            </label>
            <label>
              <input
                className="text-black"
                type="radio"
                name="role"
                value="Reader"
                checked={role === "Reader"}
                onChange={(e) => setRole(e.target.value)}
              />
              Reader
            </label>
          </div>
          <button>Sign Up</button>
        </form>
      )}
    </div>
  );
};
