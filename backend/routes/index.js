const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");
const mongoose = require('mongoose');

// Use environment variable for secret key
const secret = process.env.JWT_SECRET || "your_default_secret_key";

// GET home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// Sign Up
router.post("/signUp", async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username,
      name,
      email,
      password: hash
    });

    return res.json({ success: true, message: "User created successfully", userId: user._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email, userId: user._id }, secret);
    return res.json({ success: true, message: "User logged in successfully", token, userId: user._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Get User Details
router.post("/getUserDetails", async (req, res) => {
  const { userId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    return res.json({ success: true, message: "User details fetched successfully", user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Create Project
router.post("/createProject", async (req, res) => {
  const { userId, title } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const project = await projectModel.create({ title, createdBy: userId });
    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Get Projects
router.post("/getProjects", async (req, res) => {
  const { userId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const projects = await projectModel.find({ createdBy: userId });
    return res.json({ success: true, message: "Projects fetched successfully", projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Delete Project
router.post("/deleteProject", async (req, res) => {
  const { userId, progId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(progId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const project = await projectModel.findOneAndDelete({ _id: progId });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Get Project
router.post("/getProject", async (req, res) => {
  const { userId, projId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(projId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const project = await projectModel.findById(projId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    return res.json({ success: true, message: "Project fetched successfully", project });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Update Project
router.post("/updateProject", async (req, res) => {
  const { userId, htmlCode, cssCode, jsCode, projId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(projId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode, cssCode, jsCode },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    return res.json({ success: true, message: "Project updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

module.exports = router;
