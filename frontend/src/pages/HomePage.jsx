import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CreatorHome } from "../components/core/HomePage/CreatorHome";
import { GuestHome } from "../components/core/HomePage/GuestHome";
import { ReaderHome } from "../components/core/HomePage/ReaderHome";
import axios from "axios";
import { setProfile } from "../slices/authSlice";
import { Link } from "react-router-dom";
import { LoadingPage } from "../pages/LoadingPage";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { MdOutlineWatchLater } from "react-icons/md";

export const HomePage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  //below three values were setup on login page
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.auth.profile);
  const email = useSelector((state) => state.auth.email);
  const [feedPosts, setFeedPosts] = useState();
  //setting the profile in local storage because redux-store resets to initial state on reload
  const [loading, setLoading] = useState(false);

  const getFeedPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setFeedPosts(res.data.blogs);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const likeHandler = async (blogId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/blog/like-blog`,
        { blogId },
        { withCredentials: true }
      );
      console.log(res);
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  useEffect(() => {
    if (profile && profile._id) {
      localStorage.setItem("profile", JSON.stringify(profile));
    }
    getFeedPosts();
  }, [profile, token]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your feed</h2>
      {loading ? (
        <LoadingPage />
      ) : Array.isArray(feedPosts) && feedPosts.length > 0 ? (
        <div className="grid gap-3 grid-cols-2">
          {feedPosts.map((post, idx) => (
            <Link to={`/blog/${post._id}`} key={idx}>
              {/* div for one blog */}
              <div className="card p-4 hover:bg-gray-900 transition min-h-44">
                {/* div to contain the profile pic and the blog title */}
                <div className="flex gap-3">
                  {/* div for user profile pic */}
                  <div className="flex items-center">
                    {post.author.profilePic ? (
                      <img
                        src={post.author.profilePic}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="font-medium">{post.blogTitle}</div>
                </div>
                <div className="text-gray-400 ">
                  {post.blogBody.length < 300
                    ? post.blogBody
                    : post.blogBody.slice(0, 300) + "..."}
                </div>
                {/* div to show the actions menu */}
                <div className="card flex gap-4 p-3 px-4 mt-2">
                  {post.likes.includes(profile?._id) ? (
                    <button>
                      <BiSolidLike />
                    </button>
                  ) : (
                    <button>
                      <BiLike />
                    </button>
                  )}
                </div>
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
