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
  Skeleton,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { addToFavorites, removeFromFavorites } from '../../favorites/slice';
import { Link as RouterLink } from 'react-router-dom';

const MotionCard = motion(Card);
const MotionCardMedia = motion(CardMedia);
const MotionIconButton = motion(IconButton);

const cardVariants = {
  hover: { 
    y: -8, 
    boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 17 
    }
  }
};

const favoriteButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.95 },
  favorited: { 
    scale: [1, 1.5, 1], 
    transition: { 
      duration: 0.5,
      ease: "easeInOut" 
    }
  }
};

const flipButtonVariants = {
  hover: { 
    rotate: 180,
    transition: { duration: 0.3 }
  }
};

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
    <motion.div
      style={{
        height: '100%',
        perspective: '1000px',
        width: '100%',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={{
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          width: '100%',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Front of card */}
        <MotionCard
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            width: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: 2,
            overflow: 'hidden',
          }}
          component={RouterLink}
          to={`/dogs/${dog.id}`}
          style={{ textDecoration: 'none' }}
          whileHover="hover"
          variants={cardVariants}
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
            <MotionCardMedia
              component="img"
              height="200"
              image={imageError ? getImageUrl() : (dog.img || getImageUrl())}
              alt={`A photo of ${dog.name}, a ${dog.breed} dog`}
              sx={{ 
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none'
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Age Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
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
            </motion.div>
            
            {/* Favorite Button */}
            <Tooltip
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              placement="top"
              TransitionComponent={Zoom}
              arrow
            >
              <MotionIconButton
                color={isFavorite ? 'error' : 'default'}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 2,
                }}
                onClick={handleToggleFavorite}
                onMouseEnter={() => setFavoriteHover(true)}
                onMouseLeave={() => setFavoriteHover(false)}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                size="small"
                variants={favoriteButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={isFavorite ? "favorited" : "initial"}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </MotionIconButton>
            </Tooltip>

            {/* Flip Card Button */}
            <Tooltip
              title="See more details"
              placement="left"
              TransitionComponent={Zoom}
              arrow
            >
              <MotionIconButton
                color="primary"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 2,
                }}
                onClick={handleFlipCard}
                aria-label="Flip card"
                size="small"
                variants={flipButtonVariants}
                whileHover="hover"
              >
                <FlipCameraAndroidIcon />
              </MotionIconButton>
            </Tooltip>
          </Box>

          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Typography gutterBottom variant="h5" component="h2" sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' 
              }}>
                {dog.name}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Box display="flex" alignItems="center">
                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {dog.zip_code}
                </Typography>
              </Box>
            </motion.div>
          </CardContent>

          {/* Only show card actions if hideActions is false */}
          {!hideActions && (
            <CardActions sx={{ 
              justifyContent: 'space-between', 
              p: 2,
            }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
                  <IconButton 
                    onClick={handleToggleFavorite}
                    color={isFavorite ? "error" : "default"}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Tooltip title="Flip card for more info" arrow>
                  <IconButton 
                    onClick={handleFlipCard}
                    color="primary"
                  >
                    <FlipCameraAndroidIcon />
                  </IconButton>
                </Tooltip>
              </motion.div>
            </CardActions>
          )}
        </MotionCard>

        {/* Back of card */}
        <MotionCard
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            width: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: theme.palette.background.paper,
            p: 3,
            borderRadius: 2,
          }}
          whileHover="hover"
          variants={cardVariants}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              About {dog.name}
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                Breed
              </Typography>
              <Typography variant="body1" gutterBottom>
                {dog.breed}
              </Typography>
            </Box>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
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
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (dog.age / (365 * 15)) * 100)}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{
                      height: '100%',
                      backgroundColor: ageCategory.color,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
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
          </motion.div>
          
          <Box sx={{ mt: 'auto' }}>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleFlipCard}
                fullWidth
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                }}
              >
                Back to Photo
              </Button>
            </motion.div>
          </Box>
        </MotionCard>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(DogCard, (prevProps, nextProps) => {
  return prevProps.dog.id === nextProps.dog.id && 
         prevProps.isFavorite === nextProps.isFavorite;
}); 