import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LogInPage } from "./pages/LogInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { HomePage } from "./pages/HomePage";
import { NotFound } from "./pages/NotFound";
import { NavBar } from "./components/common/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setEmail,
  setProfile,
  setToken,
  clearEmail,
  clearProfile,
  clearToken,
} from "./slices/authSlice";
import { BlogPage } from "./pages/BlogPage";
import { UserPage } from "./pages/UserPage";
import { SearchPage } from "./pages/SearchPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    //checked it, the token is valid and im getting it
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const profile = JSON.parse(localStorage.getItem("profile"));

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken.exp);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("profile");

        dispatch(clearToken());
        dispatch(clearEmail());
        dispatch(clearProfile());
      }
    }

    if (token && email && profile) {
      dispatch(setEmail(email));
      dispatch(setToken(token));
      dispatch(setProfile(profile));
    }
  }, []);

  return (
    //make sure to remove this className pre styling
    <div className="text-white bg-black min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/blog/:blogId" element={<BlogPage />} />
        <Route path="/user/:userId" element={<UserPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
