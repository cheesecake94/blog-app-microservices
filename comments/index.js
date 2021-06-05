const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

// In-memory comments
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId[postId]);
});

app.post('/posts/:id/comments', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const content = req.body.content;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];

  comments.push({ id, content });

  commentsByPostId[postId] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Comments service listening on 4001');
})