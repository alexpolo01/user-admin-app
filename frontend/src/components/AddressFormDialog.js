import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, FormControlLabel, Switch,
  Typography, Box, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';

const EMPTY = { street: '', city: '', state: '', zipCode: '', country: '', primary: false };

export default function AddressFormDialog({ open, onClose, onSave, address, isFirst }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) setForm({ ...address });
    else setForm({ ...EMPTY, primary: isFirst });
  }, [address, isFirst, open]);

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.street.trim()) errs.street = 'Street is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.zipCode.trim()) errs.zipCode = 'ZIP Code is required';
    if (!form.country.trim()) errs.country = 'Country is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  const isEditing = Boolean(address);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', display: 'flex' }}>
            <HomeIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Typography variant="h6">{isEditing ? 'Edit Address' : 'Add New Address'}</Typography>
          <Box flex={1} />
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Street Address" fullWidth size="small"
              value={form.street} onChange={set('street')}
              error={Boolean(errors.street)} helperText={errors.street}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City" fullWidth size="small"
              value={form.city} onChange={set('city')}
              error={Boolean(errors.city)} helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State / Province" fullWidth size="small"
              value={form.state} onChange={set('state')}
              error={Boolean(errors.state)} helperText={errors.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ZIP / Postal Code" fullWidth size="small"
              value={form.zipCode} onChange={set('zipCode')}
              error={Boolean(errors.zipCode)} helperText={errors.zipCode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Country" fullWidth size="small"
              value={form.country} onChange={set('country')}
              error={Boolean(errors.country)} helperText={errors.country}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.primary || isFirst}
                  disabled={isFirst && !isEditing}
                  onChange={(e) => setForm(f => ({ ...f, primary: e.target.checked }))}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" fontWeight={500}>
                  Set as primary address
                  {(isFirst && !isEditing) && (
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (first address is always primary)
                    </Typography>
                  )}
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditing ? 'Save Changes' : 'Add Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
