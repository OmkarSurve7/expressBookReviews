const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Retrieve all books
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Internal route for all books
public_users.get('/books', (req, res) => {
  return res.status(200).json(books);
});

// Retrieve book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/books/isbn/${req.params.isbn}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});

// Internal ISBN route
public_users.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Retrieve books by author
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/books/author/${encodeURIComponent(req.params.author)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Author not found"
    });
  }
});

// Internal author route
public_users.get('/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );

  return res.status(200).json(result);
});

// Retrieve books by title
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/books/title/${encodeURIComponent(req.params.title)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Title not found"
    });
  }
});

// Internal title route
public_users.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === title
  );

  return res.status(200).json(result);
});

// Retrieve reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

module.exports.general = public_users;