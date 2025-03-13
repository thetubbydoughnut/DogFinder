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
  Chip,
  Fade,
  Button,
  Divider,
  Card,
  Stack,
  alpha,
  LinearProgress,
} from '@mui/material';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import SearchIcon from '@mui/icons-material/Search';
import PetsIcon from '@mui/icons-material/Pets';
import TuneIcon from '@mui/icons-material/Tune';
import FilterListIcon from '@mui/icons-material/FilterList';
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

const SearchPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [showFilters, setShowFilters] = useState(!isMobile);
  
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

  // Toggle filters display on mobile
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Update showFilters state when screen size changes
  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);

  // Fetch dogs on component mount and when search parameters change
  useEffect(() => {
    dispatch(fetchDogs({ 
      filters, 
      page, 
      size: pageSize, 
      sort: sortOption 
    }));
  }, [dispatch, filters, page, pageSize, sortOption]);

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

  // Calculate grid layout based on screen size - wrapped in useCallback
  const getColumnCount = useCallback(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    return 4; // xl screens
  }, [isMobile, isTablet, isDesktop]);

  // Cell renderer for virtualized grid
  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const columnCount = getColumnCount();
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= dogs.length) {
      return null;
    }
    
    const dog = dogs[index];
    
    return (
      <div style={{
        ...style,
        padding: 16,
      }}>
        <DogCard dog={dog} />
      </div>
    );
  }, [dogs, getColumnCount]);

  // Generate a skeleton loading grid based on screen size
  const renderSkeletons = () => {
    const columnCount = getColumnCount();
    const skeletonCount = columnCount * 2; // Show 2 rows of skeletons
    
    return (
      <Grid container spacing={2}>
        {Array.from(new Array(skeletonCount)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={`skeleton-${index}`}>
            <DogCardSkeleton />
          </Grid>
        ))}
      </Grid>
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

  // Render active filters as chips
  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.breeds && filters.breeds.length > 0) {
      activeFilters.push(
        <Chip 
          key="breeds" 
          label={`${filters.breeds.length} Breed${filters.breeds.length !== 1 ? 's' : ''}`}
          color="primary" 
          onDelete={handleResetFilters}
          size="small"
          sx={{ m: 0.5 }}
        />
      );
    }
    
    if (filters.ageMin !== undefined) {
      activeFilters.push(
        <Chip 
          key="ageMin" 
          label={`Min Age: ${Math.floor(filters.ageMin / 365)} yr`}
          color="primary" 
          onDelete={handleResetFilters}
          size="small"
          sx={{ m: 0.5 }}
        />
      );
    }
    
    if (filters.ageMax !== undefined) {
      activeFilters.push(
        <Chip 
          key="ageMax" 
          label={`Max Age: ${Math.floor(filters.ageMax / 365)} yr`}
          color="primary" 
          onDelete={handleResetFilters}
          size="small"
          sx={{ m: 0.5 }}
        />
      );
    }
    
    if (filters.zipCodes && filters.zipCodes.length > 0) {
      activeFilters.push(
        <Chip 
          key="location" 
          label={`${filters.zipCodes.length} Location${filters.zipCodes.length !== 1 ? 's' : ''}`}
          color="primary" 
          onDelete={handleResetFilters}
          size="small"
          sx={{ m: 0.5 }}
        />
      );
    }
    
    if (activeFilters.length === 0) {
      return null;
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <FilterListIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">Active filters:</Typography>
        </Box>
        {activeFilters}
        {activeFilters.length > 0 && (
          <Button 
            size="small" 
            onClick={handleResetFilters}
            sx={{ ml: 1, fontSize: '0.75rem' }}
          >
            Clear All
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(to right, ${alpha(theme.palette.primary.dark, 0.8)}, ${alpha(theme.palette.secondary.dark, 0.8)})`
            : `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.8)}, ${alpha(theme.palette.secondary.light, 0.8)})`,
          py: { xs: 4, md: 6 },
          px: 2,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url("https://images.unsplash.com/photo-1624927637280-f032183233b7")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  backgroundImage: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #fff, #e0e0e0)'
                    : 'linear-gradient(45deg, #1a237e, #3f51b5)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Find Your Perfect Dog
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: '80%', lineHeight: 1.4 }}
              >
                Search through thousands of adoptable dogs to find your new best friend
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={toggleFilters}
                  sx={{ 
                    px: 3, 
                    py: 1.5, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Start Searching
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<TuneIcon />}
                  onClick={toggleFilters}
                  sx={{ 
                    px: 3, 
                    py: 1.5, 
                    borderRadius: 2,
                    textTransform: 'none',
                    display: { xs: 'flex', md: 'none' }
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  height: 300,
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 4,
                  boxShadow: theme.shadows[20],
                  transform: 'rotate(2deg)'
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1534351450181-ea9f78427fe8"
                  alt="Happy dog"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Loading indicator */}
        {isLoading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress color="primary" />
          </Box>
        )}
        
        <Grid container spacing={3}>
          {/* Sidebar with filters */}
          <Fade in={showFilters || !isMobile}>
            <Grid 
              item 
              xs={12} 
              md={3} 
              lg={3}
              sx={{ 
                display: showFilters ? 'block' : 'none',
                [theme.breakpoints.up('md')]: {
                  display: 'block'
                }
              }}
            >
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'visible',
                  position: 'sticky',
                  top: theme.spacing(3),
                  mb: 2,
                }}
              >
                <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TuneIcon />
                    <Typography variant="h6" fontWeight="bold">Search Filters</Typography>
                  </Stack>
                </Box>
                <DogFilter onFilterChange={handleFilterChange} />
              </Card>
            </Grid>
          </Fade>

          {/* Main content with dog cards */}
          <Grid item xs={12} md={showFilters ? 9 : 12} lg={showFilters ? 9 : 12}>
            {/* Results header with count and sorting */}
            <Card 
              elevation={3} 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: 3,
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {isLoading ? (
                      'Searching for dogs...'
                    ) : error ? (
                      'Search Results Unavailable'
                    ) : total === 0 ? (
                      'No dogs found'
                    ) : (
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PetsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Found {total} dog{total !== 1 ? 's' : ''}
                      </Box>
                    )}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {isLoading ? 
                      'Please wait while we fetch the best matches for you...' : 
                      !error && total > 0 ? 
                      'Showing page ' + (page + 1) + ' of ' + totalPages : 
                      ''}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isMobile && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<TuneIcon />}
                      onClick={toggleFilters}
                      sx={{ mr: 2 }}
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                  )}
                  <SortSelector />
                </Box>
              </Box>
              
              {/* Active filters */}
              {renderActiveFilters()}
            </Card>

            {/* Loading skeletons */}
            {isLoading && renderSkeletons()}

            {/* Error message */}
            {error && !isLoading && (
              <Card elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <ErrorState 
                  type={getErrorType(error)}
                  message={error}
                  onRetry={handleRetry}
                  actionText="Try Again"
                />
              </Card>
            )}

            {/* No results message */}
            {!isLoading && !error && dogs.length === 0 && (
              <Card elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <EmptyState 
                  type="dogs"
                  primaryAction={handleResetFilters}
                  primaryActionText="Reset Filters"
                  message="We couldn't find any dogs matching your search criteria. Try adjusting your filters to broaden your search."
                />
              </Card>
            )}

            {/* Virtualized Dog Grid */}
            {!isLoading && !error && dogs.length > 0 && (
              <>
                <Card elevation={3} sx={{ height: 800, mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                  <AutoSizer>
                    {({ height, width }) => {
                      const columnCount = getColumnCount();
                      const rowCount = Math.ceil(dogs.length / columnCount);
                      const columnWidth = width / columnCount;
                      const rowHeight = 450; // Adjust based on your card height
                      
                      return (
                        <FixedSizeGrid
                          columnCount={columnCount}
                          columnWidth={columnWidth}
                          height={height}
                          rowCount={rowCount}
                          rowHeight={rowHeight}
                          width={width}
                        >
                          {Cell}
                        </FixedSizeGrid>
                      );
                    }}
                  </AutoSizer>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '30px 0',
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page + 1} // Convert 0-indexed to 1-indexed for UI
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      siblingCount={isMobile ? 0 : 1}
                      size={isMobile ? "small" : "medium"}
                      variant="outlined"
                      shape="rounded"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default React.memo(SearchPage);