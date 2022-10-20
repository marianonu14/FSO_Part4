const mongoose = require('mongoose');
const config = require('../utils/config');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => console.log(err.message));

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number || 0,
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog
