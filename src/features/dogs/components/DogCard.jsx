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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { addToFavorites, removeFromFavorites } from '../../favorites/slice';
import { Link as RouterLink } from 'react-router-dom';

const DogCard = ({ dog, hideActions = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.includes(dog.id);
  
  const [favoriteHover, setFavoriteHover] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Consider it "loaded" even though it failed, to remove skeleton
  };

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = dog.img || getImageUrl();
    img.onload = handleImageLoad;
    img.onerror = handleImageError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [dog.img, getImageUrl]);

  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Prevent card click navigation if clicking favorite button
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFromFavorites(dog.id));
    } else {
      dispatch(addToFavorites(dog.id));
    }
  };

  const handleFlipCard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  // Format age for display
  const formatAge = (ageInDays) => {
    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? `, ${months} mo` : ''}`;
    } else {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };
  
  // Get age category for badge
  const getAgeCategory = (ageInDays) => {
    if (ageInDays < 365) return { label: 'Puppy', color: theme.palette.info.main };
    if (ageInDays < 365 * 3) return { label: 'Young', color: theme.palette.success.main };
    if (ageInDays < 365 * 8) return { label: 'Adult', color: theme.palette.warning.main };
    return { label: 'Senior', color: theme.palette.error.main };
  };
  
  const ageCategory = getAgeCategory(dog.age);

  return (
    <Grow in={true} timeout={300}>
      <Box
        sx={{
          height: '100%',
          perspective: '1000px',
          width: '100%',
        }}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'transform 0.6s ease-in-out, box-shadow 0.2s ease-in-out',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: isFlipped ? theme.shadows[8] : theme.shadows[3],
            '&:hover': {
              transform: isFlipped 
                ? 'rotateY(180deg) translateY(-4px)' 
                : 'rotateY(0) translateY(-4px)',
              boxShadow: theme.shadows[8],
            },
          }}
          component={RouterLink}
          to={`/dogs/${dog.id}`}
          style={{ textDecoration: 'none' }}
        >
          {/* Front Side of Card */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ position: 'relative', height: 200 }}>
              {!imageLoaded && (
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={200} 
                  animation="wave"
                  sx={{ position: 'absolute', top: 0, left: 0 }} 
                />
              )}
              <CardMedia
                component="img"
                height="200"
                image={imageError ? getImageUrl() : (dog.img || getImageUrl())}
                alt={`A photo of ${dog.name}, a ${dog.breed} dog`}
                sx={{ 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  display: imageLoaded ? 'block' : 'none'
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
              
              {/* Age Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 2,
                }}
              >
                <Chip
                  label={ageCategory.label}
                  size="small"
                  sx={{
                    backgroundColor: `${ageCategory.color}`,
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </Box>
              
              {/* Favorite Button */}
              <Tooltip
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                placement="top"
                TransitionComponent={Zoom}
                arrow
              >
                <IconButton
                  color={isFavorite ? 'error' : 'default'}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: favoriteHover ? 'scale(1.2)' : 'scale(1.1)',
                    },
                    zIndex: 2,
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: isFavorite ? 'heartbeat 1.5s ease-in-out 1' : 'none',
                    '@keyframes heartbeat': {
                      '0%': { transform: 'scale(1)' },
                      '25%': { transform: 'scale(1.2)' },
                      '50%': { transform: 'scale(1)' },
                      '75%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }}
                  onClick={handleToggleFavorite}
                  onMouseEnter={() => setFavoriteHover(true)}
                  onMouseLeave={() => setFavoriteHover(false)}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  size="small"
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>

              {/* Flip Card Button */}
              <Tooltip
                title="See more details"
                placement="left"
                TransitionComponent={Zoom}
                arrow
              >
                <IconButton
                  color="primary"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'rotate(180deg)',
                    },
                    zIndex: 2,
                    transition: 'transform 0.3s ease',
                  }}
                  onClick={handleFlipCard}
                  aria-label="Flip card"
                  size="small"
                >
                  <FlipCameraAndroidIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography gutterBottom variant="h5" component="h2" sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' 
              }}>
                {dog.name}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                <Chip
                  icon={<PetsIcon />}
                  label={dog.breed}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
                <Chip
                  icon={<CakeIcon />}
                  label={formatAge(dog.age)}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              </Box>

              <Box display="flex" alignItems="center">
                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {dog.zip_code}
                </Typography>
              </Box>
            </CardContent>

            {/* Only show card actions if hideActions is false */}
            {!hideActions && (
              <CardActions sx={{ 
                justifyContent: 'space-between', 
                p: 2,
                backgroundColor: isFlipped ? 'background.paper' : 'inherit'
              }}>
                <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
                  <IconButton 
                    onClick={handleToggleFavorite}
                    color={isFavorite ? "error" : "default"}
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Flip card for more info" arrow>
                  <IconButton 
                    onClick={handleFlipCard}
                    color="primary"
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <FlipCameraAndroidIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            )}
          </Box>
          
          {/* Back Side of Card */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.palette.background.paper,
              p: 3,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              About {dog.name}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                Breed
              </Typography>
              <Typography variant="body1" gutterBottom>
                {dog.breed}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                Age
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1">
                  {formatAge(dog.age)} ({ageCategory.label})
                </Typography>
                <Box
                  sx={{
                    ml: 1,
                    width: '100%',
                    maxWidth: 120,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${Math.min(100, (dog.age / (365 * 15)) * 100)}%`,
                      height: '100%',
                      bgcolor: ageCategory.color,
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                Location
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {dog.zip_code}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 'auto' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleFlipCard}
                fullWidth
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                Back to Photo
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Grow>
  );
};

export default React.memo(DogCard, (prevProps, nextProps) => {
  return prevProps.dog.id === nextProps.dog.id && 
         prevProps.isFavorite === nextProps.isFavorite;
}); 