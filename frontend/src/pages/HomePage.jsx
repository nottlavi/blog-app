import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CreatorHome } from "../components/core/HomePage/CreatorHome";
import { GuestHome } from "../components/core/HomePage/GuestHome";
import { ReaderHome } from "../components/core/HomePage/ReaderHome";
import axios from "axios";
import { setProfile } from "../slices/authSlice";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  //below three values were setup on login page
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.auth.profile);
  const email = useSelector((state) => state.auth.email);
  const [feedPosts, setFeedPosts] = useState();
  //setting the profile in local storage because redux-store resets to initial state on reload

  const getFeedPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      });
      setFeedPosts(res.data.blogs);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (profile && profile._id) {
      localStorage.setItem("profile", JSON.stringify(profile));
    }
    getFeedPosts();
  }, [profile]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your feed</h2>
      {Array.isArray(feedPosts) && feedPosts.length > 0 ? (
        <div className="grid gap-3">
          {feedPosts.map((post, idx) => (
            <Link to={`/blog/${post._id}`} key={idx}>
              <div className="card p-4 hover:bg-gray-900 transition">
                <div className="font-medium">{post.blogTitle}</div>
                <div className="text-gray-400 line-clamp-2">{post.blogDescription || ""}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-400">No posts in your feed yet.</div>
      )}
      {profile?.role === "Creator" && token ? (
        <CreatorHome />
      ) : profile?.role === "Reader" && token ? (
        <ReaderHome />
      ) : (
        <GuestHome />
      )}
    </div>
  );
};
