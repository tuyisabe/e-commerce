import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-toastify';

const ImageUpload = ({ onUploadSuccess, folder = 'uploads' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useSelector((state) => state.auth);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `${folder}/${user.uid}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error('Failed to upload image');
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onUploadSuccess(downloadURL);
            toast.success('Image uploaded successfully');
          } catch (error) {
            console.error('Get URL error:', error);
            toast.error('Failed to get image URL');
          } finally {
            setUploading(false);
            setProgress(0);
          }
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </label>
      {uploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
