import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

// Function to handle JWT authentication
function authenticate(credentials) {
  return fetch("/api/auth/login", {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(credentials)
   }).then(response => response.json());
  // Make a request to your authentication endpoint with the provided credentials
  // Return the JWT token if authentication is successful
  // Example:
  // 
  // Replace the above code with your actual authentication logic

  // For the sake of this example, assume authentication is successful and return a dummy token
  //return Promise.resolve({ token: 'dummy_token' });
}


  export default function SignInSide() {
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const userData = {
        email: data.get('email'),
        password: data.get('password'),
      };
      console.log(userData);
  
      try {
        const response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        console.log(response);
        if (response.ok) {
          const tokenData = await response.json();
          localStorage.setItem('token', tokenData.token);
          console.log('Authentication successful');
          // Redirect or perform any other action upon successful authentication
        } else {
          console.error('Authentication failed.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://cdn.pixabay.com/photo/2015/06/25/14/13/fern-821293_960_720.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            alt="logo"
            src="./images/logo.png"
            sx={{ width: 100, height: 100 }}
          />
          <Typography component="h1" variant="h5">
            Sign in to IoT Plant
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
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
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="SignUp" variant="body2" color="primary">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" align="center">
              {'Author: '}
              <Link color="inherit" href="https://slowik.tech/">
                Bartosz Słowik
              </Link>{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
