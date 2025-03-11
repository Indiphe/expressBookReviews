const express = require('express');
const axios = require('axios');
let books = require("../booksdb.js");
let isValid = require("../auth_users.js").isValid;
let users = require("../auth_users.js").users;
const public_users = express.Router();

// Task 10: Get all books using Async/Await
public_users.get('/', async (req, res) => {
  try {
    let bookList = await new Promise((resolve) => resolve(books));
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error });
  }
});

// Task 11: Get book by ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    let response = await axios.get(`http://localhost:5000/customer/auth/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get books by Author using Axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();

  try {
    let response = await axios.get(`http://localhost:5000/customer/auth/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 13: Get books by Title using Axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();

  try {
    let response = await axios.get(`http://localhost:5000/customer/auth/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 14: Get book reviews using Async/Await
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    let response = await axios.get(`http://localhost:5000/customer/auth/review/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});

module.exports = public_users;
