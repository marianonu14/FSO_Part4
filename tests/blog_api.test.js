const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);
const Blog = require('../models/Blog');
const initialBlog = [
  {
    title: 'Algo',
    author: 'Algo',
    url: 'Algo',
    likes: 20,
  },
  {
    title: 'New Post',
    author: 'Algo',
    url: 'Algo',
    likes: 20,
  },
  {
    title: 'Algo',
    author: 'Algo',
    url: 'Algo',
    likes: 20,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let noteObject = new Blog(initialBlog[0]);
  await noteObject.save();

  noteObject = new Blog(initialBlog[1]);
  await noteObject.save();

  noteObject = new Blog(initialBlog[2]);
  await noteObject.save();
});

test('blog are returned as json', async () => {
  await api
    .get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all posts are returned', async () => {
  const response = await api.get('/api/blog')

  expect(response.body).toHaveLength(initialBlog.length)
})

test('a specific post is within the returned notes', async () => {
  const response = await api.get('/api/blog')

  const contents = response.body.map(r => r.title)
  expect(contents).toContain('New Post')
})

afterAll(() => {
  mongoose.connection.close();
});
