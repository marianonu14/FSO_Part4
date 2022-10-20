const router = require('express').Router();
const Blog = require('../models/Blog');

router.get('/', (req, res) => {
  Blog.find({}).then((blogs) => {
    res.send(blogs);
  });
});

router.post('/', (req, res) => {
  const blog = new Blog(req.body);

  blog.save().then((result) => {
    response.status(201).send(result);
  });
});

module.exports = router;
