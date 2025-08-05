// This code is written by - Asim Husain

import React, { useState } from "react";

const LandingCard = ({ role, setRole, limit, setLimit, difficulty, setDifficulty, onStart }) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleLimitChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/^0+(?=\d)/, '');
    const numeric = cleaned === '' ? '' : Number(cleaned);
    setLimit(numeric);

    if (numeric >= 1 && numeric <= 100) {
      setLimit(numeric);
      setShowWarning(false);
    } else {
      setLimit(numeric);
    }
  };

  // Validate inputs and trigger interview start
  const handleStart = () => {
    if (!limit || limit < 1 || limit > 100) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    onStart();
  };

  return (
    <div className="landing-card">
      <div className="landing-controls">

        {/* Role selection dropdown */}
        <label>
          <strong>Role</strong>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Technical">Technical</option>
            <option value="HR">HR</option>
            <option value="Aptitude">Aptitude</option>
          </select>
        </label>

        {/* Question limit input */}
        <label>
          <strong>Questions</strong>
          <input
            type="number"
            min="1"
            max="100"
            value={limit}
            onChange={handleLimitChange}
            placeholder="Enter number"
          />
          {/* Warning if invalid number */}
          {showWarning && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
              ⚠️ Inavalid Question
            </div>
          )}
        </label>

        {/* Difficulty level selection */}
        <label>
          <strong>Difficulty</strong>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Beginner</option>
            <option value="Medium">Intermediate</option>
            <option value="Hard">Professional</option>
          </select>
        </label>

      </div>

      {/* Start interview button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="mic-btn" onClick={handleStart}>
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default LandingCard;