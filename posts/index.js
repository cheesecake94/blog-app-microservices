const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

// In-memory posts
const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const title = req.body.title;

  posts[id] = { title }

  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log('Posts service listening on 4000');
})