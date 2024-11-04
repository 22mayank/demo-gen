import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  styled
} from '@mui/material';
import { Description } from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';

const LogoContainer = styled(Paper)(({ theme }) => ({
  width: 64,
  height: 64,
  backgroundColor: theme.palette.grey[800],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ActionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.grey[800],
  },
}));

const WelcomeScreen = () => {
  const { selectFiles } = useChat();
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      selectFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        width: '100%',
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
        }}
      >
        <LogoContainer elevation={0}>
          <Description sx={{ fontSize: 32, color: 'common.white' }} />
        </LogoContainer>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 1, 
            color: 'common.white',
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          Welcome Document Q&A!
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Choose prompt below or write your own to start chatting with me
        </Typography>

        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            ASK ABOUT
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <ActionCard elevation={0}>
              <Typography sx={{ color: 'common.white' }}>
                Brainstorm ideas for the expected outcome or solution
              </Typography>
            </ActionCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <ActionCard 
              elevation={0}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                '&:hover': {
                  backgroundColor: 'grey.800',
                  cursor: 'pointer'
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                multiple
                accept=".pdf,.doc,.docx,.txt"
              />
              <Typography sx={{ color: 'common.white' }}>
                Upload the document to start the Q&A
              </Typography>
            </ActionCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <ActionCard elevation={0}>
              <Typography sx={{ color: 'common.white' }}>
                Create a questionnaire from the doc to ask our customers
              </Typography>
            </ActionCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;