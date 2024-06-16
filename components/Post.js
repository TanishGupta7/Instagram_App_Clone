import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Card, CardContent, CardMedia, Typography, Button, TextField, List, ListItem } from '@mui/material';

const socket = io('http://localhost:4000');

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    socket.on('update_post', updatedPost => {
      if (updatedPost.id === post.id) {
        setLikes(updatedPost.likes);
        setComments(updatedPost.comments);
      }
    });
  }, [post.id]);

  const handleLike = async () => {
    await axios.post('http://localhost:4000/like', { postId: post.id });
  };

  const handleComment = async () => {
    await axios.post('http://localhost:4000/comment', { postId: post.id, comment: newComment });
    setNewComment('');
  };

  return (
    <Card>
      <CardMedia component="img" image={`http://localhost:4000${post.photo}`} alt="Photo" />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Likes: {likes}
        </Typography>
        <Button onClick={handleLike}>Like</Button>
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index}>{comment}</ListItem>
          ))}
        </List>
        <TextField
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <Button onClick={handleComment}>Comment</Button>
      </CardContent>
    </Card>
  );
};

export default Post;
