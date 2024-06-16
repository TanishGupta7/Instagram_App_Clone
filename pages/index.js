import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Post from '../components/Post';

const socket = io('http://localhost:4000');

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('http://localhost:4000/posts');
      setPosts(response.data);
    };
    fetchPosts();

    socket.on('new_post', newPost => {
      setPosts(prevPosts => [newPost, ...prevPosts]);
    });
  }, []);

  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
