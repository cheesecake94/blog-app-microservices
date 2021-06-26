const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id, content, status, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === 'CommentUpdated') {
    const { id, content, status, postId } = data;
    const post = posts[postId];
    const comment = post.comments.find(comment => comment.id === id);
    comment.content = content;
    comment.status = status;
  }
};

const handleOutOfSyncEvents = async () => {
  const res = await axios.get('http://localhost:4005/events');

  res.data.forEach(event => {
    console.log('Processing event: ' + event.type);
    handleEvent(event.type, event.data);
  });
};

// Get Posts with their comments 
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  res.send({});
});

app.listen(4002, () => {
  console.log('Query service listening on 4002');
  handleOutOfSyncEvents();
})