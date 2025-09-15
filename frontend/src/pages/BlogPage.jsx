import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const BlogPage = () => {
  const { blogId } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [blog, setBlog] = useState({});
  const [replyBody, setReplyBody] = useState("");
  const profile = useSelector((state) => state.auth.profile);
  const [replies, setReplies] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const createReplyHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/reply/create-reply`,
        {
          replyBody,
          replyTime: Date.now(),
          onBlogId: blogId,
          replyOwnerId: profile._id,
        },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res) {
        console.log(res);
        setReplyBody("");
      }
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  const deleteReplyHandler = async (replyId) => {
    if (!profile?._id) {
      console.log("can not delete yet");
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/reply/delete-reply`,
        {
          replyId: replyId,
          userId: profile._id,
        },
        { withCredentials: true }
      );
      if (res) {
        console.log(res);
      }
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  useEffect(() => {
    const getBlogDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/blog/get-blog-by-id`, {
          params: { blogId: blogId },
        });
        setBlog(res.data.blog);
        setReplies(res.data.blog.replies);
      } catch (err) {
        console.log(err.response || "something went wrong");
      }
    };
    if (blogId) getBlogDetails();
  }, [blogId, replies]);

  return (
    <div>
      {blog ? (
        <>
          <h1>{blog.blogTitle}</h1>
          <p>{blog.blogBody}</p>
          {/* this is linking to profile of logged in user not on the clicked user */}
          <Link to={`/user/${blog.author?._id}`}>
            <p>
              Author: {blog.author?.firstName} {blog.author?.lastName}
            </p>
          </Link>
        </>
      ) : (
        <p>Loading...</p>
      )}
      {/* div for leaving a reply on this particualr blog */}
      <div>
        <form onSubmit={createReplyHandler}>
          {/* div for blog title */}
          <div>
            <label>reply:</label>
            <input
              className="text-black"
              name="replyBody"
              id="replyBody"
              value={replyBody}
              onChange={(e) => {
                setReplyBody(e.target.value);
              }}
            />
          </div>
          <button type="submit">submit reply!</button>
        </form>
      </div>
      {/* div to show all the replies */}
      <div>
        {replies.map((reply, idx) => {
          return (
            <div key={idx} className="flex gap-4">
              <div>{reply.replyBody}</div>
              <div>{reply.replyOwnerId.firstName}</div>
              <button onClick={() => deleteReplyHandler(reply._id)}>
                delete this reply!
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
