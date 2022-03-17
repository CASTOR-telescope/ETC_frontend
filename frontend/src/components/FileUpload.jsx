/**
 * FileUpload.jsx
 *
 * From <https://codesandbox.io/s/h2tbx>. May be useful in future?
 */

import { useState, useRef } from "react";
import { Button } from "./Button";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const inputFile = useRef(null);

  const handleFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      let parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      console.log("fileType: ", fileType); //ex: zip, rar, jpg, svg etc.

      setFile(files[0]);
    }
  };

  const handleClick = () => {
    inputFile.current.click();
  };

  console.log("file: ", file);
  return (
    <div>
      <input
        style={{ display: "none" }}
        // accept=".zip,.rar"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      <Button onClick={handleClick}>Upload</Button>
    </div>
  );
};

export default FileUpload;
