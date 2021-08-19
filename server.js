'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { request, response } = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

const BookModel = require('./modules/books');

app.get('/books', async (request, response) => {
  try {
    let booksdb = await BookModel.find({});
    response.status(200).send(booksdb);
  }
  catch (error) {
    response.status(500).send('database error');
  }
});

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/test', (request, response) => {
  response.send();

  // DONE: 
  // STEP 1: get the jwt from the headers
  // ? What are the headers? The const/requires?

  const token = req.headers.authorizatoion.split(' ')[1];

  jwt.verify(token, getKey, {}, function (error, user) {
    if (error) {
      response.status(500).send('invalid token');
    }
    response.send(user);
  });

  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken

  //* ----- Source: jsonwebtoken docs. jwksUri endpoint from authO settings. ----- *//

  let jwksClient = require('jwks-rsa');
  let client = jwksClient({
    jwksUri: 'https://dev-wajr50en.us.auth0.com/.well-known/jwks.json'
  });

  function getKey(header, callback) {
    client.getSigningKey(header.kid, function (error, key) {
      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  // DONE STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
})

// Connect to database
mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to database');
    // creates individual book data
    let newBook = new BookModel({
      title: 'Title of the book',
      description: 'description of the book',
      status: 'status',
      email: 'email@email',
    });
    //saves created book object
    await newBook.save();
  });

  // Clears the database - JP way
  app.get('/clear', clear);
  async function clear(request, response) {
    try {
      await BookModel.deleteMany({});
      response.status(200).send('Database cleared');
    }
    catch (error) {
      response.status(500).send('Error: Database not cleared');
    }
  };

app.listen(PORT, () => console.log(`listening on ${PORT}`));

//NOTE: jwks stands for JSON Web Key Set

