// This code is written by - Asim Husain

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const QuestionBox = ({ question, index }) => {
  const [googleVoice, setGoogleVoice] = useState(null);

  // Load and select "Google US English"
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selected = voices.find((v) => v.name === "Google US English");
      setGoogleVoice(selected || null);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Speak the question aloud
  const speakQuestion = () => {
    const synth = window.speechSynthesis;

    if (synth.speaking) {
      synth.cancel();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "en-US";
    utterance.rate = 1;
    if (googleVoice) {
      utterance.voice = googleVoice;
    }

    synth.speak(utterance);
  };

  return (
    <div className="question-box bg-white shadow-md rounded-xl p-4">
      {/* Question number and speaker icon */}
      <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <strong>Question {index + 1}:</strong>
        <img
          src="/assets/icons/speaker.png"
          alt="Speak"
          onClick={speakQuestion}
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
          title="Click to listen"
        />
      </p>

      {/* Display question content with code syntax */}
      <ReactMarkdown
        children={question}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-200 rounded p-1">{children}</code>
            );
          },
        }}
      />
    </div>
  );
};

export default QuestionBox;