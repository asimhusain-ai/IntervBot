// This code is written by - Asim Husain

// Fetch Interview Questions
export const fetchInterviewQuestion = async (role = "Technical", difficulty = "Easy") => {
  try {
    let model;

    if (role === "Technical" && difficulty === "Hard") {
      model = "openai/gpt-3.5-turbo";
    } else {
      model = "anthropic/claude-3-haiku";
    }

    const isCodeQuestion = role === "Technical" ? Math.random() < 0.5 : false;

    const rolePrompts = {
      Technical: isCodeQuestion
        ? `You are acting as a professional **technical interviewer**.
Your task is to ask exactly ONE **code-based programming interview question** related to software development, algorithms, or data structures.
✅ The question MUST involve writing, analyzing, or reasoning about code  
✅ Include a complete and properly formatted \`\`\`code block\`\`\` using **Python**, **JavaScript**, or any relevant language  
✅ The code block must contain ONLY code — ❌ do NOT include any inline comments or explanations  
✅ The question must end with a clear task like:  
  - "What will be the output?"  
  - "Fix the bug"  
  - "Implement this logic"  
  - "Optimize this function"

❌ Do NOT include comments in the code  
❌ Do NOT ask purely theoretical questions`
        : `You are acting as a professional **technical interviewer**.
Your task is to ask exactly ONE **theoretical interview question** related to software engineering, system design, or software architecture.

✅ The question MUST test conceptual understanding, reasoning, or explanation skills  
✅ It should be clear, self-contained, and relevant to modern development practices  
✅ Do NOT include code snippets

Examples:  
- What is the difference between multithreading and multiprocessing?  
- How does a hash table work internally?  
- Explain the CAP theorem in distributed systems.  
- What is the difference between REST and GraphQL?`,

      HR: `You are acting as a professional **HR interviewer**. Ask exactly **one** complete and self-contained **HR interview question** related to communication, behavior, strengths/weaknesses, or situational judgement.`,

      Aptitude: difficulty === "Easy"
        ? `You are acting as a professional **aptitude test interviewer**.
Ask exactly **one complete aptitude question** suitable for beginners.

✅ Question must be clear, self-contained, and at least 15 words long  
✅ Use full sentence format, not short "Sequence: 2, 4, ?" type prompts  
✅ Focus on simple logic, basic arithmetic, or pattern recognition  

Examples:  
- "What is the next number in the sequence: 3, 6, 9, 12, 15, ?"  
- "If a pen costs Rs. 20, how many pens can you buy for Rs. 120?"  
- "A train travels 60 km in 1.5 hours. What is its average speed?"

❌ Do not give code, technical terms, or explanations  
❌ Do not return broken phrases or incomplete sequences  

Return exactly ONE question, and nothing else. End with a question mark.`
        : `You are acting as a professional **aptitude test interviewer**.
Ask exactly **one** clear, self-contained **logical or numerical aptitude question**.

✅ The question must involve:  
- Pattern recognition  
- Arithmetic  
- Sequences  
- Logic puzzles  
- Word problems  
- Quantitative reasoning  

✅ Make the question fully complete — do NOT assume any context  
✅ It should be solvable mentally or with pen & paper  
✅ Follow the difficulty strictly: "Easy", "Medium", or "Hard"  
✅ The question must end with a clear ask like:  
  - "What is the next number?"  
  - "Which option is correct?"  
  - "What should replace the question mark?"

❌ Do NOT include programming, code, or data structures  
❌ Avoid short or unclear questions like "Sequence: 2, 4, ?"  
❌ Do not return duplicate or repeated prompts  
❌ Do NOT include hints, explanations, or answers

✅ Example of GOOD questions:  
- What is the next number in the series: 2, 6, 12, 20, 30, ?  
- If the cost of 5 pencils and 3 pens is ₹90, and each pencil costs ₹8, what is the cost of one pen?  
- If A is twice as fast as B, and A takes 20 minutes to complete a task, how long would B take to complete the same task?

Return only the complete question, ending with a single question mark. Do NOT prefix anything like "Sure" or "Here's your question".`,
    };

    const rolePrompt = rolePrompts[role] || rolePrompts["Technical"];

    const fullPrompt = `${rolePrompt}

You must generate exactly ONE interview question.  
Difficulty level must be strictly "${difficulty}" — Easy, Medium, or Hard.

🟢 REQUIREMENTS:  
- The question must be complete and understandable on its own  
- If the question contains code, wrap it inside valid \`\`\`language blocks\`\`\`  
- Return **only** the question. NO explanation, no commentary, no headings  
- Do NOT break into multiple questions or mixed content  
- Avoid phrases like "Here's your question", "Sure!", or "Answer this:"

🚫 Forbidden:  
- Incomplete questions  
- Multiple questions joined  
- Answer, hints, or explanation

✅ Examples of valid format:  
Q: What is the difference between a stack and a queue?  
Q: Write a Python function that returns the second largest number in a BST. Use O(log n) time.  
Q: Given an array, return the maximum product from any three integers in O(n) time.

Only return such a complete question.  
Make sure the question ends with a '?' and nothing else.`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "interviewer",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: fullPrompt },
          { role: "user", content: "Ask me one interview question." },
        ],
        temperature: 0.85,
        max_tokens: 1024,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.choices || !data.choices[0]?.message?.content) {
      console.error("OpenRouter API error:", data);
      return "Loading...";
    }

    let raw = data.choices[0].message.content.trim();

    raw = raw
      .replace(/^.*?(?:\*{1,2}question\*{1,2}|question|q)\s*[:–—-]?\s*/i, "")
      .replace(/^sure[.,:!?]*\s*/i, "")
      .replace(/^here('|’)s.*?:\s*/i, "")
      .replace(/^[\-\*\d.]+\s*/, "")
      .replace(/^\s*Q[:\-–—]?\s*/i, "")
      .trim();

    const isValid = raw.length > 20 && raw.endsWith("?") && !raw.includes("...");

    if (!isValid) {
      console.warn("Invalid/incomplete question received:", raw);
      return "Loading...";
    }

    return raw;
  } catch (err) {
    console.error("Fetch failed:", err);
    return "Loading...";
  }
};

// ✅ Batch fetch: fetch N unique questions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchUniqueInterviewQuestions = async (count, role, difficulty) => {
  const seen = new Set();
  const questions = [];

  let retries = 0;
  const MAX_RETRIES = count * 4;

  while (questions.length < count && retries < MAX_RETRIES) {
    const q = await fetchInterviewQuestion(role, difficulty);
    const normalized = q.toLowerCase().replace(/\s+/g, " ").trim();

    if (!seen.has(normalized)) {
      seen.add(normalized);
      questions.push(q);
    } else {
      retries++;
      await delay(150);
    }
  }

  if (questions.length < count) {
    console.warn(`Only generated ${questions.length} unique questions out of ${count}`);
  }

  return questions;
};