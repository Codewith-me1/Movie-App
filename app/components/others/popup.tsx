"use client";

import { useState, useEffect } from "react";

interface PopupMessageProps {
  message: string;
  duration?: number; // Duration in milliseconds
}

const PopupMessage = ({ message, duration = 2000 }: PopupMessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    visible && (
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "15px 30px",
          backgroundColor: "black",
          color: "white",
          borderRadius: "5px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        {message}
      </div>
    )
  );
};

export default PopupMessage;
