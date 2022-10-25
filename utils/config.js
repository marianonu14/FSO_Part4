require('dotenv').config();

let MONGODB_URI = process.env.MONGODB_URI;
let PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
  PORT = 5001;
}

module.exports = { MONGODB_URI, PORT };
