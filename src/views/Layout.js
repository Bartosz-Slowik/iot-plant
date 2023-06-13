import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Layout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate("/signin");
  };

  if (!token) {
    return <Navigate to="/signin" />;
  }

  try {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Container>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                My App
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  onClick={() => navigate("/myplants")}
                  sx={{ my: 2, color: 'white', display: 'block', mr: 2 }}
                >
                  My Plants
                </Button>
                <Button
                  onClick={() => navigate("/plant")}
                  sx={{ my: 2, color: 'white', display: 'block', mr: 2 }}
                >
                  Plant
                </Button>
                <Button
                  onClick={() => navigate("/planthistory")}
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
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
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
          {children}
        </Box>
      </Box>
    );
  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/SignIn" />;
  }
};

export default Layout;