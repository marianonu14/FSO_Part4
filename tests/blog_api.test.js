const mongoose = require('mongoose');
const supertest = require('supertest');
const { app, server } = require('../index');
const api = supertest(app);
const bcrypt = require('bcrypt')
const User = require('../models/User')
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
