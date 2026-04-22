import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDb from "./db.js";
import { User } from "./models/User.js";
import { ISSLocation } from "./models/ISSLocation.js";
import { generateToken } from "./utils/jwt.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDb();

// Auth Routes
// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const user = new User({ email, password });
    await user.save();

    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Example API routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// NASA APOD API endpoint
app.get("/api/apod", async (req, res) => {
  try {
    const { count } = req.query;
    const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

    // Build query parameters for NASA API
    const params = new URLSearchParams({
      thumbs: "true",
      api_key: NASA_API_KEY,
    });

    if (count) params.append("count", count as string);

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?${params.toString()}`
    );

    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch from NASA API" });
      return;
    }

    const data = await response.json();

    // Handle both single image and array of images
    if (Array.isArray(data)) {
      const images = data.map((item: any) => ({
        title: item.title,
        date: item.date,
        url: item.url,
        thumbnail_url: item.thumbnail_url,
        explanation: item.explanation,
      }));
      res.json({ images });
    } else {
      res.json({
        title: data.title,
        date: data.date,
        url: data.url,
        thumbnail_url: data.thumbnail_url,
        explanation: data.explanation,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch APOD data" });
  }
});

// ISS Location API endpoint
app.get("/api/iss", async (req, res) => {
  try {
    const response = await fetch("http://api.open-notify.org/iss-now.json");

    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch ISS data" });
      return;
    }

    const data = await response.json();
    const latitude = parseFloat(data.iss_position.latitude);
    const longitude = parseFloat(data.iss_position.longitude);
    const timestamp = data.timestamp;

    // Log the location to database
    try {
      const issLocation = new ISSLocation({
        latitude,
        longitude,
        timestamp,
      });
      await issLocation.save();
      console.log(`ISS location logged: ${latitude}, ${longitude}`);
    } catch (dbError) {
      console.error("Failed to log ISS location to database:", dbError);
      // Don't fail the API response if logging fails
    }

    // Return data in the expected format
    res.json({
      message: data.message,
      timestamp: timestamp,
      iss_position: {
        latitude,
        longitude,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ISS location" });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
