import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [searchTopic, setSearchTopic] = useState("");

  //rl
  console.log(searchTopic);

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
        >
          <option>Blogs</option>
          <option>Users</option>
        </select>
        <button onClick={searchHandler}>search</button>
      </div>

      <div>
        {searchResults.map((blog, idx) => {
          return (
            <Link to={`/blog/${blog._id}`}>
              <div key={idx}>{blog.blogTitle}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
