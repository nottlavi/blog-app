import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setProfile } from "../../../slices/authSlice";
import { Link } from "react-router-dom";
import TextEditor from "../../common/TextEditor";

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
    <div>
      Welcome {profile.firstName}
      <div className="mt-10">your blogs</div>
      {/* div for all the blogs by the user */}
      <div>
        {userBlogs.map((blog, idx) => {
          return (
            <Link to={`/blog/${blog._id}`} key={idx}>
              <div>{blog.blogTitle}</div>
            </Link>
          );
        })}
      </div>
      {/* div to create a blog */}
      <div className="mt-10">
        <div>create a blog:</div>
        <form onSubmit={createBlogHandler}>
          {/* div for blogTitle */}
          <div>
            <label htmlFor="blogTitle">blog title: </label>
            <input
              className="text-black"
              placeholder="enter blog title"
              name="blogTitle"
              id="blogTitle"
              type="text"
              value={blogTitle}
              onChange={(e) => {
                setBlogTitle(e.target.value);
              }}
            />
          </div>
          {/* div for blogDescription */}
          <div>
            <label htmlFor="blogDescription">blog description: </label>
            <input
              className="text-black"
              placeholder="enter blog description"
              name="blogDescription"
              id="blogDescription"
              type="text"
              value={blogDescription}
              onChange={(e) => {
                setBlogDescription(e.target.value);
              }}
            />
          </div>
          {/* div for blogBody (supports inline image upload) */}
          <TextEditor
            value={blogBody}
            onChange={(newValue) => setBlogBody(newValue)}
            uploadImageToServer={uploadImageToServer}
          />
          <button type="submit">publish blog</button>
        </form>
      </div>
    </div>
  );
};
