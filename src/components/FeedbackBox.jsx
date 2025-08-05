// This code is written by - Asim Husain

import React from "react";

const FeedbackBox = ({ answer, feedback, score, tone }) => {
  return (
    <div
      className="feedback-box"
      style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}
    >
      <p><strong>Your Answer: </strong> {answer}</p>
      <p><strong>Feedback: </strong> {feedback}</p>
      <p><strong>Accuracy: </strong> {score}%</p>
      <p><strong>Tone: </strong> {tone}</p>
      <hr></hr>
    </div>
  );
};

export default FeedbackBox;