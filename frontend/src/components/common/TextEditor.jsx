// frontend/src/components/common/TextEditor.jsx

import React, { useRef, useState, useCallback, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const RichTextEditor = ({ value, onChange, uploadImageToServer }) => {
  const quillRef = useRef(null);
  const [editorValue, setEditorValue] = useState(value || "");

  // image handler: triggered when user clicks toolbar image button
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (file) {
        try {
          // uploadImageToServer should return a URL of uploaded image
          const url = await uploadImageToServer(file);
          const editor = quillRef.current?.getEditor();
          const range = editor?.getSelection(true);
          if (range) {
            // insert the image in the editor at cursor
            editor.insertEmbed(range.index, "image", url);
            // move cursor after image
            editor.setSelection(range.index + 1);
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }
    };
  }, [uploadImageToServer]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "link",
      "image",
    ],
    []
  );

  const handleChange = (newValue) => {
    setEditorValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing..."
      />
    </div>
  );
};

export default RichTextEditor;
