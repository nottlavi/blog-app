import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
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

export const SelfProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [preview, setPreview] = useState(null);

  // //this will be be used to display info of the current profile being viewed by some other user, no to decide whether to keep this part
  // const {userId} = useParams();
  // console.log(userId);

  //looading imp info from redux, this profile will be used to update the details
  const profile = useSelector((state) => state.auth.profile);

  //need to decide whether to keep this effect or not, for now i wont keep it
  // useEffect(() => {
  //   const getProfile = async () => {
  //     try {
  //       const res = await axios.post(
  //         `${BASE_URL}/user/profile`,
  //         {
  //           userId: profile._id,
  //         },
  //         { withCredentials: true }
  //       );
  //       // console.log(res)
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   };
  //   getProfile();
  // }, [profile]);

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
              <input type="email" id="email" name="email" />

              <label htmlFor="firstName">First Name:</label>
              <input type="text" id="firstName" name="firstName" />

              <label htmlFor="lastName">Last Name:</label>
              <input type="text" id="lastName" name="lastName" />

              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" />

              <img src={preview || profile.profilePic} />
              <button type="button" onClick={() => fileRef.current.click()}>
                change avatar
              </button>
              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              ></input>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
