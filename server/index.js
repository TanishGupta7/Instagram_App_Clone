const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configure Multer for file uploads
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

  app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Store posts in memory (for simplicity)
const posts = [];
app.post('/upload', upload.single('photo'), (req, res) => {
    const { description } = req.body;
    const newPost = {
      id: posts.length,
      photo: `/uploads/${req.file.filename}`,
      description,
      likes: 0,
      comments: [],
    };
    posts.push(newPost);
    io.emit('new_post', newPost); // Notify all clients about the new post
    res.status(201).json(newPost);
  });
  
  app.post('/like', (req, res) => {
    const { postId } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      io.emit('update_post', post); // Notify all clients about the update
      res.status(200).json(post);
    } else {
      res.status(404).send('Post not found');
    }
  });
  
  app.post('/comment', (req, res) => {
    const { postId, comment } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments.push(comment);
      io.emit('update_post', post); // Notify all clients about the update
      res.status(200).json(post);
    } else {
      res.status(404).send('Post not found');
    }
  });
  
  server.listen(4000, () => {
    console.log('Server is running on port 4000');
  });