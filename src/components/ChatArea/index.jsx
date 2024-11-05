import React from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';
import Message from './Message';
import MessageInput from './MessageInput';
import WelcomeScreen from './WelcomeScreen';

const ChatContainer = styled(Box)({
  flex: 1,
  height: '100vh',
  backgroundColor: '#07080A',
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled(Box)({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

const MessagesContainer = styled(Box)({
  flex: 1,
  overflow: 'auto',
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const DateDivider = styled(Typography)({
  color: '#A0A0A1',
  fontSize: '12px',
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: '16px 0',
});

const ChatArea = () => {
  const { messages, loading } = useChat();

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    if (date.toDateString() === today.toDateString()) {
      return 'TODAY';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'YESTERDAY';
    } else if (date > lastWeek) {
      return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).toUpperCase();
    }
  };

  const renderMessages = () => {
    let currentDate = null;
    const messageGroups = [];

    messages.forEach((message, index) => {
      const messageDate = formatMessageDate(message.timestamp);
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        messageGroups.push(
          <DateDivider key={`date-${index}`}>
            {messageDate}
          </DateDivider>
        );
      }

      const previousUserMessage = 
        message.type === 'ai' && index > 0 ? messages[index - 1] : null;

      messageGroups.push(
        <Message 
          key={`msg-${index}`}
          message={message}
          previousUserMessage={previousUserMessage}
        />
      );
    });

    return messageGroups;
  };

  return (
    <ChatContainer>
      <Header>
        <IconButton 
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
          }}
        >
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

      <MessageInput isTyping={loading} />
    </ChatContainer>
  );
};

export default ChatArea;