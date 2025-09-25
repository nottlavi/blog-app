import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setProfile } from "../../../slices/authSlice";
import { Link } from "react-router-dom";
import TextEditor from "../../common/TextEditor";
import PostModal from "./PostModal";

export const CreatorHome = () => {
  //import profile from redux
  const profile = useSelector((state) => state.auth.profile);
  const userBlogs = profile?.blogs || [];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogBody, setBlogBody] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  //useRef for post modal
  const postModalRef = useRef(null);

  // upload image used by the editor's image button
  const uploadImageToServer = async (file) => {
    const fd = new FormData();
    fd.append("image", file); // field name must be "image" (matches backend)
    const res = await axios.post(`${BASE_URL}/blog/image`, fd, {
      withCredentials: true,
      // Do NOT set 'Content-Type' manually; browser sets multipart boundary.
    });
    return res.data.imageUrl;
  };

  const createBlogHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/blog/create-blog`,
        {
          blogTitle,
          createdAt: Date.now(),
          author: profile._id,
          blogDescription,
          blogBody,
        },
        { withCredentials: true }
      );
      if (res) {
        setBlogTitle("");
        setBlogBody("");
        setBlogDescription("");
        fetchBlogsByUser();
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log("something went wrong");
      }
    }
  };

  const fetchBlogsByUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
      });
      if (res?.data?.data) {
        dispatch(setProfile(res.data.data));
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log("something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?._id) fetchBlogsByUser();
  }, [profile?._id]);

  return (
    <div className="space-y-8">
      <div className="text-lg">Welcome {profile.firstName}</div>
      <div className="text-sm uppercase tracking-wide text-gray-400">
        your blogs
      </div>
      {/* div for all the blogs by the user */}
      <div className="grid gap-3">
        {userBlogs.map((blog, idx) => {
          return (
            <Link to={`/blog/${blog._id}`} key={idx}>
              <div className="card p-4 hover:bg-gray-900 transition">
                {blog.blogTitle}
              </div>
            </Link>
          );
        })}
      </div>
      {/* modal to create a blog */}
      <PostModal />
    </div>
  );
};
