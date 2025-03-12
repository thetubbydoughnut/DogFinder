import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Alert,
  AlertTitle,
  Pagination,
  Divider,
  useMediaQuery,
  Paper,
  useTheme,
} from '@mui/material';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import DogCard from '../features/dogs/components/DogCard';
import DogFilter from '../features/dogs/components/DogFilter';
import SortSelector from '../features/dogs/components/SortSelector';
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

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Calculate grid layout based on screen size
  const getColumnCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    return 4; // xl screens
  };

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

          {/* Loading indicator */}
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={10}>
              <CircularProgress />
            </Box>
          ) : null}

          {/* Error message */}
          {error && !isLoading ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          ) : null}

          {/* No results message */}
          {!isLoading && !error && dogs.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>No Dogs Found</AlertTitle>
              Try adjusting your search filters to find dogs.
            </Alert>
          ) : null}

          {/* Virtualized Dog Grid */}
          {!isLoading && !error && dogs.length > 0 ? (
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
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(SearchPage);