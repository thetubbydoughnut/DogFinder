import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Stack,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Collapse,
  Tooltip
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CachedIcon from '@mui/icons-material/Cached';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DogIcon from '@mui/icons-material/Pets';
import BreedIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import cacheService from '../../services/cacheService';

/**
 * Calculates approximate localStorage usage for cache keys
 * @returns {Object} Object with usage stats
 */
const calculateCacheUsage = () => {
  try {
    const cacheSizes = {
      dogs: 0,
      breeds: 0,
      searches: 0,
      total: 0,
      count: 0,
    };
    
    // Calculate sizes for different cache types
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key);
      const size = (value?.length || 0) * 2; // Approximate bytes (2 bytes per character)
      
      if (key.startsWith(cacheService.CACHE_CONFIG.DOGS_BY_ID)) {
        cacheSizes.dogs += size;
      } else if (key.startsWith(cacheService.CACHE_CONFIG.BREEDS)) {
        cacheSizes.breeds += size;
      } else if (key.startsWith(cacheService.CACHE_CONFIG.DOGS_SEARCH)) {
        cacheSizes.searches += size;
      }
      
      if (key.startsWith('dogs_') || key.includes('cache')) {
        cacheSizes.total += size;
        cacheSizes.count += 1;
      }
    });
    
    return cacheSizes;
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return { total: 0, dogs: 0, breeds: 0, searches: 0, count: 0 };
  }
};

/**
 * Format bytes to human-readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size string
 */
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const CacheManager = ({ inFooter = false }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [cacheUsage, setCacheUsage] = useState({ total: 0, dogs: 0, breeds: 0, searches: 0, count: 0 });
  const [cacheUsed, setCacheUsed] = useState(false);
  const [lastCleared, setLastCleared] = useState(null);
  
  // Listen for console logs to detect cache usage
  useEffect(() => {
    const originalConsoleLog = console.log;
    
    console.log = function(...args) {
      // Check if this is a cache hit message
      if (typeof args[0] === 'string' && (args[0].includes('Cache hit') || args[0].includes('Using cached'))) {
        setCacheUsed(true);
        
        // Auto-hide cache used notification after 5 seconds
        setTimeout(() => setCacheUsed(false), 5000);
      }
      
      // Call the original console.log
      originalConsoleLog.apply(console, args);
    };
    
    // Restore original on cleanup
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);
  
  // Calculate cache usage when component mounts or expands
  useEffect(() => {
    if (expanded) {
      setCacheUsage(calculateCacheUsage());
    }
  }, [expanded]);
  
  // Clear specific cache
  const handleClearCache = (cacheType) => {
    if (cacheType === 'all') {
      cacheService.clearAllCaches();
    } else if (cacheType === 'dogs') {
      cacheService.clearCache(cacheService.CACHE_CONFIG.DOGS_BY_ID);
    } else if (cacheType === 'breeds') {
      cacheService.clearCache(cacheService.CACHE_CONFIG.BREEDS);
    } else if (cacheType === 'searches') {
      cacheService.clearCache(cacheService.CACHE_CONFIG.DOGS_SEARCH);
    }
    
    // Update cache usage stats
    setCacheUsage(calculateCacheUsage());
    setLastCleared(new Date().toLocaleTimeString());
  };
  
  return (
    <Card 
      elevation={inFooter ? 0 : 3}
      sx={{
        position: inFooter ? 'relative' : 'fixed',
        bottom: inFooter ? 'auto' : 16,
        right: inFooter ? 'auto' : 16,
        zIndex: inFooter ? 'auto' : 1000,
        width: expanded ? (inFooter ? '100%' : 300) : 'auto',
        borderRadius: inFooter ? 1 : 2,
        overflow: 'visible',
        transition: 'all 0.3s ease',
        opacity: cacheUsed || expanded ? 1 : 0.7,
        '&:hover': {
          opacity: 1,
          transform: inFooter ? 'none' : 'translateY(-4px)',
          boxShadow: inFooter ? 'none' : theme.shadows[6],
        },
        border: inFooter ? 'none' : undefined,
      }}
    >
      {/* Cache used notification - only show when not in footer */}
      {cacheUsed && !expanded && !inFooter && (
        <Chip
          icon={<CachedIcon />}
          label="Using cached data"
          color="success"
          sx={{
            position: 'absolute',
            top: -20,
            right: 0,
            animation: 'fadeIn 0.3s ease-in',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        />
      )}
      
      {/* Main button */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: inFooter ? 1.5 : 1,
          cursor: 'pointer',
          bgcolor: expanded ? alpha(theme.palette.primary.main, 0.1) : 'background.paper',
          borderRadius: inFooter ? 1 : undefined,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CachedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="button" color="primary">
            {expanded ? 'Dog Cache Manager' : 'Cache'}
          </Typography>
        </Box>
        <IconButton size="small" color="primary">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      {/* Expanded content */}
      <Collapse in={expanded}>
        <Divider />
        <CardContent>
          <Typography variant="body2" gutterBottom>
            Cached data helps the app work even when the API is unavailable.
          </Typography>
          
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Cache statistics */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Cache Storage ({cacheUsage.count} items)
              </Typography>
              <Box 
                sx={{ 
                  height: 8, 
                  borderRadius: 1, 
                  bgcolor: alpha(theme.palette.grey[400], 0.3),
                  mt: 0.5,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${Math.min(100, (cacheUsage.total / (5 * 1024 * 1024)) * 100)}%`,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatSize(cacheUsage.total)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  5 MB Limit
                </Typography>
              </Box>
            </Box>
            
            {/* Cache types */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DogIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                  <Typography variant="body2">Dogs</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    {formatSize(cacheUsage.dogs)}
                  </Typography>
                  <Tooltip title="Clear dog cache">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCache('dogs');
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BreedIcon fontSize="small" sx={{ mr: 0.5, color: 'secondary.main' }} />
                  <Typography variant="body2">Breeds</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    {formatSize(cacheUsage.breeds)}
                  </Typography>
                  <Tooltip title="Clear breed cache">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCache('breeds');
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon fontSize="small" sx={{ mr: 0.5, color: 'info.main' }} />
                  <Typography variant="body2">Searches</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    {formatSize(cacheUsage.searches)}
                  </Typography>
                  <Tooltip title="Clear search cache">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCache('searches');
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            
            {/* Clear all button */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ClearIcon />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClearCache('all');
              }}
            >
              Clear All Caches
            </Button>
            
            {lastCleared && (
              <Typography variant="caption" color="text.secondary" align="center">
                Last cleared: {lastCleared}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CacheManager; 