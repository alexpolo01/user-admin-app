import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, TextField,
  Button, IconButton, Tooltip, Alert, Stack, Divider,
  MenuItem, Chip, Skeleton, Snackbar, Badge,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import Layout from '../components/Layout';
import AddressFormDialog from '../components/AddressFormDialog';
import { StatusChip, RoleChip } from '../components/StatusChip';
import { userService, addressService } from '../services/api';

const ROLES = ['Admin', 'Editor', 'Viewer'];
const STATUSES = ['Active', 'Inactive'];

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Profile editing state
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileErrors, setProfileErrors] = useState({});

  // Address dialog state
  const [addrDialog, setAddrDialog] = useState({ open: false, address: null });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const loadUser = useCallback(() => {
    setLoading(true);
    userService.getById(id)
      .then(data => {
        setUser(data);
        setProfileForm({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          status: data.status,
        });
      })
      .catch(() => setError('Failed to load user. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { loadUser(); }, [loadUser]);

  const validateProfile = () => {
    const errs = {};
    if (!profileForm.email?.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) errs.email = 'Invalid email format';
    if (!profileForm.firstName?.trim()) errs.firstName = 'First name is required';
    if (!profileForm.lastName?.trim()) errs.lastName = 'Last name is required';
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    setSaving(true);
    try {
      const updated = await userService.update(id, profileForm);
      setUser(u => ({ ...u, ...updated }));
      setProfileEditing(false);
      showToast('Profile updated successfully');
    } catch {
      showToast('Failed to save profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = () => {
    setProfileForm({
      email: user.email, firstName: user.firstName,
      lastName: user.lastName, role: user.role, status: user.status,
    });
    setProfileErrors({});
    setProfileEditing(false);
  };

  const handleSaveAddress = async (formData) => {
    try {
      const { address } = addrDialog;
      if (address) {
        await addressService.update(id, address.id, formData);
        showToast('Address updated');
      } else {
        await addressService.add(id, formData);
        showToast('Address added');
      }
      setAddrDialog({ open: false, address: null });
      loadUser();
    } catch {
      showToast('Failed to save address', 'error');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await addressService.delete(id, addressId);
      showToast('Address removed');
      loadUser();
    } catch {
      showToast('Failed to delete address', 'error');
    }
  };

  if (loading) return (
    <Layout>
      <Skeleton variant="rounded" height={60} sx={{ mb: 3 }} />
      <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={300} />
    </Layout>
  );

  if (error) return (
    <Layout>
      <Alert severity="error" action={
        <Button size="small" onClick={() => navigate('/users')}>Back to list</Button>
      }>{error}</Alert>
    </Layout>
  );

  return (
    <Layout>
      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
          variant="text" color="inherit" size="small"
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          All Users
        </Button>
        <Typography color="text.secondary">/</Typography>
        <Typography variant="body2" fontWeight={600}>
          {user.firstName} {user.lastName}
        </Typography>
      </Stack>

      {/* Page header */}
      <Box mb={3} display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
          <Stack direction="row" spacing={1} mt={1}>
            <RoleChip role={user.role} />
            <StatusChip status={user.status} />
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Profile Information</Typography>
                {!profileEditing && (
                  <Tooltip title="Edit profile">
                    <IconButton size="small" onClick={() => setProfileEditing(true)}
                      sx={{ bgcolor: '#f3f4f6', '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Stack spacing={2.5}>
                <TextField
                  label="First Name" size="small" fullWidth
                  value={profileForm.firstName || ''}
                  onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                  error={Boolean(profileErrors.firstName)}
                  helperText={profileErrors.firstName}
                  disabled={!profileEditing}
                />
                <TextField
                  label="Last Name" size="small" fullWidth
                  value={profileForm.lastName || ''}
                  onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                  error={Boolean(profileErrors.lastName)}
                  helperText={profileErrors.lastName}
                  disabled={!profileEditing}
                />
                <TextField
                  label="Email" size="small" fullWidth
                  value={profileForm.email || ''}
                  onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                  error={Boolean(profileErrors.email)}
                  helperText={profileErrors.email}
                  disabled={!profileEditing}
                />
                <TextField
                  select label="Role" size="small" fullWidth
                  value={profileForm.role || ''}
                  onChange={e => setProfileForm(f => ({ ...f, role: e.target.value }))}
                  disabled={!profileEditing}
                >
                  {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
                <TextField
                  select label="Status" size="small" fullWidth
                  value={profileForm.status || ''}
                  onChange={e => setProfileForm(f => ({ ...f, status: e.target.value }))}
                  disabled={!profileEditing}
                >
                  {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Stack>

              {profileEditing && (
                <Stack direction="row" spacing={1.5} mt={3}>
                  <Button
                    variant="contained" startIcon={<SaveIcon />}
                    onClick={handleSaveProfile} disabled={saving} fullWidth
                  >
                    {saving ? 'Saving…' : 'Save Profile'}
                  </Button>
                  <Button variant="outlined" onClick={handleCancelProfile} color="inherit">
                    Cancel
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Addresses Card */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">Addresses</Typography>
                  <Chip
                    label={user.addresses?.length ?? 0}
                    size="small"
                    sx={{ bgcolor: 'primary.main', color: '#fff', height: 22, fontSize: '0.72rem' }}
                  />
                </Box>
                <Button
                  variant="contained" size="small" startIcon={<AddIcon />}
                  onClick={() => setAddrDialog({ open: true, address: null })}
                >
                  Add Address
                </Button>
              </Box>

              {(!user.addresses || user.addresses.length === 0) ? (
                <Box sx={{
                  border: '2px dashed', borderColor: 'divider',
                  borderRadius: 2, p: 5, textAlign: 'center',
                }}>
                  <HomeIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">
                    No addresses yet. Click "Add Address" to get started.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {user.addresses.map((addr, idx) => (
                    <Box key={addr.id} sx={{
                      border: '1px solid',
                      borderColor: addr.primary ? 'primary.main' : 'divider',
                      borderRadius: 2, p: 2.5,
                      bgcolor: addr.primary ? 'rgba(26,26,46,0.03)' : 'transparent',
                      position: 'relative',
                    }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                            {addr.primary
                              ? <StarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                              : <StarBorderIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                            }
                            <Typography variant="body2" fontWeight={700} color={addr.primary ? 'primary.main' : 'text.primary'}>
                              {addr.primary ? 'Primary Address' : `Address ${idx + 1}`}
                            </Typography>
                          </Stack>
                          <Typography variant="body2">{addr.street}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {addr.city}, {addr.state} {addr.zipCode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">{addr.country}</Typography>
                        </Box>

                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit address">
                            <IconButton size="small"
                              onClick={() => setAddrDialog({ open: true, address: addr })}
                              sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove address">
                            <IconButton size="small"
                              onClick={() => handleDeleteAddress(addr.id)}
                              sx={{ '&:hover': { bgcolor: '#fee2e2', color: '#dc2626' } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AddressFormDialog
        open={addrDialog.open}
        address={addrDialog.address}
        isFirst={!user.addresses || user.addresses.length === 0}
        onClose={() => setAddrDialog({ open: false, address: null })}
        onSave={handleSaveAddress}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast(t => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast(t => ({ ...t, open: false }))} sx={{ borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
