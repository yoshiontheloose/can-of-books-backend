'use strict';

const mongoose = require('mongoose');

// mongoose schema with keys
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  email: { type: String, required: true },
});

const BookModel = mongoose.model('books', bookSchema);

module.exports = BookModel;