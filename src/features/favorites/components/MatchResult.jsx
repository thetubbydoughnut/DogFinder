import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  Button, 
  useTheme, 
  Paper, 
  Zoom, 
  Slide, 
  Fade, 
  Chip, 
  Divider,
  Avatar,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { keyframes } from '@mui/system';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CloseIcon from '@mui/icons-material/Close';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Confetti from 'react-confetti';
import DogCard from '../../dogs/components/DogCard';

// Define animations
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 64, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 64, 129, 0);
  }
`;

const MatchResult = ({ open, onClose, matchedDog }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showConfetti, setShowConfetti] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Handle the animation sequence
  useEffect(() => {
    if (open) {
      // Start with confetti
      setShowConfetti(true);
      
      // Show content after a short delay
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      
      // Show details after content appears
      const detailsTimer = setTimeout(() => {
        setShowDetails(true);
      }, 1500);
      
      // Hide confetti after 5 seconds
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => {
        clearTimeout(contentTimer);
        clearTimeout(detailsTimer);
        clearTimeout(confettiTimer);
      };
    } else {
      setShowContent(false);
      setShowDetails(false);
      setShowConfetti(false);
    }
  }, [open]);
  
  const handleClose = () => {
    // First hide animations
    setShowContent(false);
    setShowDetails(false);
    
    // Then call the actual close after animations complete
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!matchedDog) return null;
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background: 'transparent',
          boxShadow: 'none',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }
      }}
    >
      {/* Confetti animation */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={true} />}
      
      <Fade in={showContent} timeout={800}>
        <Paper 
          elevation={24}
          sx={{ 
            overflow: 'hidden', 
            borderRadius: 4,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Header */}
          <Box sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            p: isMobile ? 2 : 3,
            position: 'relative',
          }}>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8, 
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <DialogTitle sx={{ textAlign: 'center', p: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                animation: `${bounce} 1s ease`,
              }}>
                <CelebrationIcon sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h4" component="span" fontWeight="bold" color="white">
                  It's a Match!
                </Typography>
                <CelebrationIcon sx={{ fontSize: 30, ml: 1 }} />
              </Box>
              
              <Typography variant="subtitle1" color="white" sx={{ mt: 1, opacity: 0.9 }}>
                We found your perfect companion!
              </Typography>
            </DialogTitle>
          </Box>
          
          {/* Main content */}
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'stretch',
              height: '100%',
            }}>
              {/* Left side - Dog image */}
              <Box 
                sx={{ 
                  flex: 1,
                  position: 'relative',
                  height: isMobile ? 300 : 'auto',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                }}
              >
                <Slide direction="right" in={showContent} timeout={800}>
                  <img 
                    src={matchedDog.img} 
                    alt={matchedDog.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      animation: `${pulse} 2s infinite`,
                    }} 
                  />
                </Slide>
                
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 16, 
                  right: 16, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  boxShadow: 2,
                }}>
                  <Typography variant="h6">
                    {matchedDog.breed}
                  </Typography>
                </Box>
              </Box>
              
              {/* Right side - Dog details */}
              <Box sx={{ 
                flex: 1,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <Fade in={showDetails} timeout={1000}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PetsIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {matchedDog.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {matchedDog.zip_code}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <strong>Age:</strong> {matchedDog.age} years
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Traits:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip label={matchedDog.size} size="small" color="primary" variant="outlined" />
                        <Chip label={matchedDog.gender} size="small" color="secondary" variant="outlined" />
                        {matchedDog.gender === "Female" ? 
                          <Chip label="Girl" size="small" color="error" /> : 
                          <Chip label="Boy" size="small" color="info" />
                        }
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 3 }}>
                      "{matchedDog.name} is looking forward to meeting you and becoming your new best friend. 
                      Based on your preferences, we think you two are perfect for each other!"
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mb: 2
                    }}>
                      <IconButton color="primary" sx={{ border: '1px solid', borderColor: 'primary.light' }}>
                        <ShareIcon />
                      </IconButton>
                      <IconButton color="primary" sx={{ border: '1px solid', borderColor: 'primary.light' }}>
                        <DownloadIcon />
                      </IconButton>
                      <IconButton color="error" sx={{ border: '1px solid', borderColor: 'error.light' }}>
                        <FavoriteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Fade>
                
                <DialogActions sx={{ p: 0, mt: 2, justifyContent: 'center' }}>
                  <Button
                    onClick={handleClose}
                    color="primary"
                    variant="contained"
                    size="large"
                    sx={{ 
                      px: 4,
                      borderRadius: 5,
                      boxShadow: 3,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 5,
                      }
                    }}
                  >
                    Great! I'll keep looking
                  </Button>
                </DialogActions>
              </Box>
            </Box>
          </DialogContent>
        </Paper>
      </Fade>
    </Dialog>
  );
};

export default MatchResult; 