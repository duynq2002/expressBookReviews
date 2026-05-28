const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({message: "User already exists. Please use different username."});
  }
  users.push({username, password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  await res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn in books) {
    await res.send(books[isbn]);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  if (filteredBooks.length > 0) {
    await res.send(filteredBooks);
  } else {
    res.status(404).json({message: "Books by this author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (filteredBooks.length > 0) {
    await res.send(filteredBooks);
  } else {
    res.status(404).json({message: "Books with this title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn in books) {
    await res.send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
