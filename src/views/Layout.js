import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Container from '@mui/material/Container';


function Layout() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/SignIn');
  };

  const pages = [
    { label: 'My Plants', path: '/MyPlants' },
    { label: 'NewPlant', path: '/NewPlant' },
    { label: 'Fake History', path: '/SampleHistory' },
  ];
  const settings = [
   // { label: 'Profile', action: () => {} },
   // { label: 'Account', action: () => {} },
  //  { label: 'Dashboard', action: () => {} },
    { label: 'Logout', action: handleSignOut },
  ];
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleOpenNavMenu}
              >
                
              </IconButton>
              <Tooltip title="IOT-PLANT" placement="bottom">
                <Avatar
                  alt="logo"
                  src="./images/logo.png"
                  sx={{ width: 50, height: 50, filter: 'brightness(0) invert(1)',mr: 4,  ml: 1, cursor: 'pointer' }}
                  onClick={handleOpenNavMenu}
                />
              </Tooltip>
            </Box>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              IOT-PLANT
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  sx={{ my: 2, color: 'white', display: 'block', mr: 2 , fontSize: '1.0rem'}}
                >
                  {page.label}
                </Button>
              ))}
            </Box>
            
            
            <IconButton
              size="extra-large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.label} onClick={setting.action}>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      <Menu
        id="nav-menu"
        anchorEl={anchorElNav}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
      >
        {pages.map((page) => (
          <MenuItem key={page.path} onClick={() => { navigate(page.path); handleCloseNavMenu(); }}>
            <Typography textAlign="center">{page.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
      <Box sx={{ mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;