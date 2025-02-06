"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { getBaseURL } from "../others/baseUrl";
import PopupMessage from "../others/popup"; // Import the PopupMessage component

interface Props {
  type: string;
  id: string;
}

const ShareComponent = ({ type, id }: Props) => {
  const baseUrl = getBaseURL();
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = async () => {
    const url = `${baseUrl}/${type}/${id}`;
    try {
      await navigator.clipboard.writeText(url);

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);

      // Show the popup message
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          handleClick();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <Share2 />
      </button>

      {showPopup && (
        <PopupMessage
          message="Copied to Clipboard!"
          duration={2000} // Message disappears after 2 seconds
        />
      )}
    </div>
  );
};

export default ShareComponent;
