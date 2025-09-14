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
          console.log(res);
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
    <div>
      <p>hello {profile.firstName}</p>
      {blogs.map((blog, idx) => {
        return (
          <Link to={`/blog/${blog._id}`}>
            <div key={idx}>
              {blog.blogTitle}
              {blog.blogBody}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
