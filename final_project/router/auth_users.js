const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const isValid = (username) => {
  return users.some(user => user.username === username);
};


//returns boolean
//write code to check if username and password match the one we have in records.
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};





//only registered users can login

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  req.session.authorization = { accessToken };
  
  return res.status(200).json({ message: "Login successful", token: accessToken });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;  // Extracted from JWT

  if (!review) {
      return res.status(400).json({ message: "Review text is required" });
  }

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Store review
  if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully", reviews: books[isbn].reviews });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
