import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Badge,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import { logout } from '../../features/auth/slice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo and Title */}
          <PetsIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            Fetch Dog Finder
          </Typography>

          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
              <Button
                component={RouterLink}
                to="/search"
                sx={{ color: 'white' }}
              >
                Search
              </Button>
            </Box>
          )}

          {/* User Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                {/* Favorites Button */}
                <IconButton
                  component={RouterLink}
                  to="/favorites"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  <Badge badgeContent={favoriteCount} color="secondary">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>

                {/* User Display and Logout */}
                <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  {user?.name}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={RouterLink} to="/">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 