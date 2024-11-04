import React, { useRef } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Chip,
  Stack,
  Alert,
  Snackbar,
  styled
} from '@mui/material';
import {
  AttachFile,
  Send,
  Close as CloseIcon
} from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';

const InputContainer = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[800],
    borderRadius: theme.spacing(2),
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
  }));

const MessageInput = () => {
  const { loading, selectedFiles, sendQueryWithFiles, selectFiles, removeFile } = useChat();
  const [query, setQuery] = React.useState('');
  const [error, setError] = React.useState('');
  const fileInputRef = useRef(null);

  const resetInput = () => {
    setQuery('');
    // Reset all selected files
    selectedFiles.forEach(file => removeFile(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFiles.length) {
      setError('Please select documents to analyze');
      return;
    }

    if (query.trim()) {
      try {
        await sendQueryWithFiles(query, selectedFiles);
        resetInput();
      } catch (err) {
        setError('Failed to process your request');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      selectFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <InputContainer elevation={0}>
        {selectedFiles.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ pb: 1 }}>
            {selectedFiles.map(file => (
              <Chip
                key={file.name}
                label={file.name}
                onDelete={() => removeFile(file)}
                deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                size="small"
                sx={{ bgcolor: 'grey.700', color: 'common.white' }}
              />
            ))}
          </Stack>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            multiple
            accept=".pdf,.doc,.docx,.txt"
          />
          
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{ color: 'text.secondary' }}
            disabled={loading}
          >
            <AttachFile />
          </IconButton>

          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your questions"
            sx={{ 
              mx: 1,
              color: 'common.white',
              '& input::placeholder': {
                color: 'text.secondary',
                opacity: 1
              }
            }}
            disabled={loading}
          />

          <IconButton
            type="submit"
            size="small"
            disabled={loading || !query.trim()}
            sx={{ 
              color: query.trim() ? 'primary.main' : 'text.disabled'
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </InputContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessageInput;