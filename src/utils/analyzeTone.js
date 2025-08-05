import Sentiment from "sentiment";

export const analyzeTone = (text) => {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);

  const lowerText = text.toLowerCase();

  // Check for weak/no answer phrases
  const weakPhrases = [
    "pata nahi",
    "nahi pata",
    "nahi aata",
    "idk",
    "i don't know",
    "no idea",
    "skip",
    "pass",
    "not sure",
    "can't say",
    "don't know",
    "mujhe nahi pata",
    "kya bolu",
    "kaise bataun",
    "bhool gaya",
    "yaad nahi",
    "confused",
    "sorry",
    "nahi",
    "zero knowledge",
    "?"
  ];

  const isWeak = weakPhrases.some((phrase) => lowerText.includes(phrase)) || lowerText.trim().length < 5;

  if (isWeak) {
    return {
      score: "0%",
      tone: "Missing or Weak",
      feedback: "You didn't provide a valid answer. Please try to attempt every question seriously.",
    };
  }

  // Calculate accuracy % based on sentiment score
  let scorePercent = 0;
  if (result.score > 3) scorePercent = 90;
  else if (result.score > 1) scorePercent = 70;
  else if (result.score >= 0.5) scorePercent = 50;
  else if (result.score >= 0) scorePercent = 30;
  else if (result.score > -2) scorePercent = 10;
  else scorePercent = 0;

  // Tone & Feedback
  let tone = "";
  let feedback = "";

  if (result.score > 3) {
    tone = "Confident & Positive";
    feedback = "Excellent tone! You sound sure and enthusiastic.";
  } else if (result.score >= 1) {
    tone = "Neutral";
    feedback = "Good effort. Try including specific examples.";
  } else if (result.score >= -1) {
    tone = "Slightly Nervous";
    feedback = "Answer is okay, but could use more clarity and confidence.";
  } else {
    tone = "Negative or Weak";
    feedback = "Try to avoid uncertainty or negative language.";
  }

  return {
    score: `${scorePercent}%`,
    tone,
    feedback,
  };
};
