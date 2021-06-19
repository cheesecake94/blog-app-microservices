const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// In-memory comments
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId[postId]);
});

app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const content = req.body.content;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];

  comments.push({ id, content });

  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { id, content, postId }
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log(`Event received [${req.body.type}]`);
});

app.listen(4001, () => {
  console.log('Comments service listening on 4001');
})