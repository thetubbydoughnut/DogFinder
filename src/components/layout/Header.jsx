import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  useTheme,
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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../../features/auth/slice';

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
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
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
    await dispatch(logout());
    navigate('/');
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
      <HideOnScroll {...props}>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
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
                      color: theme.palette.primary.main,
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
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      letterSpacing: '-0.5px',
                      fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    }}
                  >
                    Fetch Dog Finder
                  </Typography>
                </Box>
              </Fade>

              {/* Mobile Menu Toggle - Only on mobile when authenticated */}
              {isAuthenticated && isMobile && (
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
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
                        color: isActive('/search') ? theme.palette.primary.main : theme.palette.text.primary,
                        borderBottom: isActive('/search') ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        borderRadius: 0,
                        paddingBottom: '4px',
                        paddingTop: '4px',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          borderBottom: `2px solid ${theme.palette.primary.light}`,
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
                        color: isActive('/favorites') ? theme.palette.primary.main : theme.palette.text.primary,
                        borderBottom: isActive('/favorites') ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        borderRadius: 0,
                        paddingBottom: '4px',
                        paddingTop: '4px',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          borderBottom: `2px solid ${theme.palette.primary.light}`,
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      My Favorites
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* User Menu - Only on desktop when authenticated */}
              {isAuthenticated && !isMobile && (
                <Fade in={mounted} timeout={1200}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleUserMenuOpen}
                        size="small"
                        sx={{ 
                          ml: 2,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }}
                        aria-controls={userMenuOpen ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={userMenuOpen ? 'true' : undefined}
                      >
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: theme.palette.primary.main,
                            fontWeight: 'bold',
                          }}
                        >
                          {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={userMenuAnchor}
                      id="account-menu"
                      open={userMenuOpen}
                      onClose={handleUserMenuClose}
                      onClick={handleUserMenuClose}
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
                      <MenuItem sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <PersonIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={user?.name}
                          secondary={user?.email}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <Typography>Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                </Fade>
              )}

              {/* Login Button - Only when not authenticated */}
              {!isAuthenticated && (
                <Fade in={mounted} timeout={1000}>
                  <Button 
                    variant="contained" 
                    component={RouterLink}
                    to="/"
                    sx={{ 
                      ml: 'auto',
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
        {user && (
          <Box sx={{ mb: 3, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  fontWeight: 'bold',
                  width: 48,
                  height: 48,
                  mr: 2
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="600">{user.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <List>
          <ListItem 
            button 
            onClick={() => handleNavigate('/search')}
            selected={isActive('/search')}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.main}15`,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}25`,
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
                backgroundColor: `${theme.palette.primary.main}15`,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}25`,
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
              color: theme.palette.error.main
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