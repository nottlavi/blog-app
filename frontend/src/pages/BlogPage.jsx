import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast, ToastContainer } from "react-toastify";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";

export const BlogPage = () => {
  const { blogId } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [blog, setBlog] = useState({});
  const [replyBody, setReplyBody] = useState("");
  const profile = useSelector((state) => state.auth.profile);
  const [replies, setReplies] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [liked, setLiked] = useState(false);

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

  const likeHandler = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/blog/like-blog`,
        { blogId },
        { withCredentials: true }
      );
      console.log(res);
    } catch (err) {
      console.log(err.response || "something went wrong");
      toast.error(err.response.data.message);
    }
  };

  const disLikeHandler = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/blog/unlike-blog`,
        { blogId },
        { withCredentials: true }
      );
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
        setLiked(res.data.blog.likes.includes(profile._id));
      } catch (err) {
        console.log(err.response || "something went wrong");
      }
    };
    if (blogId) getBlogDetails();
  }, [blogId, replies]);

  return (
    <div className="space-y-8">
      <ToastContainer />
      {blog ? (
        <>
          <h1 className="page-title">{blog.blogTitle}</h1>
          {/* render rich HTML (images, links, etc.) */}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.blogBody || ""),
            }}
          />
          <Link
            to={`/user/${blog.author?._id}`}
            className="text-indigo-400 hover:text-indigo-300"
          >
            <p className="mt-4">Author: {blog.author?.firstName}</p>
          </Link>
          {/* div for likes */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              likes: {blog.likes?.length || 0}
            </span>
            {liked ? (
              <button onClick={disLikeHandler}>
                <BiSolidLike />
              </button>
            ) : (
              <button onClick={likeHandler}><BiLike /></button>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-400">Loading...</p>
      )}
      {/* div for leaving a reply on this particualr blog */}
      <div className="card p-4">
        <form onSubmit={createReplyHandler} className="space-y-3">
          {/* div for blog title */}
          <div>
            <label className="label">reply</label>
            <input
              className="input"
              name="replyBody"
              id="replyBody"
              value={replyBody}
              onChange={(e) => {
                setReplyBody(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="btn-primary">
            Submit reply
          </button>
        </form>
      </div>
      {/* div to show all the replies */}
      <div className="space-y-3">
        {replies.map((reply, idx) => {
          return (
            <div
              key={idx}
              className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="text-gray-100">{reply.replyBody}</div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/user/${reply.replyOwnerId._id}`}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {reply.replyOwnerId.email === profile.email ? (
                    <div>{reply.replyOwnerId.firstName} (you)</div>
                  ) : (
                    <div>{reply.replyOwnerId.firstName}</div>
                  )}
                </Link>
                {reply.replyOwnerId.email === profile.email ? (
                  <button
                    onClick={() => deleteReplyHandler(reply._id)}
                    className="btn-secondary"
                  >
                    Delete
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
