import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Chip, Stack, Divider, styled } from '@mui/material';
import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  Refresh,
  ContentCopy,
  Edit,
  Check,
  Close,
  AttachFile
} from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';

const MessageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '8px',
});

const MessageBubble = styled(Box)(({ isUser }) => ({
  backgroundColor: isUser ? '#1B1C20' : 'transparent',
  padding: isUser ? '12px' : '0px',
  borderRadius: '8px',
  color: '#F8F8F8',
  width: 'fit-content',
}));

const EditContainer = styled(Box)({
  backgroundColor: '#1B1C20',
  borderRadius: '8px',
  padding: '12px',
  width: '100%',
});

const EditableInput = styled('textarea')({
  width: '100%',
  minHeight: '60px',
  maxHeight: '150px',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#F8F8F8',
  fontSize: '16px',
  fontFamily: 'Inter, sans-serif',
  resize: 'vertical',
  outline: 'none',
  lineHeight: 1.5,
  marginBottom: '8px',
});

const FileChip = styled(Chip)({
  backgroundColor: '#303136',
  color: '#F8F8F8',
  height: '24px',
  '& .MuiChip-label': {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    padding: '0 8px',
  },
  '& .MuiChip-deleteIcon': {
    color: '#F8F8F8',
    '&:hover': {
      color: '#A0A0A1',
    },
  },
});

const FileChipsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const ActionButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#A0A0A1',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    pointerEvents: 'none',
  },
});

const VerticalDivider = styled(Divider)({
  height: '24px',
  width: '1px',
  backgroundColor: '#303136',
  margin: '0 12px',
});

const Message = ({ message, previousUserMessage }) => {
  const { sendQueryWithFiles, loading } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [editedFiles, setEditedFiles] = useState(message.files || []);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const isUser = message.type === 'user';

  useEffect(() => {
    if (!loading && isSaving) {
      setIsEditing(false);
      setIsSaving(false);
    }
  }, [loading, isSaving]);

  const handleFileAdd = (event) => {
    const newFiles = Array.from(event.target.files || []);
    setEditedFiles(prev => [...prev, ...newFiles]);
    event.target.value = '';
  };

  const handleFileRemove = (fileToRemove) => {
    setEditedFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const handleEdit = () => {
    if (!loading) {
      setIsEditing(true);
      setEditedContent(message.content);
      setEditedFiles([...message.files]);
    }
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim() && !loading) {
      setIsSaving(true);
      await sendQueryWithFiles(editedContent, editedFiles);
    }
  };

  const handleCancelEdit = () => {
    if (!isSaving) {
      setIsEditing(false);
      setEditedContent(message.content);
      setEditedFiles(message.files || []);
    }
  };

  const handleRegenerate = async () => {
    if (previousUserMessage && !loading) {
      await sendQueryWithFiles(
        previousUserMessage.content,
        previousUserMessage.files,
        true
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const renderEditMode = () => (
    <EditContainer>
      <EditableInput
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        autoFocus
        disabled={isSaving}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '4px',
          alignItems: 'center' 
        }}>
          {editedFiles.map((file, index) => (
            <FileChip
              key={index}
              label={file.name}
              onDelete={isSaving ? undefined : () => handleFileRemove(file)}
              size="small"
            />
          ))}
          {!isSaving && (
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              sx={{ 
                color: '#A0A0A1',
                padding: '4px',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              <AttachFile fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Stack 
          direction="row" 
          spacing={1} 
          justifyContent="flex-end"
        >
          <IconButton 
            onClick={handleCancelEdit}
            disabled={isSaving}
            sx={{ 
              color: '#A0A0A1',
              padding: '4px',
              '&.Mui-disabled': {
                color: 'rgba(160, 160, 161, 0.5)',
              }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={handleSaveEdit}
            disabled={isSaving || !editedContent.trim()}
            sx={{ 
              color: '#A0A0A1',
              padding: '4px',
              '&.Mui-disabled': {
                color: 'rgba(160, 160, 161, 0.5)',
              }
            }}
          >
            <Check fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileAdd}
        multiple
        disabled={isSaving}
      />
    </EditContainer>
  );

  const renderContent = () => (
    <MessageBubble isUser={isUser}>
      <Typography sx={{ 
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap'
      }}>
        {message.content}
      </Typography>

      {message.files?.length > 0 && (
        <FileChipsContainer sx={{ mt: 1 }}>
          {message.files.map((file, index) => (
            <FileChip
              key={index}
              label={file.name}
              size="small"
            />
          ))}
        </FileChipsContainer>
      )}

      {isUser ? (
        <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
          <IconButton 
            size="small" 
            onClick={handleCopy}
            sx={{ color: '#A0A0A1' }}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleEdit}
            disabled={loading}
            sx={{ 
              color: '#A0A0A1',
              '&.Mui-disabled': {
                color: 'rgba(160, 160, 161, 0.5)',
              }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#A0A0A1' }}>
              <ThumbUpOutlined fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#A0A0A1' }}>
              <ThumbDownOutlined fontSize="small" />
            </IconButton>
          </Box>
          
          <VerticalDivider orientation="vertical" />
          
          <ActionButton 
            onClick={handleRegenerate}
            className={loading ? 'Mui-disabled' : ''}
          >
            <Refresh fontSize="small" />
            <Typography sx={{ fontSize: '14px', fontFamily: 'Inter' }}>
              Regenerate
            </Typography>
          </ActionButton>
          
          <ActionButton onClick={handleCopy}>
            <ContentCopy fontSize="small" />
            <Typography sx={{ fontSize: '14px', fontFamily: 'Inter' }}>
              Copy
            </Typography>
          </ActionButton>
        </Stack>
      )}
    </MessageBubble>
  );

  return (
    <MessageContainer>
      {!isUser && (
        <Typography sx={{ 
          color: '#A0A0A1', 
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        }}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </Typography>
      )}
      
      <Box sx={{ 
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
      }}>
        {isEditing ? renderEditMode() : renderContent()}
      </Box>
    </MessageContainer>
  );
};

export default Message;