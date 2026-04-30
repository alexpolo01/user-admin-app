import React from 'react';
import { Chip } from '@mui/material';

const statusConfig = {
  Active: { color: 'success', variant: 'filled' },
  Inactive: { color: 'default', variant: 'outlined' },
};

const roleConfig = {
  Admin: { sx: { bgcolor: '#e94560', color: '#fff' } },
  Editor: { sx: { bgcolor: '#1a1a2e', color: '#fff' } },
  Viewer: { sx: { bgcolor: '#f3f4f6', color: '#6b7280' } },
};

export function StatusChip({ status }) {
  const cfg = statusConfig[status] || {};
  return <Chip label={status} color={cfg.color} variant={cfg.variant} size="small" />;
}

export function RoleChip({ role }) {
  const cfg = roleConfig[role] || { sx: {} };
  return <Chip label={role} size="small" sx={{ fontWeight: 600, fontSize: '0.72rem', ...cfg.sx }} />;
}
