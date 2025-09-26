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

  return (
    <div className=" p-6 flex flex-col">
      hello {profile.firstName}
      <Button onClick={onOpen}>Update Profile</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="flex flex-col">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />

              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <img
                src={preview || profile.profilePic}
                className="rounded-full w-32 h-32"
              />
              <button type="button" onClick={() => fileRef.current.click()}>
                change avatar
              </button>
              {preview ? (
                <button
                  onClick={() => {
                    setPreview(null);
                  }}
                  type="button"
                >
                  delete selected profile pic
                </button>
              ) : (
                <div></div>
              )}
              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                    setProfilePic(URL.createObjectURL(file))
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
    </div>
  );
};
