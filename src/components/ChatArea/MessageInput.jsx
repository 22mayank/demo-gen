import React, { useRef, useState, useEffect } from 'react';
import { Box, InputBase, IconButton, Chip, styled } from '@mui/material';
import { AttachFile, Close } from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';

const InputContainer = styled(Box)({
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '16px',
  backgroundColor: '#07080A',
});

const InputWrapper = styled(Box)({
  backgroundColor: '#1B1C20',
  borderRadius: '8px',
  overflow: 'hidden',
});

const FileChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  padding: '8px 12px 4px 12px',
});

const InputRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
});

const CustomChip = styled(Chip)({
  backgroundColor: '#303136',
  color: '#fff',
  height: '24px',
  '& .MuiChip-label': {
    fontSize: '12px',
    padding: '0 8px',
  },
  '& .MuiChip-deleteIcon': {
    color: '#fff',
    margin: '0 4px',
    '&:hover': {
      color: '#d1d1d1',
    },
  },
});

const TypingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  color: '#A0A0A1',
  gap: '4px',
  '& .dots': {
    display: 'inline-flex',
    gap: '2px',
    '& .dot': {
      animation: 'blink 1.4s infinite both',
      '&:nth-of-type(2)': {
        animationDelay: '0.2s',
      },
      '&:nth-of-type(3)': {
        animationDelay: '0.4s',
      },
    },
  },
  '@keyframes blink': {
    '0%, 100%': {
      opacity: 0.3,
    },
    '50%': {
      opacity: 1,
    },
  },
});

const SendIcon = styled('svg')({
  transform: 'rotate(-45deg)',
  '& path': {
    strokeWidth: 1.5,
  },
});

const MessageInput = ({ isTyping }) => {
  const { selectedFiles, sendQueryWithFiles, selectFiles, removeFile } = useChat();
  const [query, setQuery] = useState('');
  const [localFiles, setLocalFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Reset local state when a message is sent (isTyping changes from true to false)
  useEffect(() => {
    if (!isTyping) {
      setQuery('');
      setLocalFiles([]);
    }
  }, [isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      await sendQueryWithFiles(query, localFiles);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      setLocalFiles(prev => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const handleFileRemove = (fileToRemove) => {
    setLocalFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  if (isTyping) {
    return (
      <InputContainer>
        <InputWrapper>
          <TypingIndicator>
            Typing
            <span className="dots">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
          </TypingIndicator>
        </InputWrapper>
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      <InputWrapper>
        {localFiles.length > 0 && (
          <FileChipsContainer>
            {localFiles.map((file, index) => (
              <CustomChip
                key={index}
                label={file.name}
                onDelete={() => handleFileRemove(file)}
                deleteIcon={<Close sx={{ fontSize: 14 }} />}
              />
            ))}
          </FileChipsContainer>
        )}
        
        <InputRow component="form" onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            multiple
          />
          
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              color: '#A0A0A1',
              padding: '6px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <AttachFile sx={{ fontSize: 20 }} />
          </IconButton>

          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your questions"
            sx={{
              mx: 1,
              color: '#fff',
              fontSize: '14px',
              '& input::placeholder': {
                color: '#A0A0A1',
                opacity: 1,
              },
            }}
          />

          <IconButton
            type="submit"
            disabled={!query.trim()}
            sx={{
              color: query.trim() ? '#6D7BFB' : '#424242',
              padding: '6px',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&.Mui-disabled': {
                color: '#424242',
              },
            }}
          >
            <SendIcon width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12L20 4L12 20L10 14L4 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </SendIcon>
          </IconButton>
        </InputRow>
      </InputWrapper>
    </InputContainer>
  );
};

export default MessageInput;