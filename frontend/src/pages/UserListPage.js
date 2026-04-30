import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, IconButton,
  Tooltip, TextField, InputAdornment, Skeleton, Alert, Stack,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import Layout from '../components/Layout';
import { StatusChip, RoleChip } from '../components/StatusChip';
import { userService } from '../services/api';

function getInitials(first, last) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

function AvatarCell({ firstName, lastName }) {
  const initials = getInitials(firstName, lastName);
  const hue = (initials.charCodeAt(0) + initials.charCodeAt(1)) % 360;
  return (
    <Avatar sx={{
      width: 36, height: 36, fontSize: 13, fontWeight: 700,
      bgcolor: `hsl(${hue},55%,45%)`,
    }}>
      {initials}
    </Avatar>
  );
}

export default function UserListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch(() => setError('Failed to load users. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>User Management</Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage user profiles and their associated addresses.
        </Typography>
      </Box>

      {/* Stats row */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        {[
          { label: 'Total Users', value: users.length, icon: <PeopleAltIcon />, color: '#1a1a2e' },
          { label: 'Active', value: users.filter(u => u.status === 'Active').length, icon: <PeopleAltIcon />, color: '#10b981' },
          { label: 'Total Addresses', value: users.reduce((s, u) => s + (u.addresses?.length || 0), 0), icon: <HomeIcon />, color: '#e94560' },
        ].map(stat => (
          <Card key={stat.label} sx={{ flex: 1, p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: `${stat.color}15`, color: stat.color, display: 'flex' }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>{loading ? '—' : stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Card>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            placeholder="Search users by name, email or role…"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 340 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Addresses</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton height={28} /></TableCell>
                    ))}
                  </TableRow>
                ))
                : filtered.map(user => (
                  <TableRow key={user.id} hover sx={{ cursor: 'default' }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <AvatarCell firstName={user.firstName} lastName={user.lastName} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </TableCell>
                    <TableCell><RoleChip role={user.role} /></TableCell>
                    <TableCell><StatusChip status={user.status} /></TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.addresses?.length ?? 0} address{user.addresses?.length !== 1 ? 'es' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Manage profile & addresses">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/users/${user.id}`)}
                          sx={{
                            bgcolor: 'primary.main', color: '#fff',
                            '&:hover': { bgcolor: 'secondary.main' },
                            width: 32, height: 32,
                          }}
                        >
                          <ArrowForwardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              }
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No users found matching "{search}"</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Layout>
  );
}
