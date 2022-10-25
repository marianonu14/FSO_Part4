const User = require('../models/user')

const initialBlog = [
    {
      title: 'Something',
      author: 'Something',
      url: 'Something',
      likes: 20,
    },
    {
      title: 'New Post',
      author: 'Something',
      url: 'Something',
      likes: 20,
    },
    {
      title: 'Something',
      author: 'Something',
      url: 'Something',
      likes: 20,
    },
  ];

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

  module.exports = { initialBlog, usersInDb }