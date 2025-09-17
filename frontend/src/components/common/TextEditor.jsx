import React, { useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css"; // Import the styles

const RichTextEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  // Define what tools appear in the toolbar
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"], // This enables the image tool
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your story..."
      />
    </div>
  );
};

export default RichTextEditor;
