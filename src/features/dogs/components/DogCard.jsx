import React from 'react';
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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { addFavorite, removeFavorite } from '../../favorites/slice';

const DogCard = ({ dog }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.includes(dog.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(dog.id));
    } else {
      dispatch(addFavorite(dog.id));
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <IconButton
        color={isFavorite ? 'error' : 'default'}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
        onClick={toggleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      <CardMedia
        component="img"
        height="200"
        image={dog.img}
        alt={dog.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {dog.name}
        </Typography>

        <Box display="flex" alignItems="center" mb={1}>
          <Chip
            label={dog.breed}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`${dog.age} years`}
            size="small"
            sx={{ mr: 1 }}
          />
        </Box>

        <Box display="flex" alignItems="center">
          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {dog.zip_code}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={toggleFavorite}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default DogCard; 