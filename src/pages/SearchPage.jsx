import React, { useEffect, useCallback } from 'react';
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
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
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
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {Array.from(new Array(skeletonCount)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={`skeleton-${index}`}>
              <DogCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Paper>
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
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom mt={3}>
        Find Your Perfect Dog
      </Typography>
      
      <Grid container spacing={3}>
        {/* Sidebar with filters */}
        <Grid item xs={12} md={3} lg={3}>
          <DogFilter onFilterChange={handleFilterChange} />
        </Grid>

        {/* Main content with dog cards */}
        <Grid item xs={12} md={9} lg={9}>
          {/* Results header with count and sorting */}
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

          {/* Loading skeletons */}
          {isLoading && renderSkeletons()}

          {/* Error message */}
          {error && !isLoading && (
            <ErrorState 
              type={getErrorType(error)}
              message={error}
              onRetry={handleRetry}
              actionText="Try Again"
            />
          )}

          {/* No results message */}
          {!isLoading && !error && dogs.length === 0 && (
            <EmptyState 
              type="dogs"
              primaryAction={handleResetFilters}
              primaryActionText="Reset Filters"
              message="We couldn't find any dogs matching your search criteria. Try adjusting your filters to broaden your search."
            />
          )}

          {/* Virtualized Dog Grid */}
          {!isLoading && !error && dogs.length > 0 && (
            <>
              <Paper elevation={1} sx={{ height: 800, mb: 3, borderRadius: 2, overflow: 'hidden' }}>
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
              </Paper>

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
                    siblingCount={1}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(SearchPage);