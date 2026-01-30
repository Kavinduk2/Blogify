# Complete Authentication Guide for MERN Stack

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Understanding Authentication Basics](#understanding-authentication-basics)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Testing Authentication](#testing-authentication)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Introduction

This guide will walk you through implementing **complete authentication** in your MERN (MongoDB, Express, React, Node.js) application from scratch. By the end, you'll understand:

- How authentication works
- How sessions and tokens work
- How to secure your backend API
- How to manage authentication state in React
- Best practices for security

---

## Understanding Authentication Basics

### What is Authentication?

Authentication is the process of verifying who a user is. It answers the question: "Are you really who you claim to be?"

### How Does Web Authentication Work?

1. **User Registration**: User creates an account with credentials (email + password)
2. **Password Hashing**: Server stores a hashed (encrypted) version of the password, NOT the plain text
3. **User Login**: User provides credentials to log in
4. **Token Generation**: Server verifies credentials and generates a token (JWT)
5. **Token Storage**: Client stores the token (in localStorage or cookies)
6. **Authenticated Requests**: Client sends the token with each request to access protected resources
7. **Token Verification**: Server verifies the token before allowing access

### What is JWT (JSON Web Token)?

JWT is a secure way to transmit information between parties as a JSON object. It consists of three parts:

```
Header.Payload.Signature
```

- **Header**: Token type and hashing algorithm
- **Payload**: User data (user ID, email, etc.)
- **Signature**: Encrypted hash to verify token authenticity

**Example JWT:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWY4ZjgzZTQwYTJiZjIxZGMzOTk0ODYiLCJpYXQiOjE2NDM3MjkwMjJ9.R7Xy8u9QvYZ4kzLPmZ0XdQ1uZ5rZ8X7y5QzLPmZ0XdQ
```

### Session vs Token Authentication

| Feature         | Session-Based                    | Token-Based (JWT)         |
| --------------- | -------------------------------- | ------------------------- |
| Storage         | Server stores session data       | Client stores token       |
| Scalability     | Harder (requires shared storage) | Easier (stateless)        |
| Mobile-Friendly | Less                             | More                      |
| Security        | Server-controlled                | Requires careful handling |

**For this guide, we'll use JWT tokens** as they're modern, scalable, and work great with React applications.

---

## Backend Setup

### Step 1: Install Required Dependencies

Navigate to your backend folder and install these packages:

```bash
cd blogify-backend
npm install bcryptjs jsonwebtoken express-validator
```

**Package explanations:**

- **bcryptjs**: Hashes (encrypts) passwords securely
- **jsonwebtoken**: Creates and verifies JWT tokens
- **express-validator**: Validates and sanitizes user input

### Step 2: Create User Model

Create a file: `blogify-backend/models/User.js`

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Method to compare passwords (for login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't send password in JSON responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
```

**What's happening here?**

- We define the structure of a User in MongoDB
- We add validation rules (required fields, email format, etc.)
- We add a method to compare passwords securely
- We ensure passwords are never sent in API responses

### Step 3: Create Authentication Routes

Create a file: `blogify-backend/routes/auth.js`

```javascript
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

// JWT Secret (should be in .env file)
const JWT_SECRET =
  process.env.JWT_SECRET || "your_secret_key_change_this_in_production";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

// Validation rules for registration
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validation rules for login
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
router.post("/login", loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Send response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private (requires authentication)
router.get("/me", async (req, res) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post("/logout", (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint is optional but good for consistency
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
```

**What's happening here?**

- **Registration**: Creates new user with hashed password, returns JWT token
- **Login**: Verifies credentials, returns JWT token
- **Get Me**: Returns current user data if token is valid
- **Logout**: Provides endpoint for logout (token removed client-side)

### Step 4: Create Authentication Middleware

Create a file: `blogify-backend/middleware/auth.js`

```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your_secret_key_change_this_in_production";

// Middleware to verify JWT token and authenticate user
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided. Please log in.",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token invalid.",
      });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

// Optional authentication - doesn't fail if no token
// Useful for routes that work both with and without authentication
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (user) {
        req.user = user;
        req.token = token;
      }
    }

    // Always continue, even if no token or invalid token
    next();
  } catch (error) {
    // Silently fail and continue without authentication
    next();
  }
};

// Middleware to check if user has admin role
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

export default authenticate;
```

**What's happening here?**

- **authenticate**: Checks if a valid JWT token is provided, attaches user to request
- **optionalAuth**: Checks for token but doesn't fail if missing (useful for public routes)
- **isAdmin**: Checks if authenticated user has admin role

### Step 5: Update server.js

Update your `blogify-backend/server.js`:

```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"; // Add this line
import postRoutes from "./routes/posts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/blogify",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", authRoutes); // Add this line
app.use("/api/posts", postRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Blogify API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth", // Add this line
      posts: "/api/posts",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
```

### Step 6: Protect Your Routes

To protect a route (require authentication), use the middleware:

Example: Update `blogify-backend/routes/posts.js`:

```javascript
import express from "express";
import { authenticate } from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

// Public route - anyone can view posts
router.get("/", async (req, res) => {
  // ... get all posts
});

// Protected route - only authenticated users can create posts
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id, // req.user is available from authenticate middleware
    });

    await post.save();
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected route - only post author can update
router.put("/:id", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts",
      });
    }

    // Update post...
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
```

### Step 7: Environment Variables

Create/update `blogify-backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogify
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_minimum_32_characters
NODE_ENV=development
```

**⚠️ IMPORTANT**:

- Never commit `.env` file to Git
- Use a strong, random JWT_SECRET in production
- Change the JWT_SECRET regularly

---

## Frontend Setup

### Step 1: Install Dependencies

Navigate to your frontend folder:

```bash
cd blogify-client
npm install axios
```

**axios**: HTTP client for making API requests

### Step 2: Create API Service

Create/update `blogify-client/src/services/api.js`:

```javascript
import axios from "axios";

// Base URL for API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response.data;
  },
};

// Posts API calls
export const postsAPI = {
  // Get all posts
  getAll: async () => {
    const response = await api.get("/posts");
    return response.data;
  },

  // Get single post
  getById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create post (requires auth)
  create: async (postData) => {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  // Update post (requires auth)
  update: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete post (requires auth)
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

export default api;
```

**What's happening here?**

- We create an axios instance with base URL
- Request interceptor automatically adds JWT token to all requests
- Response interceptor handles 401 errors (redirects to login)
- We export organized API functions

### Step 3: Create Auth Context

Create `blogify-client/src/context/AuthContext.jsx`:

```javascript
import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api";

// Create Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const data = await authAPI.getCurrentUser();
      setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const data = await authAPI.register(userData);

      // Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authAPI.login(credentials);

      // Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
```

**What's happening here?**

- We create a Context to share auth state across the app
- We provide functions for register, login, logout
- We check authentication on app load
- We provide `isAuthenticated` boolean for easy checking

### Step 4: Wrap App with Auth Provider

Update `blogify-client/src/main.jsx`:

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

### Step 5: Create Login Page

Create `blogify-client/src/pages/Login.jsx`:

```javascript
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Attempt login
    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } else {
      setLocalError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(localError || error) && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {localError || error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

### Step 6: Create Register Page

Create `blogify-client/src/pages/Register.jsx`:

```javascript
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Attempt registration
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate("/dashboard"); // Redirect after successful registration
    } else {
      setLocalError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(localError || error) && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {localError || error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
```

### Step 7: Create Protected Route Component

Create `blogify-client/src/components/ProtectedRoute.jsx`:

```javascript
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
```

### Step 8: Update App.jsx with Routes

Update `blogify-client/src/App.jsx`:

```javascript
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
```

### Step 9: Update Navbar with Auth

Update your Navbar component to show login/logout:

```javascript
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Blogify
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>
            <Link to="/blog" className="hover:text-indigo-600">
              Blog
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-600">
                  Dashboard
                </Link>
                <Link to="/create-post" className="hover:text-indigo-600">
                  Create Post
                </Link>
                <span className="text-gray-600">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### Step 10: Environment Variables

Create `blogify-client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Testing Authentication

### 1. Start the Backend

```bash
cd blogify-backend
npm start
```

### 2. Start the Frontend

```bash
cd blogify-client
npm run dev
```

### 3. Test Registration

1. Navigate to `http://localhost:5173/register`
2. Fill in the form
3. Submit
4. You should be redirected to dashboard

### 4. Test Login

1. Navigate to `http://localhost:5173/login`
2. Enter your credentials
3. Submit
4. You should be logged in

### 5. Test Protected Routes

1. While logged in, visit `/dashboard` - should work
2. Logout
3. Try to visit `/dashboard` - should redirect to login

### 6. Test Token Expiration

1. Login
2. In browser DevTools > Application > Local Storage
3. Delete the token
4. Try to access a protected route
5. Should redirect to login

---

## Security Best Practices

### 1. JWT Security

✅ **DO:**

- Use strong, random JWT secret (minimum 32 characters)
- Set reasonable expiration times (7 days max for web, 30 days for mobile)
- Store tokens in httpOnly cookies for better security (or localStorage for simplicity)
- Validate tokens on every protected request

❌ **DON'T:**

- Store sensitive data in JWT payload (it's base64, not encrypted)
- Use the same secret for all environments
- Set tokens that never expire

### 2. Password Security

✅ **DO:**

- Always hash passwords using bcrypt
- Use salt rounds of 10 or more
- Enforce minimum password length (6+ characters)
- Consider password complexity requirements

❌ **DON'T:**

- Store plain text passwords
- Use simple hashing like MD5 or SHA1
- Log passwords in any form

### 3. Input Validation

✅ **DO:**

- Validate all user inputs on both frontend and backend
- Sanitize inputs to prevent XSS attacks
- Use express-validator or similar libraries
- Validate email formats

❌ **DON'T:**

- Trust client-side validation alone
- Allow SQL injection by concatenating queries (use ODM/ORM)

### 4. Error Handling

✅ **DO:**

- Use generic error messages ("Invalid credentials" not "User not found")
- Log detailed errors server-side
- Handle all promise rejections

❌ **DON'T:**

- Expose stack traces to clients
- Reveal whether email exists during login
- Send database errors to frontend

### 5. HTTPS

✅ **DO:**

- Use HTTPS in production
- Set secure cookies
- Enable HSTS headers

### 6. Rate Limiting

Implement rate limiting to prevent brute force attacks:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many login attempts, please try again later",
});

router.post("/login", loginLimiter, loginValidation, async (req, res) => {
  // ... login logic
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Token is not valid" Error

**Cause**: JWT secret mismatch or expired token

**Solution**:

- Ensure JWT_SECRET is the same on all backend instances
- Check token expiration time
- Clear localStorage and login again

#### 2. CORS Errors

**Cause**: Frontend and backend on different origins

**Solution**:

```javascript
// In server.js
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
```

#### 3. "Cannot read property 'user' of null"

**Cause**: Using useAuth() outside of AuthProvider

**Solution**:

- Ensure AuthProvider wraps your entire app in main.jsx
- Check if component is inside AuthProvider

#### 4. Protected Routes Not Working

**Cause**: Token not being sent with requests

**Solution**:

- Check axios interceptor is configured correctly
- Verify token exists in localStorage
- Check Authorization header in Network tab

#### 5. User Remains Logged In After Token Expires

**Cause**: Frontend not checking token validity

**Solution**:

- Implement token refresh mechanism
- Check token expiration on app load
- Use axios response interceptor to catch 401 errors

---

## Next Steps

### 1. Implement Token Refresh

Add refresh tokens to avoid forcing users to login after token expires:

- Generate both access token (short-lived) and refresh token (long-lived)
- Store refresh token securely
- Use refresh token to get new access token

### 2. Add Social Authentication

Integrate OAuth providers:

- Google OAuth
- GitHub OAuth
- Facebook OAuth

Libraries: `passport.js`, `next-auth`

### 3. Implement Email Verification

- Send verification email on registration
- Require email verification before allowing login
- Use nodemailer or SendGrid

### 4. Add Password Reset

- "Forgot Password" functionality
- Email password reset link
- Secure token-based reset

### 5. Two-Factor Authentication (2FA)

- Use authenticator apps (Google Authenticator)
- SMS verification
- Libraries: `speakeasy`, `qrcode`

### 6. Role-Based Access Control (RBAC)

Implement different user roles:

```javascript
// Middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

// Usage
router.delete(
  "/posts/:id",
  authenticate,
  requireRole(["admin", "moderator"]),
  deletePost,
);
```

### 7. Audit Logging

Track user actions:

- Login attempts
- Profile changes
- Content creation/deletion
- Store in separate audit log collection

### 8. Session Management

Track active sessions:

- Store sessions in Redis
- Allow users to logout from all devices
- Show active devices/sessions

### 9. Account Security Features

- Login history
- Unusual login detection
- Account lockout after failed attempts
- Security questions

### 10. Progressive Enhancement

- Remember me functionality
- Persistent login across browser restarts
- Biometric authentication (fingerprint, face ID)

---

## Summary

You've now learned:

✅ **What authentication is** and why it's important  
✅ **How JWT tokens work** and when to use them  
✅ **Backend setup** with Express, MongoDB, and JWT  
✅ **Frontend setup** with React Context and Axios  
✅ **Protected routes** that require authentication  
✅ **Security best practices** to keep users safe  
✅ **Troubleshooting** common authentication issues  
✅ **Next steps** to enhance your authentication system

### Quick Reference

**Backend Flow:**

1. User registers → Password hashed → Stored in DB
2. User logs in → Password verified → JWT generated
3. JWT sent to client
4. Client sends JWT with each request
5. Server verifies JWT → Grants access

**Frontend Flow:**

1. User fills login form → Sends to API
2. Receives JWT → Stores in localStorage
3. Axios interceptor adds JWT to requests
4. Protected routes check authentication
5. Logout removes JWT

---

## Additional Resources

### Documentation

- [JWT.io](https://jwt.io) - Learn about JWT tokens
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [Express.js](https://expressjs.com) - Web framework
- [React Router](https://reactrouter.com) - Routing
- [Axios](https://axios-http.com) - HTTP client

### Video Tutorials

- Search for "MERN Authentication Tutorial" on YouTube
- Look for tutorials by Traversy Media, Web Dev Simplified, or Academind

### Security Guides

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Good luck with your authentication implementation! 🚀**

If you have questions:

1. Check the Troubleshooting section
2. Review the code comments
3. Test each step individually
4. Use console.log() to debug
5. Check browser DevTools Network tab
