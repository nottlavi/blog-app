import React, { useDeferredValue, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const ReaderHome = () => {
  const profile = useSelector((state) => state.auth.profile);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const fetchBlogs = async (req, res) => {
      try {
        const res = await axios.get(`${BASE_URL}/blog/get-all-blogs`);
        if (res) {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        if (err.response) {
          console.log(err.response);
        } else {
          console.log("something went wrong");
        }
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-lg">Hello {profile.firstName}</p>
      <div className="grid gap-3">
        {blogs.map((blog, idx) => {
          return (
            <Link to={`/blog/${blog._id}`} key={idx}>
              <div className="card p-4 hover:bg-gray-900 transition">
                <div className="font-medium">{blog.blogTitle}</div>
                <div className="text-gray-400 line-clamp-2">{blog.blogBody}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
