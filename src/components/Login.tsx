import React, { useState } from 'react';
import { LoginContextType } from '../contexts/LoginContext';
import logo from '../assets/logo.svg';
import { Grid, 
  Typography, Box, Select, MenuItem, Collapse,
  TextField, Alert
 } from '@mui/material';
import {LoadingButton} from '@mui/lab';
import { useLogin } from '../hooks';
import { User } from '../types';

interface Props {
  setUserLoginContext: (s: LoginContextType) => void;
  setLoggedInUser: (u: User) => void;
}

export function Login({setUserLoginContext, setLoggedInUser}: Props){

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [validating, setIsValidating] = useState<boolean>(false);
  const [selectedLoginType, setSelectedLoginType] = useState<LoginContextType>(null);
  const [validateAdmin, validateStudent] = useLogin();

  function handleSelectChange({target: {value}}: any){
    setSelectedLoginType(value);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setIsValidating(true);
    const data = new FormData(e.currentTarget);
    const email= data.get('email')?.toString();
    const password = data.get('password')?.toString();

    const validatingMethod = selectedLoginType === 'Admin' ? validateAdmin : validateStudent;
    const [valid, user] = validatingMethod(email, password);
    postSubmit(valid, user);
  }
  function postSubmit(valid: boolean, user: User|null){
    if(!valid){
      setShowAlert(true)
      setIsValidating(false);
      return;
    }
    
    setUserLoginContext(selectedLoginType);
    setLoggedInUser(user!);
  }
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={4}
    >
      <Grid item>
        <img height="30px" src={logo} alt="Western Library Logo" />
      </Grid>
      <Grid item>
        <Typography>
          Login to access the Library Space Booking System
        </Typography>
      </Grid>
      <Grid item>
        <Box 
          sx={{
            width: 500,
            boxShadow: '0 0 3px #ccc',
            padding: 5,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography>
            Are you a student or administrator?
          </Typography>
          <Select 
          disabled={validating}
          value={selectedLoginType || ''} onChange={handleSelectChange}>
            <MenuItem value={'Student'}>
              Student
            </MenuItem>
            <MenuItem value={'Admin'}>
              Admin
            </MenuItem>
          </Select>
          <Collapse in={!!selectedLoginType}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Typography component="h4">
            Please sign in
          </Typography>
            <TextField
              disabled={validating}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              disabled={validating}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {showAlert && 
              <Alert severity='error' onClose={() => setShowAlert(false)}>
                <Typography>
                  Login failed! Invalid email or password.
                </Typography>
              </Alert>
            }
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={validating}
              loadingIndicator="SIGNING IN..."
            >
              SIGN In
            </LoadingButton>
          </Box>
          </Collapse>
        </Box>
      </Grid>
    </Grid>
  )
}