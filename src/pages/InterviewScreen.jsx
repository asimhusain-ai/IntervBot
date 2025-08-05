// This code is written by - Asim Husain

import React, { useState, useEffect, useRef } from "react";
import { fetchInterviewQuestion } from "../services/gptService";
import { evaluateAnswer } from "../utils/evaluateAnswer";
import LandingCard from "../components/LandingCard";
import QuestionBox from "../components/QuestionBox";
import FeedbackBox from "../components/FeedbackBox";
import Header from "../components/Header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const InterviewScreen = () => {
  // UI and state management
  const [showAnswerWarning, setShowAnswerWarning] = useState(false);
  const [scores, setScores] = useState([]);
  const [tones, setTones] = useState([]);
  const [expectedAnswers, setExpectedAnswers] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [started, setStarted] = useState(false);
  const [role, setRole] = useState("Technical");
  const [limit, setLimit] = useState(1);
  const [difficulty, setDifficulty] = useState("Easy");

  // Question/Answer tracking
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  // Calculate average score from all responses
  const getAverageScore = () => {
    if (!scores.length) return 0;
    const total = scores.reduce(
      (sum, s) => sum + (typeof s === "number" ? s : parseFloat(s)),
      0
    );
    return Math.round(total / scores.length);
  };

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch one valid interview question
  const fetchNewQuestion = async () => {
    setLoading(true);
    try {
      let q;
      let attempts = 0;
      do {
        q = await fetchInterviewQuestion(role, difficulty);
        attempts++;
      } while ((!q || q.length < 20 || !q.includes("?")) && attempts < 5);

      if (!q || q.length < 20 || !q.includes("?")) {
        console.warn("Failed to fetch a valid question after multiple attempts.");
        return "Sorry, failed to load a complete question. Please try again.";
      } else {
        return q;
      }
    } catch (e) {
      console.error("Error fetching question:", e);
      return "Error loading question.";
    } finally {
      setLoading(false);
    }
  };

  // Start interview session
  const handleStart = async () => {
    setStarted(true);
    setQuestions([]);
    setAnswers([]);
    setFeedbacks([]);
    setScores([]);
    setTones([]);
    setExpectedAnswers([]);
    setQuestionIndex(0);
    setCurrentAnswer("");
    finalTranscriptRef.current = "";

    const firstQ = await fetchNewQuestion();
    setQuestions([firstQ]);
  };

  // Stop mic input
  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // Submit current answer and evaluate it
  const handleSubmit = async () => {
    stopMic();

    if (!currentAnswer.trim()) {
      setShowAnswerWarning(true);
      return;
    }

    setIsSubmitting(true);
    const userAnswer = currentAnswer;
    const question = questions[questionIndex];

    try {
      const evaluation = await evaluateAnswer(question, userAnswer);

      setAnswers((prev) => [...prev, userAnswer]);
      setFeedbacks((prev) => [...prev, evaluation.feedback]);
      setScores((prev) => [...prev, evaluation.score]);
      setTones((prev) => [...prev, evaluation.tone]);
      setExpectedAnswers((prev) => [...prev, evaluation.expected_answer]);

      setCurrentAnswer("");
      finalTranscriptRef.current = "";

      if (questionIndex + 1 < limit) {
        const nextQ = await fetchNewQuestion();
        setQuestions((prev) => [...prev, nextQ]);
        setQuestionIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error during submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice input logic
  const handleStartListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentAnswer(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (e) => {
      alert("Mic Error: " + e.error);
    };

    recognition.start();
  };

  const isInterviewComplete = answers.length === limit;

  // Render splash screen
  if (showSplash) {
    return (
      <div className="splash-screen">
        <h1 className="splash-text">Welcome To Interview</h1>
      </div>
    );
  }

  return (
    <>
      {started && !isInterviewComplete && (
        <button
          className="back-button"
          onClick={() => {
            stopMic();
            setStarted(false);
          }}
          title="Go back"
        >
          <img src="/assets/icons/back.png" alt="Back" className="back-icon-img" />
        </button>
      )}

      {!started && <Header />}

      {/* Show landing screen before interview starts */}
      {!started ? (
        <LandingCard
          role={role}
          setRole={setRole}
          limit={limit}
          setLimit={setLimit}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onStart={handleStart}
        />
      ) : !isInterviewComplete ? (
        <>
          {/* Question and answer input */}
          <QuestionBox
            question={questions[questionIndex] || "Loading..."}
            index={questionIndex}
          />

          <div className="answer-input-wrapper">
            <textarea
              className="answer-box"
              value={currentAnswer}
              onChange={(e) => {
                const text = e.target.value;
                setCurrentAnswer(text);
                finalTranscriptRef.current = text;
                if (text.trim() !== "") setShowAnswerWarning(false);
              }}
              placeholder="Type Answer or Use Mic.."
              style={{ color: "black", caretColor: "black" }}
            />

            {showAnswerWarning && (
              <div style={{ color: "red", marginTop: "6px", fontSize: "14px" }}>
                ⚠️ Please Answer the Question
              </div>
            )}

            <button className="mic-icon-btn" onClick={handleStartListening}>
              <img src="/assets/icons/mic.png" alt="Mic" />
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className="mic-btn"
              onClick={async () => {
                if (!currentAnswer.trim()) {
                  setShowAnswerWarning(true);
                  return;
                }
                await handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Analyzing"
                : limit === 1 || questionIndex + 1 === limit
                ? "Submit"
                : "Next Question"}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Final feedback summary */}
          <h2 className="feedback-heading">Result Analysis</h2>
          {questions.map((q, i) => (
            <div key={i} className="feedback-box">
              <div style={{ marginBottom: "10px" }}>
                <strong>Q{i + 1}:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{q}</ReactMarkdown>
              </div>

              <p style={{ marginBottom: "5px" }}>
                <strong>Expected Answer:</strong> {expectedAnswers[i] || "N/A"}
              </p>

              <FeedbackBox
                answer={answers[i]}
                feedback={feedbacks[i]}
                score={scores[i]}
                tone={tones[i]}
              />
            </div>
          ))}

          {/* Overall summary */}
          <div className="feedback-box" style={{ background: "transparent" }}>
            <h3 style={{ marginBottom: "8px" }}>Overall Result</h3>
            <p>
              <strong>Overall Accuracy Score:</strong> {getAverageScore()}%
            </p>
          </div>

          <button className="mic-btn" onClick={() => setStarted(false)}>
            Start Again
          </button>
        </>
      )}
    </>
  );
};

export default InterviewScreen;