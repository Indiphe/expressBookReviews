const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to validate user
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Helper function to check username and password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Middleware for JWT Authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, "access", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = user; // Save user info in request for further processing
    next(); // Proceed to the next middleware or route handler
  });
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate the user with the provided username and password
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token and store it in the session
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  // Store the token in the session
  req.session.authorization = { accessToken };

  console.log("User logged in:", username);  // Debug log to check if the route is hit

  return res.status(200).json({ message: "Login successful", token: accessToken });
});


// Task 8: Add/Modify Book Review Route - Allows users to post reviews
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;  // Extracted from JWT

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Update the review for the given ISBN and username
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

// Task 9: Delete Book Review Route - Allows users to delete their reviews
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;  // Extracted from JWT

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
