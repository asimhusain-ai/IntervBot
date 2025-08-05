import axios from 'axios';

export const evaluateAnswer = async (question, answer) => {
  const prompt = `
You are a strict technical interview evaluator. Compare the candidate's answer **semantically** with the question.

Rules:
- If the answer is wrong or completely unrelated, give a score of 0.
- If the answer is partially correct, give 10 to 60.
- If the answer is mostly correct and on-topic, give 70 to 90.
- If the answer is correct, complete, and confidently stated, give 95 to 100.

Return this JSON format ONLY:

{
  "score": number from 0 to 100,
  "tone": "short tone summary",
  "feedback": "brief 1-2 line comment on the answer quality",
  "expected_answer": "a model answer or ideal expected content for the question"
}

Question: """${question}"""

Answer: """${answer}"""
`;

  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  try {
    const text = res.data.choices[0].message.content.trim();
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse evaluation response:', err);
    return {
      score: 0,
      tone: 'Error',
      feedback: 'Could not parse evaluation response.',
      expected_answer: 'N/A',
    };
  }
};
