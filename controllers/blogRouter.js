const router = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.send(blogs);
});

router.post('/', async (req, res) => {
  const { title, author, url, userId } = req.body;

  const user = await User.findById(userId);

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
