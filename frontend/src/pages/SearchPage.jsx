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
    <div>
      {/* div for input search field field */}
      <div>
        <input
          className="text-black"
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
          className="text-black"
        >
          <option>Blogs</option>
          <option>Users</option>
        </select>
        {searchTopic === "Blogs" ? (
          <button onClick={searchHandler}>search blogs</button>
        ) : (
          <button onClick={searchUsersHandler}>search users</button>
        )}
      </div>

      <div>
        {searchResults.map((item, idx) => {
          if (searchTopic === "Blogs") {
            return (
              <Link to={`/blog/${item._id}`} key={idx}>
                <div>{item.blogTitle}</div>
              </Link>
            );
          } else {
            return (
              <Link to={`/user/${item._id}`} key={idx}>
                <div>{item.firstName}</div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};
