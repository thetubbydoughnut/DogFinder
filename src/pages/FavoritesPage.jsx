import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Zoom,
  Fade,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import MatchIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import { getFavoriteDogs, clearFavorites, generateMatch, clearMatch } from '../features/favorites/slice';
import DogCard from '../features/dogs/components/DogCard';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites, favoriteDogs, isLoading, error, match } = useSelector(
    (state) => state.favorites
  );
  
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchedDog, setMatchedDog] = useState(null);

  // Load favorite dogs on component mount
  useEffect(() => {
    if (favorites.length > 0) {
      dispatch(getFavoriteDogs(favorites));
    }
  }, [dispatch, favorites]);

  // Handle match generation
  const handleGenerateMatch = async () => {
    await dispatch(generateMatch(favorites));
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

  return (
    <Box>
      {/* Header with title and actions */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <FavoriteIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Your Favorite Dogs
          </Typography>
        </Box>

        <Box>
          {favorites.length > 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MatchIcon />}
                sx={{ mr: 2 }}
                onClick={handleGenerateMatch}
                disabled={isLoading || favorites.length < 2}
              >
                Find My Match
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearDialogOpen}
              >
                Clear All
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && favorites.length > 0 ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : favorites.length === 0 ? (
        <Fade in={true} timeout={800}>
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              You haven't added any favorites yet
            </Typography>
            <Typography variant="body1" paragraph>
              Start adding some dogs to your favorites to find your perfect match!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoToSearch}
              sx={{ mt: 2 }}
              startIcon={<SearchIcon />}
            >
              Browse Dogs
            </Button>
          </Paper>
        </Fade>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            You have {favorites.length} dogs in your favorites list
            {favorites.length >= 2 && ". Select 'Find My Match' to generate a match!"}
            {favorites.length === 1 && ". Add at least one more dog to generate a match!"}
          </Typography>

          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            {favoriteDogs.map((dog) => (
              <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3}>
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
      >
        <DialogTitle id="clear-dialog-title">
          Clear All Favorites?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description">
            Are you sure you want to remove all dogs from your favorites list? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearFavorites} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Match result dialog */}
      <Dialog
        open={matchDialogOpen}
        onClose={handleMatchDialogClose}
        aria-labelledby="match-dialog-title"
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle id="match-dialog-title" sx={{ textAlign: 'center' }}>
          <MatchIcon color="primary" sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          Your Perfect Match!
        </DialogTitle>
        <DialogContent>
          {matchedDog ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <DialogContentText sx={{ textAlign: 'center', mb: 2 }}>
                Based on your favorites, we've found your perfect match!
              </DialogContentText>
              <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                <DogCard dog={matchedDog} />
              </Box>
            </Box>
          ) : (
            <DialogContentText sx={{ textAlign: 'center' }}>
              We couldn't find information about your match. Please try again.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleMatchDialogClose}
            color="primary"
            variant="contained"
            size="large"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FavoritesPage; 