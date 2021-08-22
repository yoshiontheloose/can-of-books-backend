'use strict';
// Brings in books.js module
const BookModel = require('../models/books');

// creates and saves individual book data (Create R U D)
async function addBook(object) {
  let newBook = new BookModel(object);
  return await newBook.save();
};

async function seed(request, response) {
  let books = await BookModel.find({});
  if (books.length === 0) {
    await addBook({
      title: 'Title of the book',
      description: 'description of the book',
      status: '200',
      email: 'clarissapamonicutt@gmail.com',
    });
    await addBook({
      title: 'Title of the book2',
      description: 'description of the book2',
      status: '2002',
      email: 'email@email2',
    });
    await addBook({
      title: 'Title of the book3',
      description: 'description of the book3',
      status: '2003',
      email: 'email@email3',
    });
  };
  response.send('seeded database');
};

module.exports = seed;
