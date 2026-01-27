# 📝 AI-Powered Blog Platform

## Overview
A modern blog platform that allows users to read, write, and manage blog posts, with an integrated AI feature that can automatically generate blog posts. This project is designed to make content creation faster, smarter, and more accessible.

---

## 🚀 Features

### Core Functionality
- **✍️ Create, edit, and delete blog posts**
- **🤖 AI-generated blog posts** (based on user prompts/topics)
- **📚 View published blog posts** in a clean layout
- **🔍 Easy content creation** for beginners and non-writers
- **🌐 Responsive design** (works on desktop and mobile)

### 🧠 AI Blog Generator

The AI feature helps users:

- Generate full blog posts from a topic or short prompt
- Get ideas, introductions, or complete articles
- Save time and improve writing productivity

> ⚠️ **Note:** AI-generated content can be edited by users before publishing.

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **HTML, CSS, JavaScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)

### Backend
- **Node.js**
- **Express.js**

### Database
- **MongoDB**

### AI Integration
- **OpenAI API** (or any other AI text generation service)

---

## 📂 Project Structure

```
Blogify/
├── blogify-client/          → Frontend code (React + Vite)
│   ├── src/
│   │   ├── components/      → Reusable UI components
│   │   ├── pages/           → Page components
│   │   ├── context/         → Context API for state management
│   │   └── services/        → API service calls
│   └── package.json
├── blogify-backend/         → Backend API (Node.js + Express)
│   ├── models/              → Database models
│   ├── routes/              → API routes
│   ├── server.js            → Main server file
│   └── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd Blogify
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd blogify-backend
npm install
```

**Frontend:**
```bash
cd ../blogify-client
npm install
```

### Step 3: Add Environment Variables
Create a `.env` file in the `blogify-backend` directory:

```env
AI_API_KEY=your_api_key_here
MONGODB_URI=your_database_url
PORT=5000
NODE_ENV=development
```

### Step 4: Run the Project

**Backend:**
```bash
cd blogify-backend
npm run dev
```

**Frontend:**
```bash
cd blogify-client
npm run dev
```

---

## 📖 Usage

1. **Register** an account or **Login**
2. **Create** a new blog post
3. Use the **AI Generator** to help write your post
4. **Publish** and share your blog post
5. **View** other blog posts on the platform

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

---

## 📄 License

This project is licensed under the MIT License.
