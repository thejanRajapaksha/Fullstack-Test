const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

// JWT secret key
const JWT_SECRET = "your_secret_key"; // Replace with a secure secret key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
const mongoURI =
  "mongodb+srv://rajapakshalista41:pAfDjUKDCOxI3or3@cluster0.1rcni.mongodb.net/Hotel_DB?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error registering user." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid email." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: "Invalid password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Respond with token and user details
    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "An error occurred during login." });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user;
    next();
  });
};


// Contact Us Route (Without Authentication)
app.post("/contact-us", async (req, res) => {
  const { email, message, name, userId } = req.body;

  if (!email || !message || !name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!userId) {
    return res.status(400).json({ error: "User is not logged in." });
  }

  try {
    // Create the message and optionally associate it with a user
    const newMessage = new Message({
      userId, // If userId exists, associate it
      name,
      email,
      message,
    });

    await newMessage.save();
    res.status(200).json({ success: true, message: "Your message has been sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while saving the message." });
  }
});

// Get messages sent by the logged-in user
app.get("/messages", authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.userId }).exec();

    if (!messages || messages.length === 0) {
      return res.status(404).json({ success: false, message: "No messages found." });
    }

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while fetching messages." });
  }
});

app.put("/update-profile", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Retrieved from token by the authenticateToken middleware
  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    // Find the user and update their details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
