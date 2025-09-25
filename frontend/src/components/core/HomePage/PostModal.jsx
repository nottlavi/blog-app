import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProfile } from "../../../slices/authSlice";
import TextEditor from "../../common/TextEditor";

const PostModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const profile = useSelector((state) => state.auth.profile);
  const dispatch = useDispatch();

  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogBody, setBlogBody] = useState("");
  const [loading, setLoading] = useState(false);

  const createBlogHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/blog/create-blog`,
        {
          blogTitle,
          createdAt: Date.now(),
          author: profile._id,
          blogDescription,
          blogBody,
        },
        { withCredentials: true }
      );
      if (res) {
        setBlogTitle("");
        setBlogBody("");
        setBlogDescription("");
        fetchBlogsByUser();
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log("something went wrong");
      }
    }
  };

  const fetchBlogsByUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
      });
      if (res?.data?.data) {
        dispatch(setProfile(res.data.data));
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log("something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToServer = async (file) => {
    const fd = new FormData();
    fd.append("image", file); // field name must be "image" (matches backend)
    const res = await axios.post(`${BASE_URL}/blog/image`, fd, {
      withCredentials: true,
      // Do NOT set 'Content-Type' manually; browser sets multipart boundary.
    });
    return res.data.imageUrl;
  };

  return (
    <>
      <Button onClick={onOpen}>Post!</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="space-y-3" >
              <div className="text-sm uppercase tracking-wide text-gray-400">
                create a blog
              </div>
              <form onSubmit={createBlogHandler} className="card p-6 space-y-4">
                {/* div for blogTitle */}
                <div>
                  <label htmlFor="blogTitle" className="label">
                    blog title
                  </label>
                  <input
                    className="input"
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
                  <label htmlFor="blogDescription" className="label">
                    blog description
                  </label>
                  <input
                    className="input"
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
                {/* div for blogBody (supports inline image upload) */}
                <TextEditor
                  value={blogBody}
                  onChange={(newValue) => setBlogBody(newValue)}
                  uploadImageToServer={uploadImageToServer}
                />
                <button type="submit" className="btn-primary" onClick={onClose}>
                  Publish
                </button>
              </form>
            </div>
          </ModalBody>

       
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostModal;
