import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProfile } from "../../../slices/authSlice";
import { Link } from "react-router-dom";

export const OtherProfile = () => {
  const { userId } = useParams();
  const followedId = userId;
  const [tempProfile, setTempProfile] = useState({});
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);

  const [isFollowing, setIsFollowing] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [toDisplay, setToDisplay] = useState("Blogs");
  const [arrayToShow, setArrayToShow] = useState([]);

  useEffect(() => {
    refetchCurrentUserProfile();
  }, [userId]);

  useEffect(() => {
    setIsFollowing(tempProfile.followers?.includes(profile._id));
  }, [tempProfile, profile]);

  const followHandler = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/follow-user`,
        { followedId },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setIsFollowing(true);
      refetchCurrentUserProfile();
    } catch (err) {
      if (err.response) {
        console.log(err.response || "something went wrong");
      }
    }
  };

  const unFollowHandler = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/unfollow-user`,
        { followedId },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setIsFollowing(false);
      refetchCurrentUserProfile(false);
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  const refetchCurrentUserProfile = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/get-user-by-id`,
        { userId },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setTempProfile(res.data.data);
    } catch (err) {
      console.log(err.response || "something went wrong");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/user/get-user-by-id`, {
          userId,
        });
        if (res) {
          setTempProfile(res.data.data);
        }
      } catch (err) {
        console.log(err.response || "something went wrong");
      }
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const getDataByType = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/user/get-by-query/${userId}/${toDisplay}`,
          { withCredentials: true }
        );
        console.log(res);
        setArrayToShow(res.data.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getDataByType();
  }, [toDisplay]);

  return (
    <div className="card p-6 space-y-4">
      <div className="text-lg font-medium">
        {tempProfile.firstName} {tempProfile.lastName}
      </div>
      <div className="text-gray-400">
        followers: {tempProfile.followers?.length}
      </div>
      {isFollowing ? (
        <button onClick={unFollowHandler} className="btn-secondary">
          Unfollow
        </button>
      ) : (
        <button onClick={followHandler} className="btn-primary">
          Follow
        </button>
      )}

      <div className="flex justify-between">
        <div
          onClick={() => {
            setToDisplay("Blogs");
          }}
          className="cursor-pointer"
        >
          blogs
        </div>
        <div
          onClick={() => {
            setToDisplay("Likes");
          }}
          className="cursor-pointer"
        >
          likes
        </div>
        <div
          onClick={() => {
            setToDisplay("Replies");
          }}
          className="cursor-pointer"
        >
          replies
        </div>
      </div>
      {/* div to show selected category */}
      {/* handling cases when user has no activity in selected category */}
      {toDisplay === "Blogs" && arrayToShow.length === 0 && (
        <div>post sm maboi</div>
      )}
      {toDisplay === "Likes" && arrayToShow.length === 0 && (
        <div> show some thumbs</div>
      )}
      {toDisplay === "Replies" && arrayToShow.length === 0 && (
        <div> Reply sm</div>
      )}
      {toDisplay === "Replies" &&
        arrayToShow.length !== 0 &&
        arrayToShow.map((ele, idx) => (
          <Link to={`/blog/${ele.onBlogId}`}>
            <div key={idx}>{ele.replyBody}</div>
          </Link>
        ))}
      {toDisplay === "Blogs" &&
        arrayToShow.length !== 0 &&
        arrayToShow.map((ele, idx) => (
          <Link key={idx} to={`/blog/${ele._id}`}>
            <div>{ele.blogTitle}</div>
          </Link>
        ))}
      {toDisplay === "Likes" &&
        arrayToShow.length !== 0 &&
        arrayToShow.map((ele, idx) => <div key={idx}>{ele.blogTitle}</div>)}
    </div>
  );
};
