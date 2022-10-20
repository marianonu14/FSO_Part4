const router = require('express').Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.send(blogs);
});

router.post('/', async (req, res) => {
  const blog = new Blog(req.body);

  const { title, author, url } = blog;

  if (!title || !author || !url) {
    return res.status(400).send('The infomation is incomplete');
  }

  const result = await blog.save();
  res.status(201).send(result);
});

router.put('/:id', async (req, res) => {
  const blogUpdate = req.body

  try {
    const result = await Blog.findByIdAndUpdate(req.params.id, blogUpdate, { new: true });
    res.status(201).send(result);
  } catch (error) {
    res.status(404).send('Invalid ID')
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
