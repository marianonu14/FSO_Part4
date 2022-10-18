require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log('DB Connected'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Welcome to the Blog Api')
})

app.get('/api/blogs', (req, res) => {
  Blog.find({}).then((blogs) => {
    res.send(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).send(result);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
