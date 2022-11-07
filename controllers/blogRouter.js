const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const User = require('../models/User');

const getTokenFrom = (req) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

router.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.send(blogs);
});

router.post('/', async (req, res) => {
  const { title, author, url } = req.body;
  const token = getTokenFrom(req);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (!title || !author || !url) {
    return res.status(400).send('The infomation is incomplete');
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blog = user.blog.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

router.put('/:id', async (req, res) => {
  const blogUpdate = req.body;

  try {
    const result = await Blog.findByIdAndUpdate(req.params.id, blogUpdate, {
      new: true,
    });
    res.status(201).send(result);
  } catch (error) {
    res.status(404).send('Invalid ID');
    console.log(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Blog.findByIdAndRemove(req.params.id);
    res.status(201).send(result);
  } catch (error) {
    res.status(404).send('Invalid ID');
    console.log(error.message);
  }
});

module.exports = router;
