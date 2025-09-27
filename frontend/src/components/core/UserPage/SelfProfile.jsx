import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { setProfile } from "../../../slices/authSlice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";

export const SelfProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  // //this will be be used to display info of the current profile being viewed by some other user, no to decide whether to keep this part
  // const {userId} = useParams();
  // console.log(userId);

  //looading imp info from redux, this profile will be used to update the details
  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);

  const [email, setEmail] = useState(profile.email || "");
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(profile.profilePic || "");
  const [toDisplay, setToDisplay] = useState("Blogs");
  const [arrayToShow, setArrayToShow] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/update-profile`,
        {
          email,
          firstName,
          lastName,
          password,
          profilePic,
        },
        {
          withCredentials: true,
        }
      );

      getProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const getProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setEmail(res.data.data.email || "");
      setFirstName(res.data.data.firstName || "");
      setLastName(res.data.data.lastName || "");
      setPassword(""); // never set from backend if sensitive
      setProfilePic(res.data.data.profilePic || "");

      dispatch(setProfile(res.data.data));
      localStorage.setItem("profile", JSON.stringify(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const getDataByType = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/user/get-by-query/${profile._id}/${toDisplay}`,
          { withCredentials: true }
        );
        console.log(res);
        setArrayToShow(res.data.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    getDataByType();
  }, [toDisplay]);

  return (
    <div className="space-y-4">
      <div className="card p-6 flex items-center gap-4">
        <img
          src={profile.profilePic}
          alt={profile.firstName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <div className="text-lg font-medium">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-gray-400 text-sm">{profile.email}</div>
        </div>
        <div className="ml-auto">
          <Button onClick={onOpen}>Update Profile</Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="firstName" className="label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="input"
                />
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={preview || profile.profilePic}
                  className="rounded-full w-20 h-20 object-cover"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className="btn-secondary"
                  >
                    Change avatar
                  </button>
                  {preview ? (
                    <button
                      onClick={() => {
                        setPreview(null);
                      }}
                      type="button"
                      className="btn-secondary"
                    >
                      Remove selected
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                    setProfilePic(URL.createObjectURL(file));
                  }
                }}
              ></input>
            </form>
          </ModalBody>

          <ModalFooter onClick={onClose}>
            <Button variant="ghost" onClick={handleUpdate}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex justify-between">
        <div
          onClick={() => {
            setToDisplay("Blogs");
          }}
          className="cursor-pointer"
        >
          your blogs
        </div>
        <div
          onClick={() => {
            setToDisplay("Likes");
          }}
          className="cursor-pointer"
        >
          your likes
        </div>
        <div
          onClick={() => {
            setToDisplay("Replies");
          }}
          className="cursor-pointer"
        >
          your replies
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
