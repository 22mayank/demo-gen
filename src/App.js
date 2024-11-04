import React from 'react';
import Box from '@mui/material/Box';
import { SidebarProvider } from './context/SidebarContext';
import { ChatProvider } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const App = () => {
  return (
    <SidebarProvider>
      <ChatProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar useCaseId="document-qa" />
          <ChatArea />
        </Box>
      </ChatProvider>
    </SidebarProvider>
  );
};

export default App;