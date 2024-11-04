import { createContext, useContext, useState, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { useSidebar } from './SidebarContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { fetchCredits } = useSidebar();
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  const sendQueryWithFiles = useCallback(async (query, files, isRegenerate = false) => {
    if (!query.trim() || !files.length) return;

    setLoading(true);
    try {
      // Only upload files if not regenerating
      if (!isRegenerate) {
        await mockApi.uploadFiles(files);
      }

      // Add user message immediately
      const userMessage = {
        type: 'user',
        content: query,
        files: [...files],
        timestamp: new Date()
      };

      // Add AI message with empty content
      const aiMessage = {
        type: 'ai',
        content: '',
        timestamp: new Date()
      };

      if (isRegenerate) {
        // Remove last two messages if regenerating
        setMessages(prev => [...prev.slice(0, -2), userMessage, aiMessage]);
      } else {
        setMessages(prev => [...prev, userMessage, aiMessage]);
      }

      // Simulate streaming response
      const response = await mockApi.query(query);
      const words = response.response.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Delay between words
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.content = words.slice(0, i + 1).join(' ');
          return newMessages;
        });
      }

      await fetchCredits();
      return response;
    } catch (error) {
      console.error('Operation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchCredits]);

  const selectFiles = useCallback((files) => {
    setSelectedFiles(prev => [...prev, ...Array.from(files)]);
  }, []);

  const removeFile = useCallback((fileToRemove) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileToRemove.name));
  }, []);

  const startNewChat = useCallback(() => {
    setCurrentSession(null);
    setMessages([]);
    setSelectedFiles([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        selectedFiles,
        loading,
        currentSession,
        sendQueryWithFiles,
        selectFiles,
        removeFile,
        startNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};