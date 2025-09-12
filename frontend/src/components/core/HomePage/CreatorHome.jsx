import React, { useState } from "react";
import { useSelector } from "react-redux";

export const CreatorHome = ({ profile }) => {
  const userBlogs = profile.blogs;
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogBody, setBlogBody] = useState("");

  const createBlogHandler = async(e) => {

  }

  return (
    <div>
      Welcome {profile.firstName}
      <div className="mt-10">your blogs</div>
      {/* div for all the blogs by the user */}
      <div>
        {userBlogs.map((blog, idx) => {
          return <div key={idx}>{blog.blogTitle}</div>;
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
          {/* div for blogBody */}
          <div>
            <label htmlFor="blogBody">blog body: </label>
            <input
              className="text-black"
              placeholder="enter blog description"
              name="blogBody"
              id="blogBody"
              type="text"
              value={blogBody}
              onChange={(e) => {
                setBlogBody(e.target.value);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
