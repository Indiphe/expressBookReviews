const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
 
 // Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the new user (add to users array)
  users.push({ username, password });

  // Return success message
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

 
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});
 
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from request parameters and convert to number
  const isbn = req.params.isbn;
 
  // Find the book by ISBN
  const book = books[isbn];
 
  if (book) {
      return res.send(JSON.stringify(book, null, 2)); // Send the book details
  } else {
      return res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
  }
 
});
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Extract the author parameter from the request URL
  const author = req.params.author;
 
  // Create an array of books by matching author name
  let filtered_books = [];
 
  // Iterate through the books object and find books with the matching author
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      filtered_books.push(books[key]); // Add matching book to the array
    }
  }
 
  // If no books were found by the given author, return a 404 status
  if (filtered_books.length > 0) {
    return res.status(200).json(filtered_books); // Send the filtered books
  } else {
    return res.status(404).json({ message: "No books found by this author" }); // Handle case where no books are found
  }
});
 
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Extract the title parameter from the request URL
  const title = req.params.title;
 
  // Create an array of books by matching title
  let filtered_books = [];
 
  // Iterate through the books object and find books with the matching title
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      filtered_books.push(books[key]); // Add matching book to the array
    }
  }
 
  // If no books were found by the given author, return a 404 status
  if (filtered_books.length > 0) {
    return res.status(200).json(filtered_books); // Send the filtered books
  } else {
    return res.status(404).json({ message: "No books found by this title" }); // Handle case where no books are found
  }
 
});
 
//  Get book review
// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  // Retrieve the ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book exists in the books object
  const book = books[isbn];

  if (book && book.reviews) {
      // If reviews exist, return them as a response
      return res.status(200).json(book.reviews);
  } else {
      // If the book or reviews are not found, return a 404 error
      return res.status(404).json({ message: "Reviews not found for this book" });
  }
});

 
module.exports.general = public_users;
 
 
 
 
 