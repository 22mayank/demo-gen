import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Avatar,
  Stack,
  styled,
  TextField
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Refresh,
  ContentCopy,
  Edit,
  Message as MessageIcon,
  Check,
  Close
} from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';

const MessageContainer = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(3),
  width: '100%',
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  maxWidth: '80%',
  padding: theme.spacing(2),
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[800],
  color: theme.palette.common.white,
  borderRadius: theme.spacing(1),
}));

const EditableContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    '& .MuiTextField-root': {
      width: '100%',
      color: 'inherit',
      '& .MuiOutlinedInput-root': {
        color: 'inherit',
      }
    }
  }));

  const Message = ({ message, previousUserMessage }) => {
    const { sendQueryWithFiles } = useChat();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);
    const isUser = message.type === 'user';
  
    const handleRegenerateResponse = async () => {
      if (!isUser && previousUserMessage) {
        // When regenerating, use the previous user message's content and files
        await sendQueryWithFiles(
          previousUserMessage.content,
          previousUserMessage.files,
          true // isRegenerate flag
        );
      }
    };
  
    const handleEdit = () => {
      setIsEditing(true);
      setEditedContent(message.content);
    };
  
    const handleSaveEdit = async () => {
      if (editedContent.trim() !== message.content) {
        await sendQueryWithFiles(editedContent, message.files);
      }
      setIsEditing(false);
    };
  
    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditedContent(message.content);
    };
  
    const handleCopy = () => {
      navigator.clipboard.writeText(message.content);
    };
  
    return (
      <MessageContainer isUser={isUser}>
        <Box sx={{ maxWidth: '80%' }}>
          {!isUser && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, ml: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.700' }}>
                <MessageIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Typography>
            </Stack>
          )}
  
          <MessageBubble elevation={0} isUser={isUser}>
            {isEditing ? (
              <EditableContent>
                <TextField
                  multiline
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  variant="outlined"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'flex-end' }}>
                  <IconButton size="small" onClick={handleCancelEdit}>
                    <Close fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleSaveEdit}>
                    <Check fontSize="small" />
                  </IconButton>
                </Stack>
              </EditableContent>
            ) : (
              <Typography variant="body1">{message.content}</Typography>
            )}
  
            {message.files?.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {message.files.map(file => (
                  <Chip
                    key={file.name}
                    label={file.name}
                    size="small"
                    sx={{ height: 24 }}
                  />
                ))}
              </Stack>
            )}
  
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mt: 2,
                justifyContent: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              {isUser ? (
                !isEditing && (
                  <>
                    <IconButton size="small" onClick={handleCopy}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleEdit}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </>
                )
              ) : (
                <>
                  <IconButton size="small">
                    <ThumbUp fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <ThumbDown fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={handleRegenerateResponse}
                    disabled={!previousUserMessage}
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleCopy}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </>
              )}
            </Stack>
          </MessageBubble>
        </Box>
      </MessageContainer>
    );
  };
  
  export default Message;