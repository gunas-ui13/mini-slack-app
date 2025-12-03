# Mini Team Chat Application (Slack Clone) 🚀

A full-stack real-time chat application built for the Full-Stack Internship. It allows users to create channels, join rooms, and chat instantly with persistent message history and online status tracking.

## 🔗 Live Links
- **Frontend (Live App):** https://mini-slack-app-rho.vercel.app/
- **Backend (API):** https://mini-slack-app.onrender.com

## 🛠 Tech Stack
- **Frontend:** React.js (Vite), CSS3
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB Atlas (Mongoose)
- **Deployment:** Vercel (Client) & Render (Server)

## ✨ Features Implemented
1. **User Authentication:** Sign up and Login with persistent sessions (JWT/LocalStorage).
2. **Real-Time Messaging:** Instant message delivery using Socket.io.
3. **Channel Management:** Users can browse and create dynamic channels.
4. **Data Persistence:** All messages and channels are stored in MongoDB.
5. **Online Presence:** Real-time tracking of active users (Green dot indicator).
6. **Responsive UI:** Slack-like interface with sidebar and auto-scrolling chat.

## ⚙️ Setup & Run Instructions
To run this project locally:

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/gunas-ui13/mini-slack-app.git]
   (https://github.com/gunas-ui13/mini-slack-app.git)
   cd mini-slack-app
## Setup Backend 
cd server
npm install
# Create a .env file and add:
# MONGO_URI=your_mongodb_string
# PORT=5000
npm run dev

## Setup Frontend 
cd ../client
npm install
npm run dev
