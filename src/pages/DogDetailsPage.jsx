import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { addToFavorites, removeFromFavorites } from '../features/favorites/slice';
import dogService from '../services/dogService';

// Styled components
const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const DogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.includes(id);

  useEffect(() => {
    const fetchDogDetails = async () => {
      try {
        setLoading(true);
        const dogs = await dogService.getDogsByIds([id]);
        if (dogs && dogs.length > 0) {
          setDog(dogs[0]);
        } else {
          setError('Dog not found');
        }
      } catch (err) {
        setError('Failed to load dog details. Please try again later.');
        console.error('Error fetching dog details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogDetails();
  }, [id]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites(id));
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Format age for display
  const formatAge = (ageInDays) => {
    if (!ageInDays) return 'Unknown';
    
    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? `, ${months} months` : ''}`;
    } else {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };

  // Generate a random placeholder image based on dog id for consistency
  const getImageUrl = () => {
    if (!dog) return '';
    // Use the first characters of the dog ID to generate a consistent random image
    const seed = dog.id.substring(0, 8);
    return `https://placedog.net/800/500?id=${seed}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 3, pb: 5 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 3, pb: 5 }}>
        <Box my={4}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!dog) {
    return (
      <Container maxWidth="lg" sx={{ pt: 3, pb: 5 }}>
        <Box my={4}>
          <Alert severity="warning">
            <AlertTitle>Not Found</AlertTitle>
            This dog could not be found.
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 5 }}>
      <Box my={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back to Search
        </Button>

        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Grid container>
            {/* Dog Image */}
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="500"
                image={dog.img || getImageUrl()}
                alt={`Photo of ${dog.name}`}
                sx={{ width: '100%', height: '100%', minHeight: { xs: '300px', md: '500px' }, objectFit: 'cover' }}
              />
            </Grid>

            {/* Dog Details */}
            <Grid item xs={12} md={6}>
              <Box p={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h4" component="h1">
                    {dog.name}
                  </Typography>
                  <IconButton
                    onClick={handleToggleFavorite}
                    color={isFavorite ? 'error' : 'default'}
                    size="large"
                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                  >
                    {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
                  </IconButton>
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  <Chip 
                    icon={<PetsIcon />} 
                    label={dog.breed} 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<CalendarTodayIcon />} 
                    label={formatAge(dog.age)} 
                    color="secondary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={dog.size} 
                    variant="outlined" 
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <DetailLabel variant="subtitle2">Breed</DetailLabel>
                    <DetailValue variant="body1">{dog.breed}</DetailValue>

                    <DetailLabel variant="subtitle2">Age</DetailLabel>
                    <DetailValue variant="body1">{formatAge(dog.age)}</DetailValue>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <DetailLabel variant="subtitle2">Size</DetailLabel>
                    <DetailValue variant="body1">{dog.size}</DetailValue>

                    <DetailLabel variant="subtitle2">Location</DetailLabel>
                    <DetailValue variant="body1" display="flex" alignItems="center">
                      <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                      {dog.zip_code}
                    </DetailValue>
                  </Grid>
                </Grid>

                <Box mt={4}>
                  <Button
                    variant="contained"
                    color={isFavorite ? "error" : "primary"}
                    startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={handleToggleFavorite}
                    size="large"
                    fullWidth
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default DogDetailsPage; 