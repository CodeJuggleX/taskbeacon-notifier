
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Avatar, 
  Tooltip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const API_BASE_URL = "http://192.168.38.236:8000/api/v1";

export const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const username = localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      // Call the logout API
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');

      toast({
        title: 'Выход из системы',
        description: 'Вы успешно вышли из системы',
      });

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the API call fails, clear local storage and redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography variant="h6">
          {username || 'Пользователь'}
        </Typography>
      </Box>
      
      <Tooltip title="Выйти из системы">
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<LogoutIcon />} 
          onClick={handleLogout}
        >
          Выйти
        </Button>
      </Tooltip>
    </Paper>
  );
};
