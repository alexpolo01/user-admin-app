import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import UserListPage from './pages/UserListPage';
import UserDetailPage from './pages/UserDetailPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a2e', contrastText: '#ffffff' },
    secondary: { main: '#e94560' },
    background: { default: '#f5f5f7', paper: '#ffffff' },
    text: { primary: '#1a1a2e', secondary: '#6b7280' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px' },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, fontSize: '0.72rem' } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
