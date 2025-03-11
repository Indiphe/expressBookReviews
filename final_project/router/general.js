const express = require('express');
let books = require("./booksdb.js"); // Assuming this holds your book data
let isValid = require("./auth_users.js").isValid; // Assuming this is for user validation
let users = require("./auth_users.js").users; // Assuming this holds users data
const public_users = express.Router();

// Register a new user (yet to be implemented)
public_users.post("/register", (req, res) => {
  // Implement user registration logic here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Send back the list of books as a JSON string
  res.json(books); // Simplified response
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);

  if (book) {
    res.json(book); // Send back the book with the matching ISBN
  } else {
    res.status(404).json({ message: "Book not found with the given ISBN" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = books.filter(b => b.author === author);

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor); // Return books by the author
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));

  if (booksByTitle.length > 0) {
    res.json(booksByTitle); // Return books that match the title
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);

  if (book && book.reviews) {
    res.json(book.reviews); // Return reviews for the book
  } else {
    res.status(404).json({ message: "Reviews not found for this book" });
  }
});

module.exports.general = public_users;
