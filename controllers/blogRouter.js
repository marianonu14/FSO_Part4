const router = require('express').Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.send(blogs);
});

router.post('/', async (req, res) => {
  const blog = new Blog(req.body);

  const { title, author, url, likes } = blog

  if(!title || !author || !url){
    return res.status(400).send('The infomation is incomplete')
  }

  const result = await blog.save();
  res.status(201).send(result);
});

module.exports = router;
