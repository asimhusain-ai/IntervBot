// This code is written by - Asim Husain

import React from "react";

// MicInput component 
const MicInput = ({ onUserAnswer }) => {
  // Start speech recognition and handle result
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      onUserAnswer(speech);
    };

    recognition.onerror = () => {
      alert("Mic error. Try again.");
    };
  };

  return (
    <button onClick={startListening} className="mic-btn">
      Speak Answer
    </button>
  );
};

export default MicInput;