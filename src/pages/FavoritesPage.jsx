import React, { useEffect } from 'react';
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
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFavoriteDogs, clearFavorites, generateMatch } from '../features/favorites/slice';
import DogCard from '../features/dogs/components/DogCard';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites, favoriteDogs, isLoading, error, match } = useSelector(
    (state) => state.favorites
  );

  // Load favorite dogs on component mount
  useEffect(() => {
    if (favorites.length > 0) {
      dispatch(getFavoriteDogs(favorites));
    }
  }, [dispatch, favorites]);

  const handleGenerateMatch = () => {
    dispatch(generateMatch(favorites));
  };

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
  };

  const handleGoToSearch = () => {
    navigate('/search');
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={3}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Your Favorite Dogs
        </Typography>

        <Box>
          {favorites.length > 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FavoriteIcon />}
                sx={{ mr: 2 }}
                onClick={handleGenerateMatch}
                disabled={isLoading}
              >
                Find a Match
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearFavorites}
              >
                Clear All
              </Button>
            </>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {match && (
        <Alert severity="success" sx={{ mb: 3 }}>
          You've been matched with a dog! Dog ID: {match}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : favorites.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
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
          >
            Browse Dogs
          </Button>
        </Paper>
      ) : (
        <>
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
    </Box>
  );
};

export default FavoritesPage; 