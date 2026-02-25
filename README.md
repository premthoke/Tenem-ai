🚀 Tenem AI — ChatGPT Clone

A full-stack AI chat application that allows users to sign up, log in, and interact with an AI assistant in real time.
Built with a modern MERN-style architecture and deployed on free cloud platforms.

🌐 Live Demo

Frontend: https://tenem-ai.vercel.app

Backend API: https://tenem-ai.onrender.com

📌 Project Overview

Tenem AI is a ChatGPT-like web application where users can:

Create an account

Log in securely using JWT authentication

Start new AI conversations

View chat history

Continue previous chats

Stream AI responses in real time

The goal of this project was to build a production-ready full-stack AI app using modern tools and deploy it online.

🧠 Key Features

🔐 User Authentication (Signup/Login)

💬 Real-time AI Chat

🧾 Chat history saving

🔄 Resume previous conversations

⚡ Streaming AI responses

☁️ Cloud deployment (Frontend + Backend)

📱 Responsive modern UI

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

Context API / Hooks

Backend

Node.js

Express.js

MongoDB Atlas

JWT Authentication

REST APIs

AI Integration

OpenRouter API

Deployment

Vercel → Frontend

Render → Backend

MongoDB Atlas → Database

📷 Screenshots
🏠 Landing Page

🔐 Login Page

📝 Signup Page

💬 Chat Interface

📚 Chat History Sidebar

Add images inside /screenshots folder in your repo.

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/premthoke/Tenem-ai.git
cd Tenem-ai
2️⃣ Setup Backend
cd server
npm install
npm start

Create .env file:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENROUTER_API_KEY=your_key
3️⃣ Setup Frontend
cd client
npm install
npm run dev

Create .env:

VITE_API_URL=http://localhost:5000
🧪 How It Works

User signs up/login

JWT token stored in browser

Chat messages sent to backend

Backend:

saves chat

sends prompt to AI API

streams response

Frontend displays AI reply live

🏗️ Project Architecture
Client (React)
   ↓
API Requests
   ↓
Express Server
   ↓
MongoDB Atlas
   ↓
OpenRouter AI
🚧 Challenges Solved

Deployment issues with free hosting

JWT auth handling across frontend/backend

Chat persistence & retrieval

CORS + production API routing

Streaming AI responses in browser

📈 Future Improvements

Planned enhancements:

🧠 Multi-model AI support

📁 Export chat as PDF

🌙 Theme switcher

🧾 Chat rename & delete UX improvements

🔔 Notifications

👥 Team collaboration chats

🧩 Plugin/tool support

📊 Usage analytics dashboard

This project will continue evolving as new features are implemented.

👨‍💻 Author

Prem Thoke
Computer Engineering Student
Full-Stack Developer

GitHub: https://github.com/premthoke

LinkedIn: (add later)

⭐ Support

If you like this project:

Star the repository ⭐

Fork it 🍴

Share feedback 💬

🏁 Final Note

This project was built to demonstrate:

full-stack development skills

real AI integration

production deployment ability

debugging & system design thinking

More advanced features will be added in future iterations as the project grows.
