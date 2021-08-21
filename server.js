'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// token configurations for Auth0 
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
let client = jwksClient({
  jwksUri: 'https://dev-wajr50en.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (error, key) {
    let signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

//connect to database with mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// confirms or error handles mongoose connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected')
});

//*---------------------

const app = express();
app.use(cors());

// allows us to access the request body
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Brings in books.js module
const BookModel = require('./models/books');
const seed = require('./modules/seed');

// *-------------------------------------------*

app.get('/', (request, response) => {
  response.send('Hello World!')
});

app.get('/test', (request, response) => {

  // STEP 1: get the jwt from the headers
  const token = request.headers.authorization.split(' ')[1];
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken doc - https://www.npmjs.com/package/jsonwebtoken
  jwt.verify(token, getKey, {}, function (error, user) {
    if (error) {
      response.status(500).send('Invalid Token');
    }
    response.send(user);
  });
});

// *-------------------------------------------*

app.get('/books', async (request, response) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
    // jsonwebtoken doc - https://www.npmjs.com/package/jsonwebtoken
    jwt.verify(token, getKey, {}, function (error, user) {
      if (error) {
        response.status(500).send('Invalid Token');
      }
      // Read data (C READ U D)
      // gets information from database
      BookModel.find({}, (error, booksData) => {
        response.status(200).send(booksData);
      });
    });
  }
  catch (error) {
    response.status(500).send('Database Error');
  }
});

//*-------------------------------------------*

// Seed database
app.get('/seed', seed);

// Clears the database - can go into it's own module
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

//NOTE: beware jwt verify token error. Do console logs
// Notes to ask Mark
// How did youfigure out the seed status numbers

