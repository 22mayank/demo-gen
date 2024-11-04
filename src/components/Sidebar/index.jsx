import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  styled
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useSidebar } from '../../context/SidebarContext';
import { useChat } from '../../context/ChatContext';
import EditDialog from './EditDialog';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 260,
  height: '100vh',
  backgroundColor: theme.palette.grey[900],
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 500,
  padding: theme.spacing(2, 2, 1),
  textTransform: 'uppercase',
}));

const Sidebar = () => {
  const { credits, useCase, pipeline, version, updateUseCaseDetails } = useSidebar();
  const { startNewChat } = useChat();
  const [editDialog, setEditDialog] = useState({ open: false, type: '', value: '' });

  const handleEdit = (type, value) => {
    setEditDialog({ open: true, type, value });
  };

  const handleSave = (newValue) => {
    updateUseCaseDetails('document-qa', { [editDialog.type]: newValue });
    setEditDialog({ open: false, type: '', value: '' });
  };

  return (
    <SidebarContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>Genesis</Typography>
        <Chip 
          label={`${credits} Credits left`}
          sx={{ bgcolor: 'grey.800', color: 'primary.main' }}
        />
      </Box>

      <Box>
        <SectionTitle>USE CASE</SectionTitle>
        <List dense>
          <ListItem>
            <ListItemText primary={useCase.name} />
            <IconButton size="small" onClick={() => handleEdit('useCase', useCase.name)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </ListItem>
        </List>

        <SectionTitle>PIPELINE</SectionTitle>
        <List dense>
          <ListItem>
            <ListItemText primary={pipeline.name} />
            <IconButton size="small" onClick={() => handleEdit('pipeline', pipeline.name)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </ListItem>
        </List>

        <SectionTitle>VERSION</SectionTitle>
        <List dense>
          <ListItem>
            <ListItemText primary={version.name} />
            <IconButton size="small" onClick={() => handleEdit('version', version.name)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </ListItem>
        </List>
      </Box>

      <Button
        startIcon={<AddIcon />}
        onClick={startNewChat}
        sx={{
          mx: 2,
          my: 2,
          bgcolor: 'grey.800',
          color: 'common.white',
          '&:hover': {
            bgcolor: 'grey.700',
          },
        }}
      >
        New chat
      </Button>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <SectionTitle>CHAT SESSION HISTORY</SectionTitle>
        <List dense>
          <ListItem>
            <ListItemText primary="Natural Language Query" />
          </ListItem>
        </List>
      </Box>

      <EditDialog
        open={editDialog.open}
        title={editDialog.type}
        value={editDialog.value}
        onClose={() => setEditDialog({ open: false, type: '', value: '' })}
        onSave={handleSave}
      />
    </SidebarContainer>
  );
};

export default Sidebar;