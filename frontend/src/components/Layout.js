import React from 'react';
import { Box, AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: 'primary.main',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            bgcolor: 'secondary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AdminPanelSettingsIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.3px' }}>
            AdminCore
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14, fontWeight: 700 }}>
            AD
          </Avatar>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
