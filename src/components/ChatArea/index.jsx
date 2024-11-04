import React from 'react';
import { Box, IconButton, styled } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';
import Message from './Message';
import MessageInput from './MessageInput';
import WelcomeScreen from './WelcomeScreen';

const ChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}));

const ChatArea = () => {
    const { messages, selectedFiles } = useChat();
  
    const renderMessages = () => {
      return messages.map((message, index) => {
        // Find the previous user message for AI responses
        let previousUserMessage = null;
        if (message.type === 'ai' && index > 0) {
          previousUserMessage = messages[index - 1];
        }
        
        return (
          <Message 
            key={index} 
            message={message} 
            previousUserMessage={previousUserMessage}
          />
        );
      });
    };
  
    return (
      <ChatContainer>
        <Header>
          <IconButton color="inherit" edge="start">
            <ArrowBack />
          </IconButton>
        </Header>
  
        <MessagesContainer>
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            renderMessages()
          )}
        </MessagesContainer>
  
        <MessageInput />
      </ChatContainer>
    );
  };
  
  export default ChatArea;