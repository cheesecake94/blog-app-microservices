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

  const newComment = { id, content, status: 'pending' };

  const comments = commentsByPostId[postId] || [];

  comments.push(newComment);

  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { ...newComment, postId }
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log(`Event received [${req.body.type}]`);

  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    const { id, status, postId } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => comment.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: { ...comment, postId }
    });
  }
});

app.listen(4001, () => {
  console.log('Comments service listening on 4001');
})