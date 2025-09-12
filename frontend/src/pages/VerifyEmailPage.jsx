import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const VerifyEmailPage = () => {
  const [OTP, setOTP] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const email = useSelector((state) => state.auth.email);
  const navigate = useNavigate();

  const verificationHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/user/verify-email`, {
        email,
        OTP,
      });
      if (res) {
        console.log(res);
        navigate("/login");
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
      <form onSubmit={verificationHandler}>
        {/* div for OTP */}
        <div>
          <label htmlFor="OTP">OTP: </label>
          <input
            name="OTP"
            id="OTP"
            type="text"
            placeholder="enter otp: "
            value={OTP}
            onChange={(e) => {
              setOTP(e.target.value);
            }}
          />
        </div>
        <button type="submit">verify email</button>
      </form>
    </div>
  );
};
