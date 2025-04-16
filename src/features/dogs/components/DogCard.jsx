import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Zoom,
  Grow,
  Skeleton,
  useTheme,
  Badge,
  Paper,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addToFavorites, removeFromFavorites } from '../../favorites/slice';
import { Link as RouterLink } from 'react-router-dom';

// The DogCard component that shows dog information
const DogCard = ({ dog, hideActions = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.includes(dog.id);
  
  const [favoriteHover, setFavoriteHover] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation, setFlipAnimation] = useState(false);

  // Generate a random placeholder image based on dog id for consistency
  const getImageUrl = useCallback(() => {
    // Use the first characters of the dog ID to generate a consistent random image
    const seed = dog.id.substring(0, 8);
    return `https://placedog.net/500/280?id=${seed}`;
  }, [dog.id]);

  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error event
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Still mark as loaded to remove skeleton
  };

  // Preload the image
  useEffect(() => {
    const img = new Image();
    img.onload = handleImageLoad;
    img.onerror = handleImageError;
    img.src = dog.img || getImageUrl();

    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [dog.img, getImageUrl]);

  // Toggle favorite status
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(dog.id));
    } else {
      dispatch(addToFavorites(dog.id));
    }
  };

  // Handle card flip
  const handleFlipCard = (e) => {
    e.stopPropagation();
    setFlipAnimation(true);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setTimeout(() => {
        setFlipAnimation(false);
      }, 300);
    }, 150);
  };

  // Format age from days to years/months
  const formatAge = (ageInDays) => {
    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? `, ${months} ${months === 1 ? 'month' : 'months'}` : ''}`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${ageInDays} ${ageInDays === 1 ? 'day' : 'days'}`;
    }
  };

  // Get age category for badge
  const getAgeCategory = (ageInDays) => {
    if (ageInDays < 365) {
      return { label: 'Puppy', color: 'success' };
    } else if (ageInDays < 365 * 8) {
      return { label: 'Adult', color: 'primary' };
    } else {
      return { label: 'Senior', color: 'secondary' };
    }
  };

  const ageCategory = getAgeCategory(dog.age);

  // Calculate transform style based on flip state
  const getCardTransform = () => {
    const baseTransform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0)';
    const scaleEffect = flipAnimation ? 'scale(0.95)' : 'scale(1)';
    return `${baseTransform} ${scaleEffect}`;
  };

  return (
    <Grow in={true} timeout={300}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 350,
          perspective: '1000px',
        }}
      >
        <Card
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 3,
            overflow: 'visible',
            transition: 'transform 0.6s, box-shadow 0.3s',
            transformStyle: 'preserve-3d',
            boxShadow: isFlipped
              ? '0 10px 30px rgba(0, 0, 0, 0.25)'
              : '0 6px 20px rgba(0, 0, 0, 0.15)',
            transform: getCardTransform(),
            '&:hover': {
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          {/* FRONT SIDE */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            {/* Dog image with loading skeleton */}
            <Box sx={{ position: 'relative', width: '100%', height: 180 }}>
              {!imageLoaded && (
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={180} 
                  animation="wave"
                  sx={{ position: 'absolute', top: 0, left: 0 }}
                />
              )}
              <CardMedia
                component="img"
                height="180"
                image={imageError ? getImageUrl() : dog.img || getImageUrl()}
                alt={dog.name}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sx={{ 
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  objectFit: 'cover',
                }}
              />
              
              {/* Age badge */}
              <Chip
                label={ageCategory.label}
                color={ageCategory.color}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </Box>
            
            <CardContent sx={{ pb: 0 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {dog.name}
                </Typography>
                
                {!hideActions && (
                  <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                    <IconButton 
                      size="small" 
                      color={isFavorite ? "error" : "default"}
                      onClick={handleToggleFavorite}
                      onMouseEnter={() => setFavoriteHover(true)}
                      onMouseLeave={() => setFavoriteHover(false)}
                      sx={{ 
                        mt: -0.5,
                        transition: 'transform 0.3s ease-in-out',
                        transform: favoriteHover ? 'scale(1.2)' : 'scale(1)',
                      }}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <PetsIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-top' }} />
                {dog.breed}
              </Typography>
              
              <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
                <CakeIcon sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  {formatAge(dog.age)}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  {dog.zip_code}
                </Typography>
              </Box>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Button
                size="small"
                component={RouterLink}
                to={`/dog/${dog.id}`}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 'medium',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                View Details
              </Button>
              
              <Tooltip title="View more information">
                <IconButton
                  size="small"
                  onClick={handleFlipCard}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Box>
          
          {/* BACK SIDE */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              borderRadius: 3,
              transform: 'rotateY(180deg)',
              backgroundColor: theme.palette.background.paper,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: theme.palette.primary.main, 
                color: theme.palette.primary.contrastText,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" component="div" fontWeight="bold">
                {dog.name}'s Profile
              </Typography>
              <IconButton 
                size="small" 
                onClick={handleFlipCard}
                sx={{ color: theme.palette.primary.contrastText }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>
            
            {/* Content */}
            <Box sx={{ p: 2, flexGrow: 1 }}>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Box 
                  component="img"
                  src={imageError ? getImageUrl() : dog.img || getImageUrl()}
                  alt={dog.name}
                  sx={{ 
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    mr: 2,
                    objectFit: 'cover',
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {dog.breed}
                  </Typography>
                  <Chip 
                    label={ageCategory.label}
                    color={ageCategory.color}
                    size="small"
                    sx={{ fontWeight: 'medium', mt: 0.5 }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Dog attributes */}
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Age
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                {formatAge(dog.age)}
              </Typography>
              
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Location
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {dog.zip_code}
              </Typography>
              
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Compatibility
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                <Chip 
                  label="Kid-friendly" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
                <Chip 
                  label="Trained" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
                <Chip 
                  label="Playful" 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
            
            {/* Footer */}
            <Box sx={{ p: 2, mt: 'auto' }}>
              <Button
                fullWidth
                variant="contained"
                component={RouterLink}
                to={`/dogs/${dog.id}`}
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                View Full Profile
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Grow>
  );
};

export default DogCard; 