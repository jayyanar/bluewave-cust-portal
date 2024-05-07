import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import config from "./amplifyconfiguration.json";
import { uploadData } from "aws-amplify/storage";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

// Configure Amplify
Amplify.configure(config);

function App({ signOut, user }) {
  const [fileData, setFileData] = useState(null);
  const [fileUploadStatus, setFileUploadStatus] = useState(false);

  // Function to handle file upload
  const uploadFile = async () => {
    try {
      const result = await uploadData({
        key: fileData.name,
        data: fileData,
      }).result;
      setFileUploadStatus(true);
      const fileInput = document.querySelector(".file-input");
      if (fileInput) {
        fileInput.value = "";
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wave">
      <img src="src/Logo1.jpg" alt="Bluewave Holidays Logo" />
      <div className="App">
        <h1>Welcome to Bluewave Customer Portal</h1>
        <hr />
        <button className="sign-out-btn" onClick={signOut}>
          Sign out
        </button>
        <div className="file-input-container">
          <div className="file-input-icon">Choose File</div>
          <input
            type="file"
            className="file-input"
            onChange={(e) => setFileData(e.target.files[0])}
          />
        </div>
        <div>
          <button className="file-upload-btn" onClick={uploadFile}>
            Upload
          </button>
        </div>
        <div className="upload-status">
          {fileUploadStatus && `${fileData.name} was uploaded successfully`}
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
