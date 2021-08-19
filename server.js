'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { request, response } = require('express');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/test', (request, response) => {
  response.send();

  // DONE: 
  // STEP 1: get the jwt from the headers
  // ? What are the headers? The const/requires?

  const token = req.headers.authorizatoion.split(' ')[1];
  
  jwt.verify(token, getKey, {}, function (error, user){
    if(error){
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

app.listen(PORT, () => console.log(`listening on ${PORT}`));

//NOTE: jwks stands for JSON Web Key Set

