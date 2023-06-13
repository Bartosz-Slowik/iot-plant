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

const pages = ['AddPlant', 'MyPlants', 'Store', 'About'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <Avatar
                alt="logo"
                src="./images/logo.png"
                sx={{ width: 50, height: 50 }}
              />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              IOT-PLANT
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Button
                onClick={() => navigate('/my-plants')}
                sx={{ my: 2, color: 'white', display: 'block', mr: 2 }}
              >
                My Plants
              </Button>
              <Button
                onClick={() => navigate('/plant')}
                sx={{ my: 2, color: 'white', display: 'block', mr: 2 }}
              >
                Plant
              </Button>
              <Button
                onClick={() => navigate('/plant-history')}
                sx={{ my: 2, color: 'white', display: 'block', mr: 2 }}
              >
                Plant History
              </Button>
            </Box>
            <IconButton
              size="large"
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
              <MenuItem onClick={handleSignOut}>
                <Typography textAlign="center">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;