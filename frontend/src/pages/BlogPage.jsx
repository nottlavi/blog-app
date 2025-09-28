import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast, ToastContainer } from "react-toastify";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { LoadingPage } from "../pages/LoadingPage";

export const BlogPage = () => {
  const { blogId } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [blog, setBlog] = useState({});
  //this state is for managing the input field for a reply
  const [replyBody, setReplyBody] = useState("");
  const profile = useSelector((state) => state.auth.profile);
  //this state is for setting the replies on a blog, the data is fetched from backend
  const [replies, setReplies] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nesReplies, setNestedReplies] = useState([]);
  const [nestedReplyBody, setNestedReplyBody] = useState("");
  const [likeCount, setLikeCount] = useState(0);

  const navigate = useNavigate();

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
        setReplies((prevReplies) => [res.data.data, ...prevReplies]);
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
        getBlogDetails();
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
      setLiked(true);
      setLikeCount((prev) => prev + 1);
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
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/blog/delete-blog`, {
        withCredentials: true,
        data: { blogId },
      });
      console.log(res);
      navigate("/");
      return;
    } catch (err) {
      console.log(err);
    }
  };

  const handleNestedReply = async (replyId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/reply/create-nested`,
        {
          replyId: replyId,
          replyBody: nestedReplyBody,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      getReplyDetails(res.data.data.onReplyId);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getReplyDetails = async (replyId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/reply/get-reply-details/${replyId}`
      );
      console.log(res);
      setNestedReplies(res.data.data.replies);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getBlogDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/blog/get-blog-by-id`, {
        params: { blogId: blogId },
      });
      setBlog(res.data.blog);
      setReplies(res.data.blog.replies);
      console.log("likes from backend:", res?.data?.blog?.likes.toString());
      console.log("profile id:", profile?._id);
      setLiked(
        res?.data?.blog?.likes?.map(String).includes(String(profile?._id))
      );
      console.log(
        "printing if liked or not",
        res?.data?.blog?.likes?.includes(profile?._id)
      );
      setLikeCount(res.data.blog.likes.length);
    } catch (err) {
      console.log(err.response || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?._id) {
      console.log("we are reaching here, yes");
      getBlogDetails();
    }
  }, [profile?._id]);

  return (
    <div className="space-y-8">
      <ToastContainer />
      {loading ? (
        <LoadingPage />
      ) : blog ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="page-title">{blog.blogTitle}</h1>
            {blog.author?._id === profile._id ? (
              <button className="btn-secondary" onClick={deletePostHandler}>
                Delete post
              </button>
            ) : (
              <div> </div>
            )}
          </div>
          {/* render rich HTML (images, links, etc.) */}
          <div
            className="content-body"
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
            {liked ? (
              <button
                onClick={disLikeHandler}
                className=""
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <BiSolidLike />
                </span>
              </button>
            ) : (
              <button
                onClick={likeHandler}
                className=""
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <BiLike />
                </span>
              </button>
            )}
            <span className="text-sm text-gray-400">{likeCount || 0}</span>
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
                {/* div for input and label for nested reply */}
                <div>
                  <label htmlFor="nestedReply">enter reply</label>
                  <input
                    name="nestedReply"
                    id="nestedReply"
                    value={nestedReplyBody}
                    onChange={(e) => {
                      setNestedReplyBody(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleNestedReply(reply._id);
                    }}
                  >
                    submit
                  </button>
                </div>
                {/* icon/button/option to show all the nested replies on this reply */}
                <div>
                  <button
                    onClick={() => {
                      getReplyDetails(reply._id);
                    }}
                  >
                    fetch replies!
                  </button>
                </div>
                {/* i will be showing all the nestedReplies here */}
                <div>
                  {nesReplies.map((nestedReply, idx) => {
                    return <div key={idx}>{nestedReply.replyBody}</div>;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
