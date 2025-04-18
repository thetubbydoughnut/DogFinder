import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Zoom,
  Fade,
  Container,
  useTheme,
  useMediaQuery,
  Tooltip,
  Stack,
  Slide,
  LinearProgress,
  Badge,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import MatchIcon from '@mui/icons-material/Pets';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { getFavoriteDogs, clearFavorites, generateMatch, clearMatch } from '../features/favorites/slice';
import DogCard from '../features/dogs/components/DogCard';
import DogCardSkeleton from '../features/dogs/components/DogCardSkeleton';
import MatchResult from '../features/favorites/components/MatchResult';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import useApiErrorHandler from '../hooks/useApiErrorHandler';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get favorites state from Redux
  const { favorites, favoriteDogs, isLoading, error, match } = useSelector(
    (state) => state.favorites
  );
  // Get auth state from Auth0
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchedDog, setMatchedDog] = useState(null);
  const [isMatchGenerating, setIsMatchGenerating] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  
  // Use API error handler hook
  const { retryApiCall } = useApiErrorHandler({
    maxRetries: 3,
    initialDelay: 1500,
  });

  // Fetch favorite dogs when component mounts or dependencies change
  useEffect(() => {
    const fetchFavorites = () => {
      if (favorites.length > 0) {
        // Fetching logic remains the same, relying on the favorites slice thunk
        dispatch(getFavoriteDogs(favorites)); 
      } else {
        // If no favorites, ensure local state is cleared (if using local state for dogs)
        // setFavoriteDogs([]); // Example if local state was used
        // setLoading(false); // Example if local state was used
      }
    };

    // Only fetch if authenticated and Auth0 is not loading
    if (!isAuthLoading && isAuthenticated) {
      fetchFavorites();
    } else if (!isAuthLoading && !isAuthenticated) {
      // Optionally clear Redux favorites state if user logs out
      // dispatch(clearFavorites()); // Uncomment if this is desired behavior
      // Clear local state if used
    }
    
    // Start animation after a slight delay, regardless of auth state
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 300);
    
    return () => clearTimeout(timer);
    // Add isAuthLoading to dependency array
  }, [dispatch, favorites, isAuthenticated, isAuthLoading]);

  // Handle match generation
  const handleGenerateMatch = async () => {
    setIsMatchGenerating(true);
    await dispatch(generateMatch(favorites));
    setIsMatchGenerating(false);
    setMatchDialogOpen(true);
  };

  // When match changes, find the matching dog
  useEffect(() => {
    if (match) {
      const dogMatch = favoriteDogs.find(dog => dog.id === match);
      setMatchedDog(dogMatch);
    } else {
      setMatchedDog(null);
    }
  }, [match, favoriteDogs]);

  // Handle clearing favorites confirmation
  const handleClearDialogOpen = () => {
    setShowClearDialog(true);
  };

  const handleClearDialogClose = () => {
    setShowClearDialog(false);
  };

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
    setShowClearDialog(false);
  };

  // Handle match dialog close
  const handleMatchDialogClose = () => {
    setMatchDialogOpen(false);
    setTimeout(() => {
      dispatch(clearMatch());
    }, 300); // Clear match after dialog animation finishes
  };

  const handleGoToSearch = () => {
    navigate('/search');
  };
  
  // Handle retry loading favorites
  const handleRetryLoadFavorites = () => {
    if (favorites.length > 0) {
      retryApiCall(() => dispatch(getFavoriteDogs(favorites)));
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(4)).map((_, index) => (
          <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
            <DogCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 3, pb: 5 }}>
      {/* Header with title and actions */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          my: 3, 
          borderRadius: 2,
          background: `linear-gradient(145deg, ${theme.palette.primary.light}20, ${theme.palette.background.paper})`,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={1}
        >
          <Slide direction="right" in={true} timeout={600}>
            <Box display="flex" alignItems="center">
              <Badge
                badgeContent={favorites.length} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.9rem',
                    height: 22,
                    minWidth: 22,
                  }
                }}
              >
                <FavoriteIcon 
                  color="error" 
                  sx={{ 
                    mr: 1.5, 
                    fontSize: '2rem',
                    animation: favorites.length > 0 ? `${theme.transitions.create('transform', {
                      duration: 700,
                    })} pulse 1.5s infinite` : 'none',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                      '100%': { transform: 'scale(1)' },
                    }
                  }} 
                />
              </Badge>
              <Typography variant="h4" component="h1" fontWeight="500">
                Your Favorite Dogs
              </Typography>
            </Box>
          </Slide>

          <Slide direction="left" in={true} timeout={600}>
            <Box>
              {favorites.length > 0 && (
                <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                  <Tooltip title={favorites.length < 2 ? "Add at least one more dog to find a match" : "Find your perfect match!"}>
                    <span>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={isMatchGenerating ? <ShuffleIcon /> : <MatchIcon />}
                        onClick={handleGenerateMatch}
                        disabled={isLoading || isMatchGenerating || favorites.length < 2}
                        sx={{
                          boxShadow: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: 5,
                          },
                        }}
                      >
                        {isMatchGenerating ? "Generating..." : "Find My Match"}
                      </Button>
                    </span>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleClearDialogOpen}
                    sx={{
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        backgroundColor: 'error.light',
                        color: 'white',
                      }
                    }}
                  >
                    Clear All
                  </Button>
                </Stack>
              )}
            </Box>
          </Slide>
        </Box>
        
        {favorites.length > 0 && (
          <Fade in={true} timeout={1000}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
              {favorites.length >= 2 
                ? `You have ${favorites.length} dogs in your favorites. Ready to find your perfect match!` 
                : `You have ${favorites.length} dog in your favorites. Add at least one more to generate a match!`}
            </Typography>
          </Fade>
        )}
      </Paper>

      {/* Error display */}
      {error && !isLoading && (
        <ErrorState 
          type="api"
          title="Failed to Load Favorites"
          message={error}
          onRetry={handleRetryLoadFavorites}
          actionText="Try Again"
        />
      )}

      {/* Loading state */}
      {isLoading && favorites.length > 0 ? (
        <Box sx={{ width: '100%', my: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            Fetching your favorite dogs...
          </Typography>
          <LinearProgress color="primary" sx={{ height: 6, borderRadius: 3, mb: 4 }} />
          {renderSkeletons()}
        </Box>
      ) : favorites.length === 0 ? (
        <EmptyState
          type="favorites"
          primaryAction={handleGoToSearch}
          primaryActionText="Browse Dogs"
          message="Start adding some dogs to your favorites to find your perfect match! Our sophisticated matching algorithm will help you find the dog that's right for you."
          elevation={3}
        />
      ) : (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            {favoriteDogs.map((dog, index) => (
              <Grid 
                item 
                key={dog.id} 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
                sx={{
                  opacity: animateItems ? 1 : 0,
                  transform: animateItems ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${index * 0.1}s`
                }}
              >
                <DogCard dog={dog} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Clear favorites confirmation dialog */}
      <Dialog
        open={showClearDialog}
        onClose={handleClearDialogClose}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle id="clear-dialog-title" sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center">
            <DeleteIcon color="error" sx={{ mr: 1 }} />
            Clear All Favorites?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description">
            Are you sure you want to remove all dogs from your favorites list? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleClearDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleClearFavorites} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Use our new MatchResult component */}
      <MatchResult 
        open={matchDialogOpen} 
        onClose={handleMatchDialogClose} 
        matchedDog={matchedDog} 
      />
    </Container>
  );
};

export default FavoritesPage; 