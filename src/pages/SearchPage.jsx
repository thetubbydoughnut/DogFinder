import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Container,
  Pagination,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DogCard from '../features/dogs/components/DogCard';
import DogCardSkeleton from '../features/dogs/components/DogCardSkeleton';
import DogFilter from '../features/dogs/components/DogFilter';
import SortSelector from '../features/dogs/components/SortSelector';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import useApiErrorHandler from '../hooks/useApiErrorHandler';
import { 
  fetchDogs, 
  setPage,
  setFilters,
  selectFilteredDogs,
  selectIsLoading,
  selectError,
  selectPagination
} from '../features/dogs/slice';

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Header animation variants
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Filter panel animation variants
const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  in: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  out: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Local state for animations
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Use API error handler hook
  const { retryApiCall } = useApiErrorHandler({
    maxRetries: 3,
    initialDelay: 1500,
  });
  
  // Use memoized selectors
  const dogs = useSelector(selectFilteredDogs);
  const { isLoading, error } = useSelector(state => ({
    isLoading: selectIsLoading(state),
    error: selectError(state)
  }));
  const { total, page, pageSize } = useSelector(selectPagination);
  const filters = useSelector(state => state.dogs.filters);
  const sortOption = useSelector(state => state.dogs.sortOption);

  // Fetch dogs on component mount and when search parameters change
  useEffect(() => {
    dispatch(fetchDogs({ 
      filters, 
      page, 
      size: pageSize, 
      sort: sortOption 
    }));
    
    // Mark initial load as completed after first fetch
    if (isInitialLoad) {
      setTimeout(() => setIsInitialLoad(false), 1000);
    }
  }, [dispatch, filters, page, pageSize, sortOption, isInitialLoad]);

  // Handle page change with useCallback
  const handlePageChange = useCallback((event, value) => {
    dispatch(setPage(value - 1)); // API is 0-indexed, UI is 1-indexed
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [dispatch]);

  // Handle filter change with useCallback
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Handle retry for fetching dogs
  const handleRetry = useCallback(() => {
    retryApiCall(() => 
      dispatch(fetchDogs({ 
        filters, 
        page, 
        size: pageSize, 
        sort: sortOption 
      }))
    );
  }, [dispatch, filters, page, pageSize, sortOption, retryApiCall]);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    dispatch(setFilters({
      breeds: [],
      ageMin: undefined,
      ageMax: undefined,
      zipCodes: undefined,
    }));
  }, [dispatch]);

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Generate a skeleton loading grid based on screen size
  const renderSkeletons = () => {
    const getColumnCount = () => {
      if (isMobile) return 1;
      if (isTablet) return 2;
      if (isLargeScreen) return 3;
      return 4;
    };
    
    const columnCount = getColumnCount();
    const skeletonCount = columnCount * 2; // Show 2 rows of skeletons
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {Array.from(new Array(skeletonCount)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={`skeleton-${index}`}>
                <DogCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>
    );
  };

  // Determine the error type
  const getErrorType = (errorMessage) => {
    if (!errorMessage) return 'general';
    
    if (errorMessage.includes('network') || 
        errorMessage.includes('Network') || 
        errorMessage.includes('offline') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ETIMEDOUT')) {
      return 'network';
    }
    
    return 'api';
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      <Container maxWidth="xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <Typography variant="h4" component="h1" gutterBottom mt={3}>
            Find Your Perfect Dog
          </Typography>
        </motion.div>
        
        <Grid container spacing={3}>
          {/* Sidebar with filters */}
          <Grid item xs={12} md={3} lg={3}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={filterVariants}
            >
              <DogFilter onFilterChange={handleFilterChange} />
            </motion.div>
          </Grid>

          {/* Main content with dog cards */}
          <Grid item xs={12} md={9} lg={9}>
            {/* Results header with count and sorting */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 2,
                  borderRadius: 2
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {isLoading ? (
                    'Searching for dogs...'
                  ) : error ? (
                    'Unable to display results'
                  ) : total === 0 ? (
                    'No dogs found. Try adjusting your filters.'
                  ) : (
                    `Found ${total} dog${total !== 1 ? 's' : ''}`
                  )}
                </Typography>
                
                <SortSelector />
              </Paper>
            </motion.div>

            {/* Loading skeletons */}
            <AnimatePresence>
              {isLoading && renderSkeletons()}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ErrorState 
                    type={getErrorType(error)}
                    message={error}
                    onRetry={handleRetry}
                    actionText="Try Again"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* No results message */}
            <AnimatePresence>
              {!isLoading && !error && dogs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmptyState 
                    type="dogs"
                    primaryAction={handleResetFilters}
                    primaryActionText="Reset Filters"
                    message="We couldn't find any dogs matching your search criteria. Try adjusting your filters to broaden your search."
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dog Grid with Framer Motion */}
            <AnimatePresence>
              {!isLoading && !error && dogs.length > 0 && (
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    borderRadius: 2, 
                    minHeight: 300,
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Grid container spacing={3}>
                      {dogs.map((dog, index) => (
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={dog.id}>
                          <motion.div
                            variants={itemVariants}
                            layout
                            transition={{
                              layout: { duration: 0.3, type: "spring" }
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                          >
                            <DogCard dog={dog} />
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                </Paper>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <AnimatePresence>
              {!isLoading && !error && totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.5,
                    delay: 0.2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
                    <Pagination 
                      count={totalPages} 
                      page={page + 1} // API is 0-indexed, UI is 1-indexed
                      onChange={handlePageChange} 
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default SearchPage;