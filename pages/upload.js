import { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const Upload = () => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);

    await axios.post('http://localhost:4000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setPhoto(null);
    setDescription('');
  };

  return (
    <div>
      <TextField type="file" onChange={handlePhotoChange} />
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default Upload;
