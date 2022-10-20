const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);
const Blog = require('../models/Blog');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});

  let noteObject = new Blog(helper.initialBlog[0]);
  await noteObject.save();

  noteObject = new Blog(helper.initialBlog[1]);
  await noteObject.save();

  noteObject = new Blog(helper.initialBlog[2]);
  await noteObject.save();
});

describe('HTTP Request GET', () => {
  test('Blog are returned as json', async () => {
    await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('All posts are returned', async () => {
    const response = await api.get('/api/blog');

    expect(response.body).toHaveLength(helper.initialBlog.length);
  });

  test('A specific post is within the returned notes', async () => {
    const response = await api.get('/api/blog');

    const contents = response.body.map((r) => r.title);
    expect(contents).toContain('New Post');
  });
});

describe('HTTP Request POST', () => {
  test('New post', async () => {
    const post = {
      title: 'Something',
      author: 'Something',
      url: 'Something',
      likes: 20,
    };

    await api
      .post('/api/blog')
      .send(post)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blog');

    expect(response.body).toHaveLength(helper.initialBlog.length + 1);
  });

  test('New post without title', async () => {
    const post = {
      author: 'Something',
      url: 'Something',
      likes: 20,
    };

    await api.post('/api/blog').send(post).expect(400);

    const response = await api.get('/api/blog');

    expect(response.body).toHaveLength(helper.initialBlog.length);
  });

  test('New post likes undefined equal to 0', async () => {
    const post = {
      title: 'Something',
      author: 'Something',
      url: 'Something',
    };

    await api
      .post('/api/blog')
      .send(post)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blog');
    const likesArray = response.body.map((elem) => elem.likes);

    expect(likesArray).toContain(0);
  });
});

describe('HTTP Request PUT', () => {
  test('Update a Post', async () => {
    const response = await api.get('/api/blog');

    const { id } = response.body[0];

    const post = {
      title: 'Something Update',
      author: 'Something Update',
      url: 'Something Update',
    };

    await api
      .put(`/api/blog/${id}`)
      .send(post)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newResponse = await api.get('/api/blog');

    expect(newResponse.body[0].id).toEqual(id);
  });

  test('Update a Post with Invalid ID', async () => {
    const post = {
      title: 'Something Update',
      author: 'Something Update',
      url: 'Something Update',
    };

    await api
      .put(`/api/blog/${Math.random().toString()}`)
      .send(post)
      .expect(404);
  });
});

describe('HTTP Request DELETE', () => {
  test('Delete a post', async () => {
    const response = await api.get('/api/blog');

    const { id } = response.body[0];

    await api
      .delete(`/api/blog/${id}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newResponse = await api.get('/api/blog');

    expect(newResponse.body).toHaveLength(helper.initialBlog.length - 1);
  });

  test('Invalid ID', async () => {
    await api.delete(`/api/blog/${Math.random().toString()}`).expect(404);

    const response = await api.get('/api/blog');

    expect(response.body).toHaveLength(helper.initialBlog.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
