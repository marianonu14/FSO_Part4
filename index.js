const express = require('express');
const cors = require('cors');

const blogRouter = require('./controllers/blogRouter');
const config = require('./utils/config');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/blog', blogRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Blog Api');
});

const server = app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

module.exports = { app, server }