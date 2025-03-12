import React, { useState } from 'react';
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
  Link,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import { addToFavorites, removeFromFavorites } from '../../favorites/slice';
import { Link as RouterLink } from 'react-router-dom';

const DogCard = ({ dog }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.includes(dog.id);
  
  const [favoriteHover, setFavoriteHover] = useState(false);

  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Prevent card click navigation if clicking favorite button
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFromFavorites(dog.id));
    } else {
      dispatch(addToFavorites(dog.id));
    }
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

  // Generate a random placeholder image based on dog id for consistency
  const getImageUrl = () => {
    // Use the first characters of the dog ID to generate a consistent random image
    const seed = dog.id.substring(0, 8);
    return `https://placedog.net/500/280?id=${seed}`;
  };

  return (
    <Grow in={true} timeout={300}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme) => theme.shadows[8],
          },
          borderRadius: 2,
          overflow: 'hidden',
        }}
        elevation={3}
        component={RouterLink}
        to={`/dogs/${dog.id}`}
        style={{ textDecoration: 'none' }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={dog.img || getImageUrl()}
            alt={`A photo of ${dog.name}, a ${dog.breed} dog`}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
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
                  transform: favoriteHover ? 'scale(1.1)' : 'scale(1)',
                },
                zIndex: 2,
                transition: 'transform 0.2s ease',
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

        <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
          <Button
            size="small"
            color={isFavorite ? "error" : "primary"}
            onClick={handleToggleFavorite}
            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            sx={{
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            {isFavorite ? 'Remove' : 'Favorite'}
          </Button>
          
          {/* This could be expanded with more actions in the future */}
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            ID: {dog.id.substring(0, 8)}...
          </Typography>
        </CardActions>
      </Card>
    </Grow>
  );
};

export default React.memo(DogCard, (prevProps, nextProps) => {
  return prevProps.dog.id === nextProps.dog.id && 
         prevProps.isFavorite === nextProps.isFavorite;
}); 