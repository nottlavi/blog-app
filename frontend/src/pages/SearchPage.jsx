import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [searchTopic, setSearchTopic] = useState("Blogs");

  const searchUsersHandler = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/search-user?q=${searchTerm}`
      );
      setSearchResults(res.data);
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  const searchHandler = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/blog/search-blogs?q=${searchTerm}`
      );
      if (res) {
        console.log(res.data);
        setSearchResults(res.data);
      }
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {/* div for input search field field */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          className="input flex-1"
          placeholder="search the blog-app"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <select
          value={searchTopic}
          onChange={(e) => {
            setSearchTopic(e.target.value);
          }}
          className="input w-auto"
        >
          <option>Blogs</option>
          <option>Users</option>
        </select>
        {searchTopic === "Blogs" ? (
          <button onClick={searchHandler} className="btn-primary">Search blogs</button>
        ) : (
          <button onClick={searchUsersHandler} className="btn-primary">Search users</button>
        )}
      </div>

      <div className="grid gap-3">
        {searchResults.map((item, idx) => {
          if (searchTopic === "Blogs") {
            return (
              <Link to={`/blog/${item._id}`} key={idx}>
                <div className="card p-4 hover:bg-gray-900 transition">{item.blogTitle}</div>
              </Link>
            );
          } else {
            return (
              <Link to={`/user/${item._id}`} key={idx}>
                <div className="card p-4 hover:bg-gray-900 transition">{item.firstName}</div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};
