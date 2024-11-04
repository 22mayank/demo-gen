import { createContext, useContext, useState, useCallback } from 'react';
import { mockApi } from '../services/mockApi';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [credits, setCredits] = useState(20);
  const [useCase, setUseCase] = useState({ name: 'Document Q&A' });
  const [pipeline, setPipeline] = useState({ name: 'Demo-Document Q&A' });
  const [version, setVersion] = useState({ name: 'Version01-Document Q&A' });
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCredits = useCallback(async () => {
    try {
      const response = await mockApi.getCredits();
      setCredits(response.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  }, []);

  const fetchUseCaseDetails = useCallback(async (useCaseId) => {
    try {
      setLoading(true);
      const response = await mockApi.getUseCaseDetails(useCaseId);
      setUseCase(response.useCase);
      setPipeline(response.pipeline);
      setVersion(response.version);
    } catch (error) {
      console.error('Error fetching use case details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUseCaseDetails = useCallback(async (useCaseId, updates) => {
    try {
      setLoading(true);
      const response = await mockApi.updateUseCaseDetails(useCaseId, updates);
      if (updates.useCase) setUseCase({ name: updates.useCase });
      if (updates.pipeline) setPipeline({ name: updates.pipeline });
      if (updates.version) setVersion({ name: updates.version });
    } catch (error) {
      console.error('Error updating use case details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChatHistory = useCallback(async () => {
    try {
      const history = await mockApi.getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        credits,
        useCase,
        pipeline,
        version,
        chatHistory,
        loading,
        fetchCredits,
        fetchUseCaseDetails,
        updateUseCaseDetails,
        fetchChatHistory
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};