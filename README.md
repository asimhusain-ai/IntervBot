## Virtual Interviewer-
A smart, AI-powered chatbot built to help users practice interview questions in a personalized way. It generates questions based on selected **roles** (like Technical or HR) and **difficulty levels** (Easy, Medium, Hard) using OpenRouter’s powerful AI models like GPT-3.5 and Claude-3.
Built entirely with **React**, this app is fast, responsive, and designed to give a near real-interview experience — without needing a human interviewer.

## What’s This Project About?-
The idea behind Virtual Interviewer is simple: use AI to make interview practice smarter, easier, and more flexible.
Instead of preparing from static question sets, users get fresh, dynamic questions generated on the fly based on what they want to practice — all thanks to OpenRouter's access to cutting-edge models.
Whether you're brushing up on technical questions or preparing for HR rounds, this app gives you a virtual interviewer right in your browser.


## Live Demo
Checkout App on Vercel - https://intervbot.vercel.app

## Key Features
- Role and difficulty-based question generation  
- Supports multiple AI models (GPT-3.5, Claude-3)  
- Clean, fast, and responsive UI  
- Works seamlessly in the browser  
- Uses OpenRouter API with a free key for open access

## A Note on the API
The project currently uses a **free OpenRouter API key**, which makes it accessible for everyone — but it does come with a few trade-offs:
- Occasionally, questions may be incomplete or not very accurate  
- Some responses may be delayed or slightly inconsistent  
To get the best performance, you can replace it with your own API key if you have one.

## Tech Stack
| Area          | Tools / Libraries             |
|---------------|-------------------------------|
| Frontend      | React (Vite), JavaScript      |
| Styling       | CSS, Flexbox                  |
| AI & Backend  | OpenRouter API (GPT/Claude)   |
| Hosting       | Vercel                        |
| Build Tools   | Node.js, npm                  |
| Deployment    | GitHub + Vercel CI/CD         |

## Challenges Faced
1. Working with the free OpenRouter plan was tricky. Sometimes the API would return broken or empty responses. I had to implement loading states, error fallback logic, and a better UX to handle these cases gracefully.
2. I wanted different AI models for different use cases — like Claude for general or HR questions, and GPT-3.5 for tougher technical ones. Writing logic to switch models dynamically without breaking the UI flow was a fun      challenge.
3. When I experimented with converting the web app to an Android APK (PWA), the app would show a white screen on the first launch. Turns out, service workers and asset paths needed fine-tuning.
4. Making sure everything looked and worked well across mobile, tablet, and desktop screens took a lot of manual tweaking. But the end result feels clean and polished.
5. During development, CORS errors were frequent, especially when switching between local and deployed environments. Environment variables needed careful handling to avoid breaking fetch requests.
6. Vercel deployment is smooth — but getting the `.env` files and build config right took some trial and error.

## What I Learned
This project taught me a lot:
- How to work with multiple AI models through one API  
- How to handle real-time data fetching in React  
- How to structure and optimize a frontend project  
- What it takes to go from idea → live → mobile  
- How to debug and adapt to third-party API quirks  
It took around **14** of dedicated effort — from ideation and development to testing, polish, and deployment. Every piece of the app, from UI to API handling, was built from scratch with love.

##  Made By

Made with ❤️ by **Asim Husain** - https://asimhusain.vercel.app

## License

This project is licensed under the MIT License — feel free to fork, modify, or build on it!
