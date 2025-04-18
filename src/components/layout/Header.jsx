import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme as useMuiTheme,
  useScrollTrigger,
  useMediaQuery,
  Slide,
  Fade,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../context/ThemeContext';

// Hide AppBar on scroll down, show on scroll up
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = (props) => {
  const muiTheme = useMuiTheme();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const { isAuthenticated, user, logout } = useAuth0();
  const { favorites } = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchor);
  const [mounted, setMounted] = useState(false);
  
  // Set mounted after first render for animations
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    setMobileMenuOpen(false);
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };
  
  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };
  
  // Determine if the current route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Add a spacer to prevent content from being hidden under the fixed header */}
      {isAuthenticated && <Box sx={{ height: { xs: 64, md: 70 } }} />}
      
      <HideOnScroll {...props}>
        <AppBar 
          position="fixed"
          elevation={2}
          sx={{
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: muiTheme.palette.background.paper,
            color: muiTheme.palette.text.primary,
            borderBottom: `1px solid ${muiTheme.palette.divider}`,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                py: 1,
                minHeight: { xs: 64, md: 70 }
              }}
            >
              {/* Logo and Title - Always visible */}
              <Fade in={mounted} timeout={800}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <PetsIcon 
                    sx={{ 
                      mr: 1, 
                      color: muiTheme.palette.primary.main,
                      fontSize: { xs: 28, md: 32 },
                      animation: 'bounce 2s infinite',
                      '@keyframes bounce': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-5px)' },
                      },
                    }} 
                  />
                  <Typography
                    variant="h5"
                    component={RouterLink}
                    to={isAuthenticated ? "/search" : "/"}
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      color: muiTheme.palette.primary.main,
                      textDecoration: 'none',
                      letterSpacing: '-0.5px',
                      fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    }}
                  >
                    Dog Finder
                  </Typography>
                </Box>
              </Fade>

              {/* Mobile Menu Toggle - Only on mobile when authenticated */}
              {isAuthenticated && isMobile && (
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                  {/* Theme Toggle - Mobile */}
                  <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                    <IconButton 
                      onClick={toggleTheme}
                      color="inherit"
                      sx={{ mr: 1 }}
                    >
                      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                  </Tooltip>
                  
                  {/* Favorites Button on Mobile */}
                  <Tooltip title="Your Favorites">
                    <IconButton
                      component={RouterLink}
                      to="/favorites"
                      color={isActive('/favorites') ? 'primary' : 'default'}
                      sx={{ 
                        mr: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <Badge 
                        badgeContent={favoriteCount} 
                        color="secondary"
                        overlap="circular"
                        sx={{
                          '& .MuiBadge-badge': {
                            animation: favoriteCount > 0 ? 'pulse 1.5s infinite' : 'none',
                            '@keyframes pulse': {
                              '0%': { transform: 'scale(1)' },
                              '50%': { transform: 'scale(1.2)' },
                              '100%': { transform: 'scale(1)' },
                            },
                          }
                        }}
                      >
                        <FavoriteIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <IconButton 
                    edge="end" 
                    color="primary" 
                    aria-label="menu"
                    onClick={handleMobileMenuToggle}
                  >
                    {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                  </IconButton>
                </Box>
              )}

              {/* Desktop Navigation - Only when authenticated and on desktop */}
              {isAuthenticated && !isMobile && (
                <Fade in={mounted} timeout={1000}>
                  <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                    <Button
                      component={RouterLink}
                      to="/search"
                      startIcon={<SearchIcon />}
                      sx={{ 
                        mr: 2,
                        fontWeight: 500,
                        color: isActive('/search') ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                        borderBottom: isActive('/search') ? `2px solid ${muiTheme.palette.primary.main}` : '2px solid transparent',
                        borderRadius: 0,
                        paddingBottom: '4px',
                        paddingTop: '4px',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          borderBottom: `2px solid ${muiTheme.palette.primary.light}`,
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      Search Dogs
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/favorites"
                      startIcon={
                        <Badge 
                          badgeContent={favoriteCount} 
                          color="secondary"
                          overlap="circular"
                          sx={{
                            '& .MuiBadge-badge': {
                              animation: favoriteCount > 0 ? 'pulse 1.5s infinite' : 'none',
                              '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.2)' },
                                '100%': { transform: 'scale(1)' },
                              },
                            }
                          }}
                        >
                          <FavoriteIcon />
                        </Badge>
                      }
                      sx={{ 
                        fontWeight: 500,
                        color: isActive('/favorites') ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                        borderBottom: isActive('/favorites') ? `2px solid ${muiTheme.palette.primary.main}` : '2px solid transparent',
                        borderRadius: 0,
                        paddingBottom: '4px',
                        paddingTop: '4px',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          borderBottom: `2px solid ${muiTheme.palette.primary.light}`,
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      My Favorites
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Theme Toggle - Desktop */}
              {!isMobile && (
                <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                  <IconButton 
                    onClick={toggleTheme}
                    color="inherit"
                    sx={{ 
                      ml: 2,
                      transition: 'all 0.3s ease',
                      animation: mounted ? 'rotate 1s ease-out' : 'none',
                      '@keyframes rotate': {
                        '0%': { transform: 'rotate(-30deg)' },
                        '100%': { transform: 'rotate(0deg)' },
                      }
                    }}
                  >
                    {mode === 'dark' ? (
                      <Brightness7Icon sx={{ color: '#FFC107' }} />
                    ) : (
                      <Brightness4Icon sx={{ color: '#5C6BC0' }} />
                    )}
                  </IconButton>
                </Tooltip>
              )}

              {/* User Menu - Only on desktop when authenticated */}
              {isAuthenticated && !isMobile && (
                <Fade in={mounted} timeout={1200}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Account Settings">
                      <IconButton onClick={handleUserMenuOpen} size="small">
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            bgcolor: muiTheme.palette.primary.main, 
                            fontSize: '1.1rem' 
                          }} 
                          alt={user?.name || 'User'}
                          src={user?.picture}
                        >
                          {!user?.picture && user?.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={userMenuAnchor}
                      open={userMenuOpen}
                      onClose={handleUserMenuClose}
                      PaperProps={{
                        elevation: 4,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                          mt: 1.5,
                          borderRadius: 2,
                          width: 200,
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Avatar 
                          sx={{ width: 60, height: 60, margin: 'auto', mb: 1, bgcolor: muiTheme.palette.secondary.main }}
                          alt={user?.name || 'User'}
                          src={user?.picture}
                        >
                          {!user?.picture && user?.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user?.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user?.email}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </Fade>
              )}

              {/* Login Button - Only when not authenticated */}
              {!isAuthenticated && (
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                  {/* Theme Toggle for Not Authenticated */}
                  <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                    <IconButton 
                      onClick={toggleTheme}
                      color="inherit"
                      sx={{ 
                        mr: 2,
                        transition: 'all 0.3s ease',
                        animation: mounted ? 'rotate 1s ease-out' : 'none',
                        '@keyframes rotate': {
                          '0%': { transform: 'rotate(-30deg)' },
                          '100%': { transform: 'rotate(0deg)' },
                        }
                      }}
                    >
                      {mode === 'dark' ? (
                        <Brightness7Icon sx={{ color: '#FFC107' }} />
                      ) : (
                        <Brightness4Icon sx={{ color: '#5C6BC0' }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  
                  <Fade in={mounted} timeout={1000}>
                    <Button 
                      variant="contained" 
                      component={RouterLink}
                      to="/"
                      sx={{ 
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 3,
                        boxShadow: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </Fade>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '75%',
            maxWidth: 300,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            px: 2,
          }
        }}
      >
        <Box 
          sx={{ 
            py: 3, 
            px: 1, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" fontWeight="600">Menu</Typography>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {/* User Profile Section */}
        {isAuthenticated && (
          <Box sx={{ mb: 3, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: muiTheme.palette.primary.main,
                  fontWeight: 'bold',
                  width: 48,
                  height: 48,
                  mr: 2
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="600">{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <List>
          {/* Theme Toggle in Mobile Menu */}
          <ListItem 
            button 
            onClick={toggleTheme}
            sx={{ 
              borderRadius: 2,
              mb: 1,
            }}
          >
            <ListItemIcon>
              {mode === 'dark' ? (
                <Brightness7Icon sx={{ color: '#FFC107' }} />
              ) : (
                <Brightness4Icon sx={{ color: '#5C6BC0' }} />
              )}
            </ListItemIcon>
            <ListItemText primary={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`} />
            <Switch 
              checked={mode === 'dark'}
              onChange={toggleTheme}
              size="small"
            />
          </ListItem>
          
          <ListItem 
            button 
            onClick={() => handleNavigate('/search')}
            selected={isActive('/search')}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: `${muiTheme.palette.primary.main}15`,
                color: muiTheme.palette.primary.main,
                '&:hover': {
                  backgroundColor: `${muiTheme.palette.primary.main}25`,
                }
              }
            }}
          >
            <ListItemIcon>
              <SearchIcon color={isActive('/search') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Search Dogs" />
          </ListItem>
          
          <ListItem 
            button 
            onClick={() => handleNavigate('/favorites')}
            selected={isActive('/favorites')}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: `${muiTheme.palette.primary.main}15`,
                color: muiTheme.palette.primary.main,
                '&:hover': {
                  backgroundColor: `${muiTheme.palette.primary.main}25`,
                }
              }
            }}
          >
            <ListItemIcon>
              <Badge 
                badgeContent={favoriteCount} 
                color="secondary"
              >
                <FavoriteIcon color={isActive('/favorites') ? 'primary' : 'inherit'} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="My Favorites" />
          </ListItem>
          
          <Divider sx={{ my: 2 }} />
          
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              borderRadius: 2,
              color: muiTheme.palette.error.main
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Header; 